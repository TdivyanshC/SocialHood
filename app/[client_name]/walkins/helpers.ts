import type { WalkinSource } from "@/lib/supabase/walkins";

export function sourceBadgeClasses(source: WalkinSource): string {
  return source === "system"
    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
    : "bg-white/10 text-white/60 border-white/20";
}

export function sourceLabel(source: WalkinSource): string {
  return source === "system" ? "System" : "Offline";
}

export const VISIT_NUMBER_BADGE_CLASS = "bg-pink-500/20 text-pink-300 border-pink-500/30";

export function convertedBadgeClasses(converted: boolean): string {
  return converted
    ? "bg-green-500/20 text-green-300 border-green-500/30"
    : "bg-white/10 text-white/40 border-white/20";
}

export function formatCurrency(value: number | null | undefined): string {
  if (value == null) return "—";
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatVisitDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
