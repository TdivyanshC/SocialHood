"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabase) {
    return supabase;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      "Supabase environment variables are missing. The login flow will not work until NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY are set."
    );
    return null;
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey);
  return supabase;
}
