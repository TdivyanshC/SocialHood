"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";

export type LeadStatus =
  | "pending"
  | "in_progress"
  | "answered"
  | "scheduled"
  | "unanswered"
  | "dnc";

export interface OutboundLead {
  id: string;
  tenant_id: string;
  name: string | null;
  phone: string;
  source: "manual" | "csv" | "webhook" | string;
  notes: string | null;
  status: LeadStatus;
  retry_count: number;
  next_call_at: string | null;
  last_called_at: string | null;
  campaign_id: string | null;
  created_at: string;
}

export interface LeadCallLog {
  id: string;
  call_uuid: string | null;
  direction: string | null;
  status: string | null;
  duration_seconds: number | null;
  started_at: string | null;
  ended_at: string | null;
  hangup_cause: string | null;
  recording_url: string | null;
}

export interface LeadCallSummary {
  id: string;
  product_interest: string | null;
  budget: string | null;
  budget_numeric: number | null;
  urgency: string | null;
  lead_score: number | null;
  outcome: string | null;
  summary_text: string | null;
  full_transcript: string | null;
  created_at: string;
}

const TENANT_ID = "krishna_furniture";

function requireClient(): SupabaseClient {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase client unavailable. Check NEXT_PUBLIC_SUPABASE_* env vars.");
  return supabase;
}

export interface FetchLeadsParams {
  tenantId?: string;
  statuses?: LeadStatus[];
  campaignId?: string | null;
  search?: string;
  sortBy?: "status" | "created_at" | "next_call_at";
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
}

export interface FetchLeadsResult {
  rows: OutboundLead[];
  total: number;
}

export async function fetchLeads(params: FetchLeadsParams = {}): Promise<FetchLeadsResult> {
  const {
    tenantId = TENANT_ID,
    statuses,
    campaignId,
    search,
    sortBy = "created_at",
    sortDir = "desc",
    page = 1,
    pageSize = 25,
  } = params;

  const supabase = requireClient();
  let query = supabase
    .from("outbound_leads")
    .select("*", { count: "exact" })
    .eq("tenant_id", tenantId);

  if (statuses && statuses.length > 0) {
    query = query.in("status", statuses);
  }
  if (campaignId) {
    query = query.eq("campaign_id", campaignId);
  }
  if (search && search.trim()) {
    const term = search.trim().replace(/[%,]/g, "");
    query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%`);
  }

  const ascending = sortDir === "asc";
  query = query.order(sortBy, { ascending, nullsFirst: false });

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    rows: (data || []) as OutboundLead[],
    total: count ?? 0,
  };
}

export interface CreateLeadInput {
  name?: string | null;
  phone: string;
  notes?: string | null;
  campaign_id?: string | null;
  source?: "manual" | "csv" | "webhook";
  tenant_id?: string;
}

export async function createLead(input: CreateLeadInput): Promise<OutboundLead> {
  const supabase = requireClient();
  const row = {
    tenant_id: input.tenant_id || TENANT_ID,
    name: input.name?.trim() || null,
    phone: normalizePhone(input.phone),
    notes: input.notes?.trim() || null,
    campaign_id: input.campaign_id || null,
    source: input.source || "manual",
    status: "pending" as LeadStatus,
    retry_count: 0,
  };

  const { data, error } = await supabase
    .from("outbound_leads")
    .insert(row)
    .select("*")
    .single();

  if (error) throw error;
  return data as OutboundLead;
}

export interface BulkUploadRow {
  name?: string;
  phone: string;
  notes?: string;
}

export interface BulkUploadResult {
  added: number;
  skipped: number;
}

export async function bulkUploadLeads(
  rows: BulkUploadRow[],
  campaignId: string | null,
  tenantId: string = TENANT_ID,
): Promise<BulkUploadResult> {
  const supabase = requireClient();
  const cleaned = rows
    .map((r) => ({
      tenant_id: tenantId,
      name: r.name?.toString().trim() || null,
      phone: normalizePhone(r.phone?.toString() ?? ""),
      notes: r.notes?.toString().trim() || null,
      campaign_id: campaignId,
      source: "csv" as const,
      status: "pending" as LeadStatus,
      retry_count: 0,
    }))
    .filter((r) => r.phone);

  if (cleaned.length === 0) return { added: 0, skipped: 0 };

  const { data, error } = await supabase
    .from("outbound_leads")
    .upsert(cleaned, { onConflict: "phone,tenant_id", ignoreDuplicates: true })
    .select("id");

  if (error) throw error;

  const added = data?.length ?? 0;
  const skipped = cleaned.length - added;
  return { added, skipped };
}

export async function updateLeadStatus(
  leadId: string,
  status: LeadStatus,
): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase
    .from("outbound_leads")
    .update({ status })
    .eq("id", leadId);
  if (error) throw error;
}

export async function updateLeadNotes(leadId: string, notes: string): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase
    .from("outbound_leads")
    .update({ notes: notes.trim() || null })
    .eq("id", leadId);
  if (error) throw error;
}

export async function fetchLeadCallHistory(
  phone: string,
  tenantId: string = TENANT_ID,
): Promise<LeadCallLog[]> {
  const supabase = requireClient();
  const normalized = normalizePhone(phone);
  const { data, error } = await supabase
    .from("call_logs")
    .select(
      "id, call_uuid, direction, status, duration_seconds, started_at, ended_at, hangup_cause, recording_url",
    )
    .eq("tenant_id", tenantId)
    .or(`to_number.eq.${normalized},from_number.eq.${normalized}`)
    .order("started_at", { ascending: false });
  if (error) throw error;
  return (data || []) as LeadCallLog[];
}

export async function fetchLeadCallSummaries(
  leadId: string,
  tenantId: string = TENANT_ID,
): Promise<LeadCallSummary[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("call_summaries")
    .select(
      "id, product_interest, budget, budget_numeric, urgency, lead_score, outcome, summary_text, full_transcript, created_at",
    )
    .eq("tenant_id", tenantId)
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as LeadCallSummary[];
}

const PHONE_DIGITS = /\D+/g;

export function normalizePhone(raw: string): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) {
    return "+" + trimmed.slice(1).replace(PHONE_DIGITS, "");
  }
  const digits = trimmed.replace(PHONE_DIGITS, "");
  if (digits.length === 10) return "+91" + digits;
  if (digits.length === 12 && digits.startsWith("91")) return "+" + digits;
  return digits ? "+" + digits : "";
}

export function isValidIndianPhone(raw: string): boolean {
  const normalized = normalizePhone(raw);
  return /^\+91\d{10}$/.test(normalized);
}
