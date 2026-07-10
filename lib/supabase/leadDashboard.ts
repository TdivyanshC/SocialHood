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

// visit_date/awaiting_visit_date live in conversation_memory.extracted_data,
// not in the lead_dashboard view, so they're fetched separately and merged
// client-side by phone. A visit counts as "confirmed" once the customer has
// named a day/date and the bot is no longer waiting on one.
export async function fetchLeadDashboard(): Promise<LeadDashboardRow[]> {
  const supabase = requireClient();
  const [{ data, error }, memoryResult] = await Promise.all([
    supabase
      .from("lead_dashboard")
      .select("*")
      .order("last_contact", { ascending: false, nullsFirst: false }),
    supabase.from("conversation_memory").select("phone, extracted_data"),
  ]);
  if (error) throw error;

  const visitByPhone = new Map<string, { visit_date: string | null; confirmed: boolean }>();
  if (!memoryResult.error) {
    for (const row of memoryResult.data || []) {
      const extracted = (row as any)?.extracted_data;
      const visitDate = extracted?.visit_date;
      if (isMeaningfulString(visitDate)) {
        visitByPhone.set((row as any).phone, {
          visit_date: visitDate,
          confirmed: extracted?.awaiting_visit_date !== true,
        });
      }
    }
  }

  return ((data || []) as LeadDashboardRow[]).map((row) => {
    const visit = visitByPhone.get(row.phone);
    return {
      ...row,
      visit_date: visit?.visit_date ?? null,
      visit_confirmed: visit?.confirmed ?? false,
    };
  });
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
