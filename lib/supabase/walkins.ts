"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { normalizePhoneBatch } from "@/lib/phone";
import { normalizePhone as formatIndianPhone, isValidIndianPhone } from "@/lib/supabase/leads";

export type WalkinSource = "system" | "offline";

export interface WalkinRow {
  id: string;
  phone: string;
  lead_id: string | null;
  visit_date: string;
  source: WalkinSource;
  visit_number: number;
  budget_manual: number | null;
  budget_wa: number | null;
  followup_calls_made: number;
  converted: boolean;
  converted_date: string | null;
  notes: string | null;
  created_at: string;
}

// The walkins table (owned by the backend team) has no tenant_id column, so
// every query here reads the whole table. Fine while this app serves a
// single tenant (krishna_furniture) — revisit if a second client is onboarded.
const SELECT_COLUMNS =
  "id, phone, lead_id, visit_date, source, visit_number, budget_manual, budget_wa, followup_calls_made, converted, converted_date, notes, created_at";

function requireClient(): SupabaseClient {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase client unavailable. Check NEXT_PUBLIC_SUPABASE_* env vars.");
  return supabase;
}

export async function fetchWalkins(): Promise<WalkinRow[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("walkins")
    .select(SELECT_COLUMNS)
    .order("visit_date", { ascending: false });
  if (error) throw error;
  return (data || []) as WalkinRow[];
}

export interface WalkinTableRow extends WalkinRow {
  leadName: string | null;
}

// walkins has no name column, only phone — the table view resolves a display
// name through lead_id -> outbound_leads.name when a walk-in was matched to
// an existing lead. Rows with no lead_id (or no name on that lead) just show
// the phone number, same as the Leads tab does for unnamed contacts.
export async function fetchWalkinsForTable(): Promise<WalkinTableRow[]> {
  const supabase = requireClient();
  const rows = await fetchWalkins();

  const leadIds = [...new Set(rows.map((r) => r.lead_id).filter((id): id is string => !!id))];
  let nameByLeadId = new Map<string, string | null>();
  if (leadIds.length > 0) {
    const { data: leads, error } = await supabase.from("outbound_leads").select("id, name").in("id", leadIds);
    if (error) throw error;
    nameByLeadId = new Map((leads || []).map((l: any) => [l.id, l.name as string | null]));
  }

  return rows.map((row) => ({
    ...row,
    leadName: row.lead_id ? nameByLeadId.get(row.lead_id) ?? null : null,
  }));
}

export interface CreateWalkinInput {
  phone: string;
  visit_date: string;
  source: WalkinSource;
  visit_number?: number;
  budget_manual?: number | null;
  budget_wa?: number | null;
  followup_calls_made?: number;
  converted?: boolean;
  converted_date?: string | null;
  notes?: string | null;
  lead_id?: string | null;
}

export async function createWalkin(input: CreateWalkinInput): Promise<WalkinRow> {
  const supabase = requireClient();
  const row = {
    phone: formatIndianPhone(input.phone),
    visit_date: input.visit_date,
    source: input.source,
    visit_number: input.visit_number ?? 1,
    budget_manual: input.budget_manual ?? null,
    budget_wa: input.budget_wa ?? null,
    followup_calls_made: input.followup_calls_made ?? 0,
    converted: input.converted ?? false,
    converted_date: input.converted_date ?? null,
    notes: input.notes?.trim() || null,
    lead_id: input.lead_id ?? null,
  };

  const { data, error } = await supabase.from("walkins").insert(row).select(SELECT_COLUMNS).single();
  if (error) throw error;
  return data as WalkinRow;
}

export interface BulkWalkinRow {
  phone: string;
  visit_date: string;
  source?: string;
  visit_number?: string | number;
  budget_manual?: string | number;
  budget_wa?: string | number;
  followup_calls_made?: string | number;
  converted?: string | boolean;
  notes?: string;
}

export interface BulkWalkinResult {
  added: number;
  skipped: number;
  skippedReasons: string[];
}

function parseSource(raw: string | undefined): WalkinSource {
  return (raw || "").trim().toLowerCase() === "system" ? "system" : "offline";
}

function parseIntOrDefault(raw: string | number | undefined, fallback: number): number {
  if (raw == null || raw === "") return fallback;
  const n = typeof raw === "number" ? raw : parseInt(raw, 10);
  return Number.isFinite(n) ? n : fallback;
}

