import type { LeadStatus } from "@/lib/supabase/leads";

export const STATUS_LABELS: Record<LeadStatus, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  answered: "Answered",
  mid_answered: "Mid-Answered",
  scheduled: "Scheduled",
  unanswered: "Unanswered",
  dnc: "DNC",
};

export const STATUS_OPTIONS: LeadStatus[] = [
  "pending",
  "in_progress",
  "answered",
  "mid_answered",
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
    case "mid_answered":
      return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
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

export function formatRetryDate(value: string | null | undefined): string {
  if (!value) return "Retry soon";
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return "Retry soon";
  const diffMs = target - Date.now();
  if (diffMs <= 0) return "Retry soon";
  const days = Math.floor(diffMs / 86400000);
  if (days >= 1) return `Retry in ${days} ${days === 1 ? "day" : "days"}`;
  const hours = Math.max(1, Math.round(diffMs / 3600000));
  return `Retry in ${hours} ${hours === 1 ? "hour" : "hours"}`;
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
