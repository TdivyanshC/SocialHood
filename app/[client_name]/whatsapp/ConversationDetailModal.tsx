"use client";

import { useEffect, useState } from "react";
import {
  type ConversationMemoryTurn,
  type LeadDashboardRow,
  type ParsedChatTurn,
  type WhatsAppMessage,
  fetchConversationMemory,
  fetchWhatsAppConversation,
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
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [memoryTurns, setMemoryTurns] = useState<ConversationMemoryTurn[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  useEffect(() => {
    if (!row?.phone) {
      setMessages([]);
      setMemoryTurns([]);
      return;
    }
    let cancelled = false;
    setLoadingMessages(true);
    setMessagesError(null);
    Promise.all([fetchWhatsAppConversation(row.phone), fetchConversationMemory(row.phone)])
      .then(([rows, memory]) => {
        if (!cancelled) {
          setMessages(rows);
          setMemoryTurns(memory);
        }
      })
      .catch((err: any) => {
        if (!cancelled) setMessagesError(err?.message || "Failed to load chat history.");
      })
      .finally(() => {
        if (!cancelled) setLoadingMessages(false);
      });
    return () => {
      cancelled = true;
    };
  }, [row?.phone]);

  if (!row) return null;
  const parsed = parseConversationSummary(row.conversation_summary);
  const hasFullHistory = messages.length > 0;
  const memoryBackfilled = hasFullHistory
    ? backfillFromMemory(messages, memoryTurns)
    : new Map<string, string>();
  const summaryBackfilled = hasFullHistory
    ? backfillOutboundText(messages, parsed.turns)
    : new Map<string, string>();

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

          {row.visit_confirmed && (
            <div className="rounded-2xl border border-purple-500/30 bg-purple-500/5 p-4">
              <p className="text-xs uppercase tracking-wider text-purple-300 mb-1.5">
                📅 Visit confirmed
              </p>
              <p className="text-white font-medium">{row.visit_date}</p>
            </div>
          )}

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
          <div>
            <p className="text-xs uppercase tracking-wider text-white/60 mb-3">
              {hasFullHistory ? `Full chat (${messages.length})` : "Recent chat"}
            </p>

            {loadingMessages && (
              <div className="flex justify-center py-4">
                <div className="w-2 h-2 rounded-full bg-[#00B98E] animate-pulse" />
              </div>
            )}

            {!loadingMessages && messagesError && (
              <p className="text-xs text-red-400 mb-3">{messagesError}</p>
            )}

            {!loadingMessages && hasFullHistory && (
              <div className="space-y-3">
                {messages.map((msg) => {
                  const hasContent = !!(msg.content && msg.content.trim());
                  const fromMemory = !hasContent ? memoryBackfilled.get(msg.id) : undefined;
                  const fromSummary =
                    !hasContent && !fromMemory ? summaryBackfilled.get(msg.id) : undefined;
                  const recovered = fromMemory || fromSummary;
                  return (
                    <ChatBubble
                      key={msg.id}
                      turn={{
                        role: msg.direction === "inbound" ? "customer" : "ai",
                        text: hasContent
                          ? (msg.content as string)
                          : recovered
                          ? recovered
                          : msg.media_url
                          ? "[Media attachment]"
                          : "Message not logged",
                      }}
                      timestamp={msg.created_at}
                      note={
                        fromMemory
                          ? "recovered from conversation memory"
                          : fromSummary
                          ? "recovered from summary"
                          : undefined
                      }
                    />
                  );
                })}
              </div>
            )}

            {!loadingMessages && !hasFullHistory && parsed.turns.length > 0 && (
              <div className="space-y-3">
                {parsed.turns.map((turn, i) => (
                  <ChatBubble key={i} turn={turn} />
                ))}
              </div>
            )}

            {!loadingMessages &&
              !hasFullHistory &&
              parsed.turns.length === 0 &&
              !parsed.header &&
              row.last_message && (
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
    </div>
  );
}

/**
 * whatsapp_conversations.created_at comes back from Postgres with no
 * timezone suffix even though it's UTC, while conversation_memory's
 * timestamps carry an explicit "Z". Parsing the bare string with `new Date()`
 * makes the JS engine assume the *browser's* local zone, which silently
 * shifts it by the viewer's UTC offset relative to the correctly-parsed
 * "Z" value — breaking any cross-timestamp comparison. Normalize both to a
 * real UTC instant before comparing.
 */
function toUtcMs(iso: string): number {
  const hasTz = /[zZ]|[+-]\d\d:?\d\d$/.test(iso);
  return new Date(hasTz ? iso : `${iso}Z`).getTime();
}

/**
 * conversation_memory.extracted_data.conversation_history is the bot's own
 * working memory — it has the real outbound text, but as a rolling window
 * with its own timestamps (logged ~1-4s apart from whatsapp_conversations
 * .created_at for the same reply, based on observed data). Consecutive
 * exchanges are typically 15s+ apart, so a tight tolerance combined with
 * global smallest-difference-first assignment (rather than a single
 * chronological pass) avoids one wrong early match cascading into every
 * later match being shifted by one slot.
 */
const MEMORY_MATCH_TOLERANCE_MS = 15 * 1000;

function backfillFromMemory(
  messages: WhatsAppMessage[],
  turns: ConversationMemoryTurn[]
): Map<string, string> {
  const pool = turns
    .filter((t) => t.role === "assistant" && t.content && t.content.trim())
    .map((t) => ({ text: t.content, time: toUtcMs(t.timestamp) }));

  const targets = messages.filter(
    (m) => m.direction === "outbound" && !(m.content && m.content.trim())
  );

  const candidates: { msgId: string; poolIdx: number; diff: number }[] = [];
  for (const msg of targets) {
    const msgTime = toUtcMs(msg.created_at);
    for (let i = 0; i < pool.length; i++) {
      const diff = Math.abs(pool[i].time - msgTime);
      if (diff <= MEMORY_MATCH_TOLERANCE_MS) {
        candidates.push({ msgId: msg.id, poolIdx: i, diff });
      }
    }
  }
  candidates.sort((a, b) => a.diff - b.diff);

  const fills = new Map<string, string>();
  const usedMsg = new Set<string>();
  const usedPool = new Set<number>();
  for (const c of candidates) {
    if (usedMsg.has(c.msgId) || usedPool.has(c.poolIdx)) continue;
    fills.set(c.msgId, pool[c.poolIdx].text);
    usedMsg.add(c.msgId);
    usedPool.add(c.poolIdx);
  }

  return fills;
}

/**
 * whatsapp_conversations never logs the text body of outbound (AI) messages —
 * only status/metadata. conversation_summary does contain that text, but only
 * for a recent tail window. Recover AI reply text by anchoring on the nearest
 * preceding customer message: find that same customer text in the summary and
 * take the AI turn immediately following it.
 */
function backfillOutboundText(
  messages: WhatsAppMessage[],
  turns: ParsedChatTurn[]
): Map<string, string> {
  const fills = new Map<string, string>();
  let precedingCustomerText: string | null = null;

  for (const msg of messages) {
    if (msg.direction === "inbound") {
      precedingCustomerText = (msg.content || "").trim().toLowerCase();
      continue;
    }
    const hasContent = msg.content && msg.content.trim();
    if (hasContent || !precedingCustomerText) continue;

    for (let i = turns.length - 1; i >= 0; i--) {
      const t = turns[i];
      if (t.role === "customer" && t.text.trim().toLowerCase() === precedingCustomerText) {
        const next = turns[i + 1];
        if (next && next.role === "ai") {
          fills.set(msg.id, next.text);
        }
        break;
      }
    }
  }

  return fills;
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

function ChatBubble({
  turn,
  timestamp,
  note,
}: {
  turn: { role: "customer" | "ai" | "other"; text: string };
  timestamp?: string;
  note?: string;
}) {
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
        <div className="flex items-center justify-between gap-3 mb-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
            {turn.role === "customer" ? "Customer" : turn.role === "ai" ? "AI" : "Note"}
          </p>
          {timestamp && (
            <p className="text-[10px] opacity-50 whitespace-nowrap">
              {new Date(toUtcMs(timestamp)).toLocaleString("en-IN", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          )}
        </div>
        <p className="text-sm whitespace-pre-wrap break-words">{turn.text}</p>
        {note && <p className="text-[10px] italic opacity-50 mt-1">{note}</p>}
      </div>
    </div>
  );
}

function isPresent(value: string | null | undefined): boolean {
  if (value == null) return false;
  const v = String(value).trim().toLowerCase();
  return v !== "" && v !== "null" && v !== "none";
}
