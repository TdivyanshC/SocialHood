"use client";

import type { LeadDashboardRow } from "@/lib/supabase/leadDashboard";
import {
  formatLastContact,
  formatPhone,
  initialsFromPhone,
  priorityClasses,
  relativeFromHours,
  scoreColor,
} from "./helpers";

interface ConversationCardProps {
  row: LeadDashboardRow;
  onClick: () => void;
}

export function ConversationCard({ row, onClick }: ConversationCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-start gap-4 p-4 rounded-2xl border border-white/10 bg-white/5 hover:border-[#00B98E]/50 hover:bg-white/[0.07] transition"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00B98E] to-cyan-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
        {initialsFromPhone(row.phone)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1 gap-2">
          <h3 className="font-semibold text-white truncate">{formatPhone(row.phone)}</h3>
          <span className="text-xs text-white/50 shrink-0">
            {relativeFromHours(row.hours_since_contact) ||
              formatLastContact(row.last_contact)}
          </span>
        </div>
        <p className="text-sm text-white/70 line-clamp-2">
          {row.last_message || row.conversation_summary?.split("\n")[0] || "No messages yet"}
        </p>
        <div className="flex gap-2 mt-2 flex-wrap">
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
          {row.interested_in && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/70 capitalize">
              {row.interested_in}
            </span>
          )}
          {row.interaction_count != null && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/60">
              {row.interaction_count} msgs
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
