import type { ReconciledVisitDate } from "@/lib/supabase/followupStatus";

export type VisitStatusBucket = "confirmed" | "conflict" | "pending";

// "whatsapp_unparsed" only counts as confirmed when it still resolved to a
// usable date via the call-side fallback — otherwise there's nothing to show
// yet, same as "none".
export function visitStatusBucket(v: ReconciledVisitDate): VisitStatusBucket {
  if (v.source === "conflict") return "conflict";
  if (v.source === "whatsapp" || v.source === "call" || v.source === "both") return "confirmed";
  if (v.source === "whatsapp_unparsed") return v.date ? "confirmed" : "pending";
  return "pending";
}

function parseDateOnlyOrIso(iso: string): Date {
  return new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso);
}

export function formatReadableDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = parseDateOnlyOrIso(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

export function formatNextCallAt(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleString("en-IN", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

export function formatRelativeTimestamp(iso: string | null | undefined): string {
  if (!iso) return "No activity yet";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const hours = (Date.now() - d.getTime()) / (1000 * 60 * 60);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${Math.round(hours)}h ago`;
  const days = hours / 24;
  if (days < 30) return `${Math.round(days)}d ago`;
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}
