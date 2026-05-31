"use client";

import {
  type LeadDashboardRow,
  parseConversationSummary,
} from "@/lib/supabase/leadDashboard";
import {
  formatBudget,
  formatLastContact,
  formatPhone,
  priorityClasses,
  relativeFromHours,
  scoreColor,
} from "./helpers";

interface ConversationDetailModalProps {
  row: LeadDashboardRow | null;
  onClose: () => void;
}

export function ConversationDetailModal({ row, onClose }: ConversationDetailModalProps) {
  if (!row) return null;
  const parsed = parseConversationSummary(row.conversation_summary);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col rounded-3xl border border-white/10 bg-black shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-5 flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-[#00B98E]">WhatsApp lead</p>
            <h2 className="text-2xl font-semibold text-white mt-1">
              {formatPhone(row.phone)}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {row.priority && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${priorityClasses(row.priority)}`}
                >
                  {row.priority}
                </span>
              )}
              {row.score != null && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-medium ${scoreColor(row.score)}`}
                >
                  Score {row.score}
                </span>
              )}
              <span className="text-xs text-white/50">
                Last contact: {relativeFromHours(row.hours_since_contact)} ({formatLastContact(row.last_contact)})
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-xl w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center shrink-0 ml-3"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Lead profile */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <InfoCell label="Interested in" value={row.interested_in} />
            <InfoCell label="Style" value={row.style_preference} />
            <InfoCell label="Budget" value={formatBudget(row.budget)} />
            <InfoCell label="Interactions" value={row.interaction_count?.toString()} />
          </div>

          {(row.selected_product_name || row.selected_product_price) && (
            <div className="rounded-2xl border border-[#00B98E]/30 bg-[#00B98E]/5 p-4">
              <p className="text-xs uppercase tracking-wider text-[#00B98E] mb-1.5">
                Selected product
              </p>
              <p className="text-white font-medium">{row.selected_product_name || "—"}</p>
              {row.selected_product_price != null && (
                <p className="text-sm text-[#00B98E] font-semibold mt-1">
                  {formatBudget(row.selected_product_price)}
                </p>
              )}
            </div>
          )}

          {(isPresent(row.liked_product_1) || isPresent(row.liked_product_2)) && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-white/60 mb-2">
                Liked products
              </p>
              <ul className="space-y-1.5">
                {isPresent(row.liked_product_1) && (
                  <li className="text-sm text-white/90">• {row.liked_product_1}</li>
                )}
                {isPresent(row.liked_product_2) && (
                  <li className="text-sm text-white/90">• {row.liked_product_2}</li>
                )}
              </ul>
            </div>
          )}

          {/* Summary header text */}
          {parsed.header && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-white/60 mb-2">
                Summary
              </p>
              <pre className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap font-sans">
                {parsed.header}
              </pre>
            </div>
          )}

          {/* Chat */}
          {parsed.turns.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-white/60 mb-3">
                Recent chat
              </p>
              <div className="space-y-3">
                {parsed.turns.map((turn, i) => (
                  <ChatBubble key={i} turn={turn} />
                ))}
              </div>
            </div>
          )}

          {parsed.turns.length === 0 && !parsed.header && row.last_message && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-white/60 mb-2">
                Last message
              </p>
              <p className="text-sm text-white/90">{row.last_message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoCell({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-white/50">{label}</p>
      <p className="mt-1 text-sm text-white capitalize truncate">{value || "—"}</p>
    </div>
  );
}

function ChatBubble({ turn }: { turn: { role: "customer" | "ai" | "other"; text: string } }) {
  const isCustomer = turn.role === "customer";
  return (
    <div className={`flex ${isCustomer ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-md px-4 py-3 rounded-2xl ${
          isCustomer
            ? "bg-[#00B98E]/20 border border-[#00B98E]/30 text-white"
            : "bg-white/10 border border-white/20 text-white/90"
        }`}
      >
        <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70 mb-1">
          {turn.role === "customer" ? "Customer" : turn.role === "ai" ? "AI" : "Note"}
        </p>
        <p className="text-sm whitespace-pre-wrap break-words">{turn.text}</p>
      </div>
    </div>
  );
}

function isPresent(value: string | null | undefined): boolean {
  if (value == null) return false;
  const v = String(value).trim().toLowerCase();
  return v !== "" && v !== "null" && v !== "none";
}
