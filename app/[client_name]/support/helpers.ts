export function ticketStatusClasses(status: string): string {
  if (status === "open") return "bg-amber-500/20 text-amber-300 border border-amber-500/30";
  if (status === "closed") return "bg-green-500/20 text-green-300 border border-green-500/30";
  return "bg-white/10 text-white/70 border border-white/20";
}

export function issueTypeLabel(value: string | null): string {
  if (!value) return "—";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function assemblyLabel(value: string | null): string {
  if (!value) return "—";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const IST_FORMAT: Intl.DateTimeFormatOptions = {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Kolkata",
};

export function formatTicketDate(value: string | null | undefined, fallback = "—"): string {
  if (!value) return fallback;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-IN", IST_FORMAT);
}

export function safeDateText(value: string | null | undefined, fallback = "—"): string {
  if (!value) return fallback;
  return value;
}
