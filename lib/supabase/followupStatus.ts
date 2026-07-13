"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { normalizePhoneBatch } from "@/lib/phone";
import { findVisitDateReferenceTimestamp, resolveRelativeVisitDate } from "@/lib/visitDate";

function requireClient(): SupabaseClient {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase client unavailable. Check NEXT_PUBLIC_SUPABASE_* env vars.");
  return supabase;
}

export type VisitDateSource = "whatsapp" | "call" | "both" | "conflict" | "whatsapp_unparsed" | "none";

export interface ReconciledVisitDate {
  date: string | null;
  whatsappRaw: string | null;
  whatsappDate: string | null;
  callDate: string | null;
  source: VisitDateSource;
}

// Never auto-resolves a conflict, and never guesses at WhatsApp text that
// couldn't be parsed into a date: `date` is only populated when there's
// exactly one usable candidate, both ISO dates agree, or the call side is
// the only usable one (WA text present but unparseable — surfaced as
// "whatsapp_unparsed" rather than silently treated as "call" or ignored, so
// a human still knows there's WA-side text to check). When both sides parse
// to different dates, `date` is null and both raw values are returned.
export function reconcileVisitDate(
  whatsappRaw: string | null,
  whatsappDate: string | null,
  callDate: string | null,
): ReconciledVisitDate {
  if (whatsappRaw && !whatsappDate) {
    return { date: callDate ?? null, whatsappRaw, whatsappDate: null, callDate, source: "whatsapp_unparsed" };
  }
  if (!whatsappDate && !callDate) {
    return { date: null, whatsappRaw, whatsappDate: null, callDate: null, source: "none" };
  }
  if (whatsappDate && !callDate) {
    return { date: whatsappDate, whatsappRaw, whatsappDate, callDate: null, source: "whatsapp" };
  }
  if (!whatsappDate && callDate) {
    return { date: callDate, whatsappRaw, whatsappDate: null, callDate, source: "call" };
  }
  if (whatsappDate === callDate) {
    return { date: whatsappDate, whatsappRaw, whatsappDate, callDate, source: "both" };
  }
  return { date: null, whatsappRaw, whatsappDate, callDate, source: "conflict" };
}

// campaign_type on outbound_leads has no separate "cycle" column — the
// letter suffix on reactivation campaigns (react_a/b/c) is the cycle number.
const CALL_STAGE_BY_CAMPAIGN_TYPE: Record<string, { key: string; label: string }> = {
  fresh_cta: { key: "fresh_1", label: "Fresh Call 1" },
  react_a: { key: "react_1", label: "Reactivation Call 1" },
  react_b: { key: "react_2", label: "Reactivation Call 2" },
  react_c: { key: "react_3", label: "Reactivation Call 3" },
};

export interface CallStage {
  key: string;
  label: string;
}

function deriveCallStage(campaignType: string | null): CallStage | null {
  if (!campaignType) return null;
  return CALL_STAGE_BY_CAMPAIGN_TYPE[campaignType] ?? { key: campaignType, label: campaignType };
}

const CALL_OUTCOME_LABELS: Record<string, string> = {
  answered: "Answered",
  mid_answered: "Partially Answered",
  unanswered: "No Answer",
  pending: "Pending",
  dnc: "Do Not Call",
};

function deriveCallOutcome(status: string | null): string | null {
  if (!status) return null;
  return CALL_OUTCOME_LABELS[status] ?? status;
}

export interface FollowupStatusRow {
  phone: string;
  name: string | null;
  interestedIn: string | null;
  whatsappMessageCount: number;
  lastWhatsappActivity: string | null;
  whatsappVisitStatus: string | null;
  callStage: CallStage | null;
  callStatus: string | null;
  callOutcome: string | null;
  nextCallAt: string | null;
  callVisitStatus: string | null;
  visitDate: ReconciledVisitDate;
}

interface FollowupEntry {
  phone: string;
  name: string | null;
  interestedIn: string | null;
  whatsappMessageCount: number;
  whatsappHistory: { direction: string; content: string | null; created_at: string }[];
  lastWhatsappActivity: string | null;
  whatsappVisitDateRaw: string | null;
  whatsappVisitStatus: string | null;
  campaignType: string | null;
  callStatus: string | null;
  nextCallAt: string | null;
  callVisitDate: string | null;
  callVisitStatus: string | null;
}

