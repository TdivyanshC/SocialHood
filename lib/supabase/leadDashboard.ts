"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";

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

interface LeadsTableRow {
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
}

// The dashboard used to read a `lead_dashboard` view, which the backend has
// since dropped in favor of querying the `leads` table directly — it now
// carries visit_date/visit_date_status natively, so no more client-side join
// with conversation_memory is needed for that. `leads` also drops the view's
// `priority`/`hours_since_contact` convenience columns and stores lead_score
// as a string, so those are derived here to keep LeadDashboardRow stable for
// the rest of the dashboard.
export async function fetchLeadDashboard(): Promise<LeadDashboardRow[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("leads")
    .select(
      "phone, source, interested_in, budget, style_preference, selected_product_name, selected_product_price, liked_product_1, liked_product_2, lead_status, lead_score, conversation_summary, last_message, last_contact, interaction_count, created_at, visit_date, visit_date_status",
    )
    .order("last_contact", { ascending: false, nullsFirst: false });
  if (error) throw error;

  return ((data || []) as LeadsTableRow[]).map((row) => ({
    ...row,
    score: row.lead_score != null ? Number(row.lead_score) : null,
    priority: row.lead_status,
    hours_since_contact: hoursSince(row.last_contact ?? row.created_at),
    visit_date: isMeaningfulString(row.visit_date) ? row.visit_date : null,
    visit_confirmed: isMeaningfulString(row.visit_date),
  }));
}

export interface WhatsAppMessage {
  id: string;
  phone: string;
  direction: "inbound" | "outbound" | string;
  content: string | null;
  media_url: string | null;
  message_type: string | null;
  message_status: string | null;
  created_at: string;
}

export async function fetchWhatsAppConversation(phone: string): Promise<WhatsAppMessage[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("whatsapp_conversations")
    .select("id, phone, direction, content, media_url, message_type, message_status, created_at")
    .eq("phone", phone)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []) as WhatsAppMessage[];
}

export interface ConversationMemoryTurn {
  role: "user" | "assistant" | string;
  content: string;
  timestamp: string;
}

// conversation_memory.extracted_data.conversation_history holds the bot's own
// working memory of the chat, including the real text it sent (which
// whatsapp_conversations never logs for outbound rows). It's a rolling
// window, not the full history, so it's used to backfill, not as the source
// of truth for the timeline.
export async function fetchConversationMemory(phone: string): Promise<ConversationMemoryTurn[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("conversation_memory")
    .select("extracted_data")
    .eq("phone", phone)
    .maybeSingle();
  if (error) throw error;
  const history = (data as any)?.extracted_data?.conversation_history;
  return Array.isArray(history) ? (history as ConversationMemoryTurn[]) : [];
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
