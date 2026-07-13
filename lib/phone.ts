import type { SupabaseClient } from "@supabase/supabase-js";

// Delegates to the same normalize_phone() Postgres function the voice side
// calls (exposed here as a Supabase RPC), so this codebase never maintains a
// second copy of that logic to drift out of sync. Returns the canonical
// bare-digit "91XXXXXXXXXX" form, or "" if normalize_phone can't parse it.
export async function normalizePhone(
  supabase: SupabaseClient,
  raw: string | null | undefined,
): Promise<string> {
  if (!raw) return "";
  const { data, error } = await supabase.rpc("normalize_phone", { raw });
  if (error) throw error;
  return (data as string | null) ?? "";
}

// Resolves normalize_phone() for a batch of phone numbers in one parallel
// round trip (deduplicated), for callers joining two already-fetched result
// sets who'd otherwise pay one RPC call per row.
export async function normalizePhoneBatch(
  supabase: SupabaseClient,
  rawPhones: (string | null | undefined)[],
): Promise<Map<string, string>> {
  const unique = [...new Set(rawPhones.filter((p): p is string => !!p))];
  const resolved = await Promise.all(unique.map((raw) => normalizePhone(supabase, raw)));
  return new Map(unique.map((raw, i) => [raw, resolved[i]]));
}
