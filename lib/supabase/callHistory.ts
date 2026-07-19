"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { normalizePhoneBatch } from "@/lib/phone";

function requireClient(): SupabaseClient {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase client unavailable. Check NEXT_PUBLIC_SUPABASE_* env vars.");
  return supabase;
}

const TENANT_ID = "krishna_furniture";

export type CallOutcome = "answered" | "mid_answered" | "unanswered";

// Same ground truth as CallsDataDashboard's deriveStatus: call_logs.status
// when present, else turn_count > 0 as a fallback for rows with no matching
// call_logs entry. Shared here rather than duplicated so "answered" can't
// drift into two different definitions across the CRM.
//
// call_logs.status distribution (all-time, this tenant): no_answer 546,
// mid_answered 337, answered 97 — mid_answered (phone picked up, call ended
// in seconds with no real conversation) is over a third of all calls, not an
// edge case. Collapsing it into "unanswered" made a briefly-picked-up call
// look identical to one that never rang through, so it's kept as its own
// outcome. The turn_count fallback can't distinguish mid_answered from
// unanswered — it only fires when call_logs has no row at all.
export function deriveCallOutcome(
  logStatus: string | null | undefined,
  turnCount: number | null | undefined,
): CallOutcome {
  if (typeof logStatus === "string") {
    const s = logStatus.toLowerCase();
    if (s === "answered") return "answered";
    if (s === "mid_answered") return "mid_answered";
    return "unanswered";
  }
  return (turnCount ?? 0) > 0 ? "answered" : "unanswered";
}

export interface CallHistorySummary {
  callsMade: number;
  answeredCount: number;
  midAnsweredCount: number;
  // Phone was actually picked up: answered + mid_answered. null (not 0) when
  // callsMade === 0 — a lead that's never been called has no pickup rate to
  // show, distinct from one that was called and never picked up.
  pickupRate: number | null;
  lastCallAt: string | null;
  lastCallOutcome: CallOutcome | null;
}

interface RawCallRow {
  phone: string;
  turn_count: number | null;
  started_at: string | null;
  created_at: string;
  call_logs: { status: string | null } | { status: string | null }[] | null;
}

async function fetchAllCallRows(supabase: SupabaseClient): Promise<RawCallRow[]> {
  const { data, error } = await supabase
    .from("call_summaries")
    .select("phone, turn_count, started_at, created_at, call_logs(status)")
    .eq("tenant_id", TENANT_ID);
  if (error) throw error;
  return (data || []) as unknown as RawCallRow[];
}

function logOf(row: RawCallRow): { status: string | null } | null {
  return Array.isArray(row.call_logs) ? row.call_logs[0] ?? null : row.call_logs;
}

// Per-lead summary (count, pickup rate, last call) for every phone that has
// ever been called — keyed by normalize_phone()'s canonical form so callers
// can look a WhatsApp lead's raw phone string up after running it through
// the same normalizer (see normalizePhoneBatch usage in WhatsAppDashboard).
export async function fetchCallHistoryByPhone(): Promise<Map<string, CallHistorySummary>> {
  const supabase = requireClient();
  const rows = await fetchAllCallRows(supabase);
  const phoneKeys = await normalizePhoneBatch(supabase, rows.map((r) => r.phone));

  const acc = new Map<string, { callsMade: number; answeredCount: number; midAnsweredCount: number; lastAt: string | null; lastOutcome: CallOutcome | null }>();

  for (const row of rows) {
    const key = phoneKeys.get(row.phone) || row.phone;
    if (!key) continue;
    const outcome = deriveCallOutcome(logOf(row)?.status, row.turn_count);
    const at = row.started_at || row.created_at;

    const entry = acc.get(key) ?? { callsMade: 0, answeredCount: 0, midAnsweredCount: 0, lastAt: null, lastOutcome: null };
    entry.callsMade += 1;
    if (outcome === "answered") entry.answeredCount += 1;
    if (outcome === "mid_answered") entry.midAnsweredCount += 1;
    if (!entry.lastAt || (at && at > entry.lastAt)) {
      entry.lastAt = at;
      entry.lastOutcome = outcome;
    }
    acc.set(key, entry);
  }

  const result = new Map<string, CallHistorySummary>();
  for (const [key, entry] of acc) {
    const pickedUp = entry.answeredCount + entry.midAnsweredCount;
    result.set(key, {
      callsMade: entry.callsMade,
      answeredCount: entry.answeredCount,
      midAnsweredCount: entry.midAnsweredCount,
      pickupRate: entry.callsMade > 0 ? Math.round((pickedUp / entry.callsMade) * 100) : null,
      lastCallAt: entry.lastAt,
      lastCallOutcome: entry.lastOutcome,
    });
  }
  return result;
}

export interface CallHistoryEntry {
  callUuid: string;
  startedAt: string | null;
  outcome: CallOutcome;
  durationSeconds: number;
  campaignType: string | null;
}

interface RawCallDetailRow {
  call_uuid: string;
  phone: string;
  turn_count: number | null;
  started_at: string | null;
  created_at: string;
  campaign_type: string | null;
  call_logs: { status: string | null; duration_seconds: number | null } | { status: string | null; duration_seconds: number | null }[] | null;
}

// Call-by-call detail for one lead, for the modal's expanded view — fetches
// the same table fresh rather than reusing fetchCallHistoryByPhone's result,
// mirroring how fetchConversationMemoryHistory(phone) already fetches
// on-demand per lead rather than keeping every lead's full history in memory.
export async function fetchCallHistoryForPhone(phone: string): Promise<CallHistoryEntry[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("call_summaries")
    .select("call_uuid, phone, turn_count, started_at, created_at, campaign_type, call_logs(status, duration_seconds)")
    .eq("tenant_id", TENANT_ID);
  if (error) throw error;

  const rows = (data || []) as unknown as RawCallDetailRow[];
  const keys = await normalizePhoneBatch(supabase, [...rows.map((r) => r.phone), phone]);
  const targetKey = keys.get(phone);
  if (!targetKey) return [];

  return rows
    .filter((row) => keys.get(row.phone) === targetKey)
    .map((row) => {
      const log = Array.isArray(row.call_logs) ? row.call_logs[0] ?? null : row.call_logs;
      return {
        callUuid: row.call_uuid,
        startedAt: row.started_at || row.created_at,
        outcome: deriveCallOutcome(log?.status, row.turn_count),
        durationSeconds: log?.duration_seconds ?? 0,
        campaignType: row.campaign_type,
      };
    })
    .sort((a, b) => (b.startedAt || "").localeCompare(a.startedAt || ""));
}
