"use client";

import type { LeadDashboardRow } from "@/lib/supabase/leadDashboard";
import type { WalkinCardSummary } from "@/lib/supabase/walkins";
import type { CallHistorySummary } from "@/lib/supabase/callHistory";
import { WALKIN_ACCENT_SHADOW, WalkinBadges } from "../walkins/WalkinIndicator";
import {
  cardAccentClasses,
  formatBudget,
  formatPhone,
  hasWhatsAppHistory,
  initialsFromPhone,
  OUTCOME_LABEL,
  OUTCOME_TEXT_CLASSES,
  pickupRateClasses,
  priorityClasses,
  relativeFromHours,
  relativeFromISO,
  scoreColor,
} from "./helpers";

// Mirrors the three states a caller can actually be in: still fetching (show
// a skeleton, not a flash of "Not called yet" that then flips to real data),
// the endpoint failed (omit the piece entirely rather than guess), or
// resolved — which itself may be zero calls, and that's not an error.
export type CallHistoryCardState =
  | { status: "loading" }
  | { status: "unavailable" }
  | { status: "ready"; summary: CallHistorySummary };

interface ConversationCardProps {
  row: LeadDashboardRow;
  onClick: () => void;
  walkin?: WalkinCardSummary;
  callHistory?: CallHistoryCardState;
}

export function ConversationCard({ row, onClick, walkin, callHistory }: ConversationCardProps) {
  const hasSelected = isPresent(row.selected_product_name);
  // lead_status/lead_score can come from a separate voice-calling pipeline
  // sharing this table, so only trust them for display once real WhatsApp
  // messages exist.
  const priority = hasWhatsAppHistory(row.conversation_history) ? row.priority : null;

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl p-4 flex flex-col gap-3 transition-all duration-300 ${cardAccentClasses(priority, row.visit_confirmed)} ${walkin ? WALKIN_ACCENT_SHADOW : ""}`}
    >
      {/* Top row: avatar + phone + time + priority */}
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00B98E] to-cyan-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
          {initialsFromPhone(row.phone)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-white truncate">{formatPhone(row.phone)}</h3>
            <span className="text-xs text-white/50 shrink-0">
              {relativeFromHours(row.hours_since_contact)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {priority && (
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${priorityClasses(priority)}`}
              >
                {priority}
              </span>
            )}
            {row.score != null && (
              <span
                className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-semibold bg-white/5 border border-white/10 ${scoreColor(row.score)}`}
              >
                Score {row.score}
              </span>
            )}
            {row.interaction_count != null && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                {row.interaction_count} msgs
              </span>
            )}
            {row.visit_confirmed && (
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30">
                📅 Visit: {row.visit_date}
              </span>
            )}
            {walkin && <WalkinBadges walkin={walkin} />}
            <CallHistoryBadge callHistory={callHistory} />
          </div>
          <LastCallCaption callHistory={callHistory} />
        </div>
      </div>

      {/* Structured info grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Field icon="🛋" label="Interest" value={row.interested_in} />
        <Field icon="₹" label="Budget" value={formatBudgetOrDash(row.budget)} mono />
        <Field icon="✨" label="Style" value={row.style_preference} />
        <Field
          icon="📦"
          label="Selected"
          value={
            hasSelected
              ? `${truncate(row.selected_product_name!, 28)}${
                  row.selected_product_price ? ` · ${formatBudget(row.selected_product_price)}` : ""
                }`
              : null
          }
        />
      </div>
    </button>
  );
}

function CallHistoryBadge({ callHistory }: { callHistory?: CallHistoryCardState }) {
  if (!callHistory || callHistory.status === "unavailable") return null;

  if (callHistory.status === "loading") {
    return (
      <span className="inline-block h-[18px] w-[88px] rounded-full bg-white/5 border border-white/10 animate-pulse" />
    );
  }

  const { summary } = callHistory;
  if (summary.callsMade === 0) {
    return (
      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium bg-white/10 text-white/70 border border-white/20">
        📞 Not called yet
      </span>
    );
  }

  return (
    <span
      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${pickupRateClasses(summary.pickupRate!)}`}
    >
      📞 {summary.callsMade} {summary.callsMade === 1 ? "call" : "calls"} · {summary.pickupRate}%
    </span>
  );
}

function LastCallCaption({ callHistory }: { callHistory?: CallHistoryCardState }) {
  if (!callHistory || callHistory.status !== "ready") return null;
  const { summary } = callHistory;
  if (summary.callsMade === 0 || !summary.lastCallAt || !summary.lastCallOutcome) return null;

  return (
    <p className="text-[10px] text-white/40 mt-1">
      Last call: <span className={OUTCOME_TEXT_CLASSES[summary.lastCallOutcome]}>{OUTCOME_LABEL[summary.lastCallOutcome]}</span>{" "}
      · {relativeFromISO(summary.lastCallAt)}
    </p>
  );
}

function Field({
  icon,
  label,
  value,
  mono,
}: {
  icon: string;
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  const present = isPresent(value);
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-white/50 flex items-center gap-1">
        <span className="not-italic">{icon}</span>
        {label}
      </p>
      <p
        className={`mt-0.5 text-sm truncate ${
          present ? "text-white" : "text-white/40"
        } ${mono ? "font-mono" : "capitalize"}`}
        title={present ? String(value) : undefined}
      >
        {present ? value : "—"}
      </p>
    </div>
  );
}

function isPresent(value: string | number | null | undefined): boolean {
  if (value == null) return false;
  const v = String(value).trim().toLowerCase();
  return v !== "" && v !== "null" && v !== "none";
}

function truncate(s: string, max: number): string {
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}

function formatBudgetOrDash(value: number | null | undefined): string | null {
  if (value == null) return null;
  return formatBudget(value);
}
