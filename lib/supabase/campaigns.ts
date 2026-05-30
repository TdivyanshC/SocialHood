"use client";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabaseClient";

export type CampaignStatus = "active" | "paused" | "done";

export interface Campaign {
  id: string;
  tenant_id: string;
  name: string;
  status: CampaignStatus;
  created_at: string;
}

const TENANT_ID = "krishna_furniture";

function requireClient(): SupabaseClient {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Supabase client unavailable. Check NEXT_PUBLIC_SUPABASE_* env vars.");
  return supabase;
}

export async function fetchCampaigns(tenantId: string = TENANT_ID): Promise<Campaign[]> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Campaign[];
}

export async function createCampaign(
  name: string,
  tenantId: string = TENANT_ID,
): Promise<Campaign> {
  const supabase = requireClient();
  const { data, error } = await supabase
    .from("campaigns")
    .insert({ tenant_id: tenantId, name: name.trim(), status: "active" })
    .select("*")
    .single();
  if (error) throw error;
  return data as Campaign;
}

export async function updateCampaignStatus(
  id: string,
  status: CampaignStatus,
): Promise<void> {
  const supabase = requireClient();
  const { error } = await supabase
    .from("campaigns")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}
