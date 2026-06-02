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
}

function requireClient(): SupabaseClient {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase client unavailable. Check NEXT_PUBLIC_SUPABASE_* env vars.");
  return supabase;
}

export async function fetchLeadDashboard(): Promise<LeadDashboardRow[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("lead_dashboard")
    .select("*")
    .order("last_contact", { ascending: false, nullsFirst: false });
  if (error) throw error;
  return (data || []) as LeadDashboardRow[];
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
