import type { ChatMessage } from "@/lib/supabase/leadDashboard";

// lead_status/lead_score are shared with a separate voice-calling pipeline
// writing to the same leads table, so a temperature label is only trustworthy
// here if the lead actually has WhatsApp message history behind it.
export function hasWhatsAppHistory(history: ChatMessage[] | null | undefined): boolean {
  return Array.isArray(history) && history.length > 0;
}

export function priorityClasses(value: string | null | undefined): string {
  const v = (value || "").toLowerCase();
  if (v === "hot") return "bg-red-500/20 text-red-300 border border-red-500/30";
  if (v === "warm") return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
  if (v === "cold") return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
  return "bg-white/10 text-white/70 border border-white/20";
}

// Same hot/warm/cold palette as priorityClasses, applied as a card-level
// thick border instead of a badge. Glow shadows were tried first but read as
// messy once many cards stack on a dark background — a solid, thicker
// border reads cleanly at any list length. A confirmed visit is the
// highest-signal state a lead can be in, so it overrides temperature
// coloring with purple rather than combining with it.
export function cardAccentClasses(
  status: string | null | undefined,
  visitConfirmed?: boolean,
): string {
  if (visitConfirmed) {
    return "border-2 border-purple-500/60 bg-purple-500/[0.06] hover:border-purple-400/80";
  }
  const v = (status || "").toLowerCase();
  if (v === "hot") {
    return "border-2 border-red-500/50 bg-red-500/[0.05] hover:border-red-400/70";
  }
  if (v === "warm") {
    return "border-2 border-yellow-500/50 bg-yellow-500/[0.05] hover:border-yellow-400/70";
  }
  if (v === "cold") {
    return "border-2 border-blue-500/50 bg-blue-500/[0.05] hover:border-blue-400/70";
  }
  return "border-2 border-white/10 bg-white/5 hover:border-[#00B98E]/50 hover:bg-white/[0.07]";
}

// Same green/yellow/red tiers CallsDataDashboard already uses for its
// Answered/Mid/No-Answer status pills — reused here so a pickup rate reads
// on the same color scale as the rest of the CRM instead of inventing one.
export function pickupRateClasses(rate: number): string {
  if (rate >= 60) return "bg-green-500/20 text-green-300 border border-green-500/30";
  if (rate >= 30) return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
  return "bg-red-500/20 text-red-300 border border-red-500/30";
}

// Single source of truth for the three-way call outcome shown in both the
// card's LastCallCaption and the modal's call-by-call list, matching
// CallsDataDashboard's own statusBadge/statusLabel. mid_answered (phone was
// picked up, call ended in seconds with no real conversation) is kept
// distinct from unanswered (never picked up) everywhere it's displayed.
export const OUTCOME_LABEL: Record<string, string> = {
  answered: "Answered",
  mid_answered: "Mid",
  unanswered: "No Answer",
};

export const OUTCOME_BADGE_CLASSES: Record<string, string> = {
  answered: "bg-green-500/20 text-green-300 border-green-500/30",
  mid_answered: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  unanswered: "bg-red-500/20 text-red-300 border-red-500/30",
};

export const OUTCOME_TEXT_CLASSES: Record<string, string> = {
  answered: "text-green-400",
  mid_answered: "text-yellow-400",
  unanswered: "text-red-400",
};

export function scoreColor(score: number | null | undefined): string {
  if (score == null) return "text-white/60";
  if (score >= 75) return "text-red-300";
  if (score >= 50) return "text-yellow-300";
  return "text-blue-300";
}

export function formatBudget(value: number | null | undefined): string {
  if (value == null) return "—";
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatPhone(raw: string | null | undefined): string {
  if (!raw) return "—";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    const local = digits.slice(2);
    return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
  }
  return raw;
}

export function initialsFromPhone(raw: string | null | undefined): string {
  if (!raw) return "?";
  const digits = raw.replace(/\D/g, "").slice(-4);
  return digits.slice(-2) || "?";
}

const IST_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
};

export function formatLastContact(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-IN", IST_FORMAT);
}

export function relativeFromHours(hours: string | number | null | undefined): string {
  if (hours == null) return "—";
  const n = typeof hours === "string" ? Number(hours) : hours;
  if (!Number.isFinite(n)) return "—";
  if (n < 1) return "Just now";
  if (n < 24) return `${Math.round(n)}h ago`;
  const days = Math.round(n / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.round(days / 30)}mo ago`;
}

export function relativeFromISO(iso: string | null | undefined): string {
  if (!iso) return "—";
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms)) return "—";
  return relativeFromHours(ms / (1000 * 60 * 60));
}
