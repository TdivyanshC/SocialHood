import type { FollowupStatusRow } from "@/lib/supabase/followupStatus";
import { formatPhone } from "../whatsapp/helpers";
import { formatNextCallAt, formatRelativeTimestamp } from "./helpers";
import { VisitDatePanel } from "./VisitDatePanel";

const OUTCOME_TONE: Record<string, string> = {
  Answered: "text-[#00B98E]",
  "Partially Answered": "text-yellow-300",
  "No Answer": "text-white/60",
  Pending: "text-white/50",
  "Do Not Call": "text-red-300",
};

export function FollowupCard({ row }: { row: FollowupStatusRow }) {
  const nextTry = formatNextCallAt(row.nextCallAt);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{formatPhone(row.phone)}</h3>
          {row.name && <p className="text-sm text-white/60">{row.name}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-wider text-[#00B98E] font-semibold">💬 WhatsApp</p>
          <p className="mt-2 text-sm text-white">
            {row.interestedIn || <span className="text-white/40">No interest captured</span>}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/60">
            <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5">
              {row.whatsappMessageCount} messages
            </span>
            <span>{formatRelativeTimestamp(row.lastWhatsappActivity)}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] uppercase tracking-wider text-cyan-300 font-semibold">📞 Call</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {row.callStage ? (
              <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-xs text-white">
                {row.callStage.label}
              </span>
            ) : (
              <span className="text-sm text-white/40">Not in calling queue</span>
            )}
          </div>
          {row.callOutcome && (
            <p className={`mt-2 text-sm font-medium ${OUTCOME_TONE[row.callOutcome] || "text-white"}`}>
              {row.callOutcome}
            </p>
          )}
          {nextTry && <p className="mt-1 text-xs text-white/50">Next try: {nextTry}</p>}
        </div>
      </div>

      <VisitDatePanel visitDate={row.visitDate} />
    </div>
  );
}