function parseNumberOrNull(raw: string | number | undefined): number | null {
  if (raw == null || raw === "") return null;
  const n = typeof raw === "number" ? raw : Number(String(raw).replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function parseBool(raw: string | boolean | undefined): boolean {
  if (typeof raw === "boolean") return raw;
  const v = (raw || "").toString().trim().toLowerCase();
  return v === "true" || v === "yes" || v === "1";
}

export async function bulkUploadWalkins(rows: BulkWalkinRow[]): Promise<BulkWalkinResult> {
  const supabase = requireClient();
  const skippedReasons: string[] = [];

  const valid = rows.filter((r) => {
    if (!r.phone || !isValidIndianPhone(r.phone)) {
      skippedReasons.push(`Invalid phone: ${r.phone || "(blank)"}`);
      return false;
    }
    if (!r.visit_date) {
      skippedReasons.push(`Missing visit date for ${r.phone}`);
      return false;
    }
    return true;
  });

  if (valid.length === 0) return { added: 0, skipped: rows.length, skippedReasons };

  // No lead_id resolution here: a walkins insert trigger (confirmed against
  // the live table) always re-derives lead_id — and source along with it —
  // from phone against outbound_leads itself, overwriting whatever's sent.
  // Matching client-side would just be a wasted query for a value the
  // database throws away.
  const cleaned = valid.map((r) => ({
    phone: formatIndianPhone(r.phone),
    visit_date: r.visit_date,
    source: parseSource(r.source),
    visit_number: parseIntOrDefault(r.visit_number, 1),
    budget_manual: parseNumberOrNull(r.budget_manual),
    budget_wa: parseNumberOrNull(r.budget_wa),
    followup_calls_made: parseIntOrDefault(r.followup_calls_made, 0),
    converted: parseBool(r.converted),
    converted_date: null,
    notes: r.notes?.toString().trim() || null,
  }));

  const { data, error } = await supabase.from("walkins").insert(cleaned).select("id");
  if (error) throw error;

  const added = data?.length ?? 0;
  return { added, skipped: rows.length - added, skippedReasons };
}

export interface WalkinCardSummary {
  source: WalkinSource;
  visitNumber: number;
  converted: boolean;
}

// Builds a phone -> most-recent-visit summary map for the accent border /
// badges shown on WhatsApp and Call cards. Keyed through normalize_phone()
// (lib/phone.ts) — the same canonical key the voice pipeline uses — rather
// than the +91-prefixed format walkins.phone is stored in, so it still
// matches cards whose phone came from a different upstream format.
export async function fetchWalkinSummaryByPhone(): Promise<Map<string, WalkinCardSummary>> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("walkins")
    .select("phone, source, visit_number, converted, visit_date, created_at")
    .order("visit_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;

  const rows = (data || []) as Pick<
    WalkinRow,
    "phone" | "source" | "visit_number" | "converted" | "visit_date" | "created_at"
  >[];
  const phoneKeys = await normalizePhoneBatch(supabase, rows.map((r) => r.phone));

  const byKey = new Map<string, WalkinCardSummary>();
  for (const row of rows) {
    const key = phoneKeys.get(row.phone) || "";
    // Rows are ordered most-recent-visit-first, so the first row seen per
    // key is that contact's latest walk-in.
    if (!key || byKey.has(key)) continue;
    byKey.set(key, {
      source: row.source,
      visitNumber: row.visit_number ?? 1,
      converted: !!row.converted,
    });
  }
  return byKey;
}

export interface ConversionReport {
  totalWalkins: number;
  bySource: { system: number; offline: number };
  converted: number;
  conversionRate: number;
  byFunnel: { fresh: number; reactivation: number; other: number };
  convertedByFunnel: { fresh: number; reactivation: number; other: number };
}

type Funnel = "fresh" | "reactivation" | "other";

// campaigns has no dedicated fresh/reactivation column, so this is a
// best-effort keyword match on campaign name (confirmed against live data:
// e.g. "Fresh CTA — Always On", "Customer Reactivation — Exchange Offer Jun
// 2026"). Anything that doesn't match either keyword — including walk-ins
// with no lead_id/campaign at all — falls into "other" rather than being
// dropped, so the report stays honest about what it couldn't classify.
function classifyFunnel(campaignName: string | null): Funnel {
  if (!campaignName) return "other";
  const n = campaignName.toLowerCase();
  if (n.includes("reactivation")) return "reactivation";
  if (n.includes("fresh")) return "fresh";
  return "other";
}

export async function fetchConversionReport(): Promise<ConversionReport> {
  const supabase = requireClient();
  const { data: walkins, error } = await supabase.from("walkins").select("source, converted, lead_id");
  if (error) throw error;

  const rows = (walkins || []) as { source: WalkinSource; converted: boolean; lead_id: string | null }[];

  const leadIds = [...new Set(rows.map((r) => r.lead_id).filter((id): id is string => !!id))];
  const funnelByLeadId = new Map<string, Funnel>();

  if (leadIds.length > 0) {
    const { data: leads, error: leadErr } = await supabase
      .from("outbound_leads")
      .select("id, campaign_id")
      .in("id", leadIds);
    if (leadErr) throw leadErr;

    const campaignIds = [
      ...new Set((leads || []).map((l: any) => l.campaign_id).filter((id: string | null): id is string => !!id)),
    ];
    let nameByCampaignId = new Map<string, string>();
    if (campaignIds.length > 0) {
      const { data: campaigns, error: campErr } = await supabase
        .from("campaigns")
        .select("id, name")
        .in("id", campaignIds);
      if (campErr) throw campErr;
      nameByCampaignId = new Map((campaigns || []).map((c: any) => [c.id, c.name as string]));
    }

    for (const lead of (leads || []) as { id: string; campaign_id: string | null }[]) {
      const campaignName = lead.campaign_id ? nameByCampaignId.get(lead.campaign_id) ?? null : null;
      funnelByLeadId.set(lead.id, classifyFunnel(campaignName));
    }
  }

  const report: ConversionReport = {
    totalWalkins: rows.length,
    bySource: { system: 0, offline: 0 },
    converted: 0,
    conversionRate: 0,
    byFunnel: { fresh: 0, reactivation: 0, other: 0 },
    convertedByFunnel: { fresh: 0, reactivation: 0, other: 0 },
  };

  for (const row of rows) {
    report.bySource[row.source === "system" ? "system" : "offline"] += 1;
    if (row.converted) report.converted += 1;

    const funnel: Funnel = row.lead_id ? funnelByLeadId.get(row.lead_id) ?? "other" : "other";
    report.byFunnel[funnel] += 1;
    if (row.converted) report.convertedByFunnel[funnel] += 1;
  }

  report.conversionRate = report.totalWalkins > 0 ? Math.round((report.converted / report.totalWalkins) * 100) : 0;

  return report;
}
