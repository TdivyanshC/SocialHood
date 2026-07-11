"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";

export interface ChatMessage {
  content: string | null;
  direction: "inbound" | "outbound" | string;
  created_at: string;
  message_type: string | null;
}

export interface LeadDashboardRow {
  phone: string;
  source: string | null;
  interested_in: string | null;
  budget: number | null;
  style_preference: string | null;
  selected_product_name: string | null;
  selected_product_price: number | null;
  liked_product_1: string | null;
  liked_product_2: string | null;
  lead_status: string | null;
  score: number | null;
  conversation_summary: string | null;
  last_message: string | null;
  last_contact: string | null;
  interaction_count: number | null;
  created_at: string | null;
  priority: string | null;
  hours_since_contact: string | number | null;
  visit_date: string | null;
  visit_confirmed: boolean;
  conversation_history: ChatMessage[];
  last_shown_names: string[] | null;
  last_shown_prices: number[] | null;
  products_last_shown_at: string | null;
}

function requireClient(): SupabaseClient {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase client unavailable. Check NEXT_PUBLIC_SUPABASE_* env vars.");
  return supabase;
}

function isMeaningfulString(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const v = value.trim().toLowerCase();
  return v !== "" && v !== "null" && v !== "none";
}

function hoursSince(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms)) return null;
  return ms / (1000 * 60 * 60);
}

interface LeadFullDetailsRow {
  phone: string;
  source: string | null;
  interested_in: string | null;
  budget: number | null;
  style_preference: string | null;
  selected_product_name: string | null;
  selected_product_price: number | null;
  liked_product_1: string | null;
  liked_product_2: string | null;
  lead_status: string | null;
  lead_score: string | number | null;
  conversation_summary: string | null;
  last_message: string | null;
  last_contact: string | null;
  interaction_count: number | null;
  created_at: string | null;
  visit_date: string | null;
  visit_date_status: string | null;
  conversation_history_full: ChatMessage[] | null;
  last_shown_names: string[] | null;
  last_shown_prices: number[] | null;
  products_last_shown_at: string | null;
}

// `lead_full_details` replaced the old `lead_dashboard` view (dropped on the
// backend). It's a superset: visit_date/visit_date_status are native columns,
// and conversation_history_full carries the complete chat log (including
// outbound text, which whatsapp_conversations never logged) so the dashboard
// no longer needs a separate per-conversation fetch or the old
// summary/memory backfill heuristics. lead_score arrives as a string, and
// priority/hours_since_contact aren't columns here, so those are derived.
export async function fetchLeadDashboard(): Promise<LeadDashboardRow[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("lead_full_details")
    .select(
      "phone, source, interested_in, budget, style_preference, selected_product_name, selected_product_price, liked_product_1, liked_product_2, lead_status, lead_score, conversation_summary, last_message, last_contact, interaction_count, created_at, visit_date, visit_date_status, conversation_history_full, last_shown_names, last_shown_prices, products_last_shown_at",
    )
    .order("last_contact", { ascending: false, nullsFirst: false });
  if (error) throw error;

  return ((data || []) as LeadFullDetailsRow[]).map((row) => ({
    ...row,
    score: row.lead_score != null ? Number(row.lead_score) : null,
    priority: row.lead_status,
    hours_since_contact: hoursSince(row.last_contact ?? row.created_at),
    visit_date: isMeaningfulString(row.visit_date) ? row.visit_date : null,
    visit_confirmed: isMeaningfulString(row.visit_date),
    conversation_history: Array.isArray(row.conversation_history_full)
      ? row.conversation_history_full
      : [],
  }));
}

// conversation_memory.extracted_data.conversation_history predates
// lead_full_details and is a rolling window rather than the full history,
// but unlike conversation_summary (a lossy, regex-parsed text tail) it has
// real role/content/timestamp turns for both sides — the best available
// fallback for leads whose conversation_history_full is missing AI replies.
export async function fetchConversationMemoryHistory(phone: string): Promise<ChatMessage[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("conversation_memory")
    .select("extracted_data")
    .eq("phone", phone)
    .maybeSingle();
  if (error) throw error;
  const history = (data as any)?.extracted_data?.conversation_history;
  if (!Array.isArray(history)) return [];
  return history
    .filter((t: any) => t && t.content && String(t.content).trim())
    .map((t: any) => ({
      content: t.content,
      direction: t.role === "assistant" ? "outbound" : "inbound",
      created_at: t.timestamp,
      message_type: "text",
    }));
}

export interface ParsedChatTurn {
  role: "customer" | "ai" | "other";
  text: string;
}

export interface ParsedConversation {
  header: string;
  turns: ParsedChatTurn[];
}

const CHAT_MARKER = "--- Recent Chat ---";

export function parseConversationSummary(raw: string | null | undefined): ParsedConversation {
  if (!raw) return { header: "", turns: [] };
  const idx = raw.indexOf(CHAT_MARKER);
  if (idx === -1) return { header: raw.trim(), turns: [] };

  const header = raw.slice(0, idx).trim();
  const chat = raw.slice(idx + CHAT_MARKER.length).trim();
  const lines = chat.split(/\r?\n/);

  const turns: ParsedChatTurn[] = [];
  let current: ParsedChatTurn | null = null;

  for (const line of lines) {
    const m = line.match(/^(Customer|AI|Agent|User|Assistant)\s*:\s*(.*)$/i);
    if (m) {
      if (current) turns.push(current);
      const speaker = m[1].toLowerCase();
      const role: ParsedChatTurn["role"] =
        speaker === "customer" || speaker === "user"
          ? "customer"
          : speaker === "ai" || speaker === "agent" || speaker === "assistant"
            ? "ai"
            : "other";
      current = { role, text: m[2].trim() };
    } else if (current && line.trim()) {
      current.text += "\n" + line.trim();
    }
  }
  if (current) turns.push(current);

  return { header, turns };
}
