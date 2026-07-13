const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addDays(d: Date, n: number): Date {
  const copy = new Date(d.getTime());
  copy.setUTCDate(copy.getUTCDate() + n);
  return copy;
}

interface HistoryMessage {
  direction: string;
  content: string | null;
  created_at: string;
}

// Finds the WhatsApp message that produced a visit_date value, so relative
// phrases ("Sunday", "next Saturday") resolve against when the customer
// actually said them rather than today's date. Takes the latest exact match
// if the same phrase was sent more than once.
export function findVisitDateReferenceTimestamp(
  history: HistoryMessage[] | null | undefined,
  rawText: string | null,
): string | null {
  if (!Array.isArray(history) || !rawText) return null;
  const needle = rawText.trim().toLowerCase();
  const matches = history.filter(
    (m) => m.direction === "inbound" && (m.content || "").trim().toLowerCase() === needle,
  );
  if (matches.length === 0) return null;
  return matches[matches.length - 1].created_at;
}

// Lightweight stand-in for the voice side's ai_normalize_visit_date() — not
// exposed as a callable RPC from here (only normalize_phone,
// generate_ticket_number and upsert_call_stat are). Handles the phrasing
// actually seen in WhatsApp replies: bare weekday names, "on"/"this"/"next" +
// weekday, today/tomorrow, and already-ISO dates. Anything else returns null
// so the caller can flag it as unparsed instead of guessing.
export function resolveRelativeVisitDate(rawText: string | null, referenceIso: string | null): string | null {
  if (!rawText) return null;
  const text = rawText.trim().toLowerCase();
  if (ISO_DATE.test(text)) return text;
  if (!referenceIso) return null;

  const ref = new Date(referenceIso);
  if (Number.isNaN(ref.getTime())) return null;

  const cleaned = text.replace(/^(on|this)\s+/, "");
  const isNext = /^next\s+/.test(cleaned);
  const weekdayText = cleaned.replace(/^next\s+/, "").trim();

  if (weekdayText === "today") return toISODate(ref);
  if (weekdayText === "tomorrow") return toISODate(addDays(ref, 1));

  const targetDow = WEEKDAYS.indexOf(weekdayText);
  if (targetDow === -1) return null;

  // Inclusive of the reference day itself ("Sunday" said on a Sunday means
  // that same day, not a week later); "next <weekday>" pushes one week past.
  let daysAhead = (targetDow - ref.getUTCDay() + 7) % 7;
  if (isNext) daysAhead += 7;
  return toISODate(addDays(ref, daysAhead));
}
