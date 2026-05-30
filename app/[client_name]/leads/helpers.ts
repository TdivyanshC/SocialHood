import type { LeadStatus } from "@/lib/supabase/leads";

export const STATUS_LABELS: Record<LeadStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  answered: "Answered",
  scheduled: "Scheduled",
  unanswered: "Unanswered",
  dnc: "DNC",
};

export const STATUS_OPTIONS: LeadStatus[] = [
  "pending",
  "in_progress",
  "answered",
  "scheduled",
  "unanswered",
  "dnc",
];

export function statusBadgeClasses(status: LeadStatus | string): string {
  switch (status) {
    case "pending":
      return "bg-white/10 text-white/70 border border-white/20";
    case "in_progress":
      return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
    case "answered":
      return "bg-green-500/20 text-green-300 border border-green-500/30";
    case "scheduled":
      return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
    case "unanswered":
      return "bg-orange-500/20 text-orange-300 border border-orange-500/30";
    case "dnc":
      return "bg-red-500/20 text-red-300 border border-red-500/30";
    default:
      return "bg-white/10 text-white/70 border border-white/20";
  }
}

export function campaignBadgeClasses(status: string): string {
  if (status === "active") return "bg-green-500/20 text-green-300 border border-green-500/30";
  if (status === "paused") return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
  if (status === "done") return "bg-white/10 text-white/60 border border-white/20";
  return "bg-white/10 text-white/70 border border-white/20";
}

const IST_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
};

export function formatIST(value: string | null | undefined, fallback = "—"): string {
  if (!value) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toLocaleString("en-IN", IST_FORMAT);
}

export function formatNextCall(value: string | null | undefined): string {
  if (!value) return "ASAP";
  return formatIST(value, "ASAP");
}

export function formatDuration(seconds: number | null | undefined): string {
  const s = seconds ?? 0;
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}m ${r}s`;
}

export const MAX_RETRIES = 3;
