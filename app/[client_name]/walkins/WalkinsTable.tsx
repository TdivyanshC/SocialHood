"use client";

import { useEffect, useState } from "react";
import { formatPhone } from "../whatsapp/helpers";
import { markWalkinConverted, type WalkinTableRow } from "@/lib/supabase/walkins";
import { useToast } from "../leads/Toast";
import {
  CONVERTED_ACCENT_SHADOW,
  convertedBadgeClasses,
  formatCurrency,
  formatVisitDate,
  sourceBadgeClasses,
  sourceLabel,
  VISIT_NUMBER_BADGE_CLASS,
} from "./helpers";

interface WalkinsTableProps {
  rows: WalkinTableRow[];
  loading: boolean;
  error: string | null;
  onConverted: () => void;
}

export function WalkinsTable({ rows, loading, error, onConverted }: WalkinsTableProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-xl font-semibold text-white">
          Walk-in Visits <span className="text-sm font-normal text-white/50">({rows.length} shown)</span>
        </h2>
      </div>

      {error ? (
        <div className="p-8 text-center text-red-400">{error}</div>
      ) : loading ? (
        <div className="p-8 flex justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#00B98E] animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-[#00B98E] animate-pulse delay-100" />
          <div className="w-2 h-2 rounded-full bg-[#00B98E] animate-pulse delay-200" />
        </div>
      ) : rows.length === 0 ? (
        <div className="p-8 text-center text-white/50">
          No walk-ins recorded yet. Add one manually or upload a CSV to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                <th className="text-left py-3 px-4 font-medium">Name / Phone</th>
                <th className="text-left py-3 px-4 font-medium">Visit Date</th>
                <th className="text-left py-3 px-4 font-medium">Source</th>
                <th className="text-left py-3 px-4 font-medium">Visit #</th>
                <th className="text-left py-3 px-4 font-medium">Budget</th>
                <th className="text-left py-3 px-4 font-medium">Follow-ups</th>
                <th className="text-left py-3 px-4 font-medium">Converted</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-b border-white/5 hover:bg-white/[0.03] transition-colors ${
                    row.converted ? CONVERTED_ACCENT_SHADOW : ""
                  }`}
                >
                  <td className="py-4 px-4">
                    <p className="text-white font-medium leading-tight">{row.leadName || "Unknown"}</p>
                    <p className="text-white/40 text-xs mt-0.5">{formatPhone(row.phone)}</p>
                  </td>
                  <td className="py-4 px-4 text-white/70 text-xs whitespace-nowrap">
                    {formatVisitDate(row.visit_date)}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs border ${sourceBadgeClasses(row.source)}`}
                    >
                      {sourceLabel(row.source)}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs border ${VISIT_NUMBER_BADGE_CLASS}`}>
                      Visit {row.visit_number}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-white/80 font-mono text-xs">
                    <BudgetCell manual={row.budget_manual} wa={row.budget_wa} />
                  </td>
                  <td className="py-4 px-4 text-white/70">{row.followup_calls_made}/3</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs border ${convertedBadgeClasses(row.converted)}`}
                      >
                        {row.converted ? "✓ Converted" : "Not yet"}
                      </span>
                      {!row.converted && <MarkConvertedButton walkinId={row.id} onConverted={onConverted} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Requires a second click within 3s to actually commit — this flips a real
// DB column the client relies on for their conversion report, so a single
// accidental click on a dense row list must not silently convert a lead.
function MarkConvertedButton({ walkinId, onConverted }: { walkinId: string; onConverted: () => void }) {
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const timer = window.setTimeout(() => setConfirming(false), 3000);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  const handleClick = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    setSaving(true);
    try {
      await markWalkinConverted(walkinId);
      toast.push("success", "Marked as converted");
      onConverted();
    } catch (err: any) {
      toast.push("error", err?.message || "Failed to mark converted");
      setSaving(false);
      setConfirming(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={saving}
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium border transition disabled:opacity-50 ${
        confirming
          ? "bg-green-500 text-black border-green-500"
          : "bg-white/5 text-white/60 border-white/15 hover:border-green-500/50 hover:text-green-300"
      }`}
    >
      {saving ? "Saving…" : confirming ? "Confirm?" : "Mark Converted"}
    </button>
  );
}

function BudgetCell({ manual, wa }: { manual: number | null; wa: number | null }) {
  if (manual == null && wa == null) return <span className="text-white/30">—</span>;
  if (manual != null && wa != null) {
    return (
      <div className="flex flex-col gap-0.5">
        <span title="Manual entry">✍ {formatCurrency(manual)}</span>
        <span title="WhatsApp-fetched" className="text-white/50">
          💬 {formatCurrency(wa)}
        </span>
      </div>
    );
  }
  return <span>{formatCurrency(manual ?? wa)}</span>;
}
