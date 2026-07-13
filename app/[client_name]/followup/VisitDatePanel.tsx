import type { ReconciledVisitDate } from "@/lib/supabase/followupStatus";
import { formatReadableDate } from "./helpers";

const SOURCE_LABEL: Record<string, string> = {
  whatsapp: "WhatsApp",
  call: "Call",
  both: "Both",
};

export function VisitDatePanel({ visitDate }: { visitDate: ReconciledVisitDate }) {
  if (visitDate.source === "conflict") {
    return (
      <div className="rounded-2xl border-2 border-red-500/60 bg-red-500/[0.07] p-4">
        <p className="flex items-center gap-2 text-lg font-semibold text-red-300">
          <span>⚠</span> Conflicting visit dates — needs review
        </p>
        <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">WhatsApp says</p>
            <p className="text-white font-medium">{formatReadableDate(visitDate.whatsappDate)}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">Call says</p>
            <p className="text-white font-medium">{formatReadableDate(visitDate.callDate)}</p>
          </div>
        </div>
      </div>
    );
  }

  if (visitDate.source === "whatsapp_unparsed") {
    return (
      <div className="rounded-2xl border-2 border-yellow-500/50 bg-yellow-500/[0.05] p-4">
        {visitDate.date ? (
          <p className="text-lg font-semibold text-white">
            Visit confirmed: {formatReadableDate(visitDate.date)}
            <span className="ml-2 align-middle text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/70">
              Call
            </span>
          </p>
        ) : (
          <p className="text-sm font-medium text-white/60">No visit date confirmed yet</p>
        )}
        <p className="mt-1 text-xs text-yellow-300/90">
          WhatsApp said &ldquo;{visitDate.whatsappRaw}&rdquo; — couldn&apos;t parse as a date
        </p>
      </div>
    );
  }

  if (visitDate.source === "whatsapp" || visitDate.source === "call" || visitDate.source === "both") {
    return (
      <div className="rounded-2xl border-2 border-[#00B98E]/60 bg-[#00B98E]/[0.07] p-4">
        <p className="text-lg font-semibold text-white">
          Visit confirmed: {formatReadableDate(visitDate.date)}
          <span className="ml-2 align-middle text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white/70">
            {SOURCE_LABEL[visitDate.source]}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-white/10 bg-white/[0.03] p-4">
      <p className="text-sm font-medium text-white/50">No visit date yet</p>
    </div>
  );
}
