"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";

export type TicketStatus = "open" | "closed" | string;

export interface SupportTicket {
  id: string;
  ticket_number: string;
  lead_id: string | null;
  order_id: string | null;
  issue_type: string | null;
  description: string | null;
  bill_photo_url: string | null;
  product_photo_url: string | null;
  status: TicketStatus;
  created_at: string;
  resolved_at: string | null;
  customer_name: string | null;
  phone: string | null;
  delivery_date: string | null;
  issue_noticed_date: string | null;
  assembly_type: string | null;
  usage_affected: boolean | null;
  resolution_requested: string | null;
  photos: string[] | null;
  assigned_to: string | null;
  team_notified_at: string | null;
  resolution_notes: string | null;
}

function requireClient(): SupabaseClient {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase client unavailable. Check NEXT_PUBLIC_SUPABASE_* env vars.");
  return supabase;
}

export async function fetchSupportTickets(): Promise<SupportTicket[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as SupportTicket[];
}

export async function closeSupportTicket(
  id: string,
  resolutionNotes?: string | null,
): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({
      status: "closed",
      resolved_at: new Date().toISOString(),
      ...(resolutionNotes ? { resolution_notes: resolutionNotes } : {}),
    })
    .eq("id", id);
  if (error) throw error;
}

export async function reopenSupportTicket(id: string): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase
    .from("support_tickets")
    .update({ status: "open", resolved_at: null })
    .eq("id", id);
  if (error) throw error;
}
