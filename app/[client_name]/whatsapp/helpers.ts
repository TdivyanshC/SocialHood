export function priorityClasses(value: string | null | undefined): string {
  const v = (value || "").toLowerCase();
  if (v === "hot") return "bg-red-500/20 text-red-300 border border-red-500/30";
  if (v === "warm") return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
  if (v === "cold") return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
  return "bg-white/10 text-white/70 border border-white/20";
}

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