function latestMessageTimestamp(
  history: { created_at: string }[] | null | undefined,
): string | null {
  if (!Array.isArray(history) || history.length === 0) return null;
  // conversation_history_full is stored chronologically, but sort defensively
  // rather than assume it.
  return history.reduce<string | null>((latest, m) => {
    if (!m.created_at) return latest;
    return !latest || m.created_at > latest ? m.created_at : latest;
  }, null);
}

// Call-side data is read straight from outbound_leads rather than the voice
// server's get_followup_status(phone) endpoint: that endpoint's URL/auth
// aren't reachable from this codebase. outbound_leads.visit_date is the same
// underlying data it would presumably serve. Swap this block for the real
// endpoint once it's available here.
export async function fetchFollowupStatuses(): Promise<FollowupStatusRow[]> {
  const supabase = requireClient();

  const [{ data: waRows, error: waErr }, { data: callRows, error: callErr }] = await Promise.all([
    supabase
      .from("lead_full_details")
      .select("phone, name, interested_in, visit_date, visit_date_status, conversation_history_full"),
    supabase
      .from("outbound_leads")
      .select("phone, name, status, campaign_type, next_call_at, visit_date, visit_date_status")
      // when a phone has multiple campaign rows, iterate oldest-to-newest so
      // "last one wins" below lands on the most recent campaign enrollment.
      .order("created_at", { ascending: true }),
  ]);
  if (waErr) throw waErr;
  if (callErr) throw callErr;

  const phoneKeys = await normalizePhoneBatch(supabase, [
    ...((waRows || []) as any[]).map((r) => r.phone),
    ...((callRows || []) as any[]).map((r) => r.phone),
  ]);

  const byKey = new Map<string, FollowupEntry>();

  for (const row of (waRows || []) as any[]) {
    const key = phoneKeys.get(row.phone) || "";
    if (!key) continue;
    const history = Array.isArray(row.conversation_history_full) ? row.conversation_history_full : [];
    byKey.set(key, {
      phone: row.phone,
      name: row.name || null,
      interestedIn: row.interested_in ?? null,
      whatsappMessageCount: history.length,
      whatsappHistory: history,
      lastWhatsappActivity: latestMessageTimestamp(history),
      whatsappVisitDateRaw: row.visit_date ?? null,
      whatsappVisitStatus: row.visit_date_status ?? null,
      campaignType: null,
      callStatus: null,
      nextCallAt: null,
      callVisitDate: null,
      callVisitStatus: null,
    });
  }

  // outbound_leads can have more than one row per phone (retries/campaigns);
  // last one read wins here (query is ordered oldest-first), matching the
  // read-model scope of this pass.
  for (const row of (callRows || []) as any[]) {
    const key = phoneKeys.get(row.phone) || "";
    if (!key) continue;
    const existing = byKey.get(key);
    if (existing) {
      existing.name = existing.name || row.name || null;
      existing.campaignType = row.campaign_type ?? null;
      existing.callStatus = row.status ?? null;
      existing.nextCallAt = row.next_call_at ?? null;
      existing.callVisitDate = row.visit_date ?? null;
      existing.callVisitStatus = row.visit_date_status ?? null;
    } else {
      byKey.set(key, {
        phone: row.phone,
        name: row.name || null,
        interestedIn: null,
        whatsappMessageCount: 0,
        whatsappHistory: [],
        lastWhatsappActivity: null,
        whatsappVisitDateRaw: null,
        whatsappVisitStatus: null,
        campaignType: row.campaign_type ?? null,
        callStatus: row.status ?? null,
        nextCallAt: row.next_call_at ?? null,
        callVisitDate: row.visit_date ?? null,
        callVisitStatus: row.visit_date_status ?? null,
      });
    }
  }

  return [...byKey.values()].map((e) => {
    const referenceTs = findVisitDateReferenceTimestamp(e.whatsappHistory, e.whatsappVisitDateRaw);
    const whatsappDate = resolveRelativeVisitDate(e.whatsappVisitDateRaw, referenceTs);
    return {
      phone: e.phone,
      name: e.name,
      interestedIn: e.interestedIn,
      whatsappMessageCount: e.whatsappMessageCount,
      lastWhatsappActivity: e.lastWhatsappActivity,
      whatsappVisitStatus: e.whatsappVisitStatus,
      callStage: deriveCallStage(e.campaignType),
      callStatus: e.callStatus,
      callOutcome: deriveCallOutcome(e.callStatus),
      nextCallAt: e.nextCallAt,
      callVisitStatus: e.callVisitStatus,
      visitDate: reconcileVisitDate(e.whatsappVisitDateRaw, whatsappDate, e.callVisitDate),
    };
  });
}
