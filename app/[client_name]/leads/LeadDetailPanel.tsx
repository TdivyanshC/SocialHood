"use client";

import { useEffect, useState } from "react";
import type { Campaign } from "@/lib/supabase/campaigns";
import {
  type LeadCallLog,
  type LeadCallSummary,
  type LeadStatus,
  type OutboundLead,
  fetchLeadCallHistory,
  fetchLeadCallSummaries,
  updateLeadNotes,
  updateLeadStatus,
} from "@/lib/supabase/leads";
import {
  MAX_RETRIES,
  STATUS_LABELS,
  STATUS_OPTIONS,
  formatDuration,
  formatIST,
  formatNextCall,
  statusBadgeClasses,
} from "./helpers";
import { useToast } from "./Toast";

interface LeadDetailPanelProps {
  lead: OutboundLead | null;
  campaigns: Campaign[];
  onClose: () => void;
  onChanged: () => void;
}

export function LeadDetailPanel({ lead, campaigns, onClose, onChanged }: LeadDetailPanelProps) {
  const toast = useToast();
  const [history, setHistory] = useState<LeadCallLog[]>([]);
  const [summaries, setSummaries] = useState<LeadCallSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [openTranscriptId, setOpenTranscriptId] = useState<string | null>(null);

  useEffect(() => {
    if (!lead) return;
    setNotesDraft(lead.notes || "");
    setOpenTranscriptId(null);
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const [h, s] = await Promise.all([
          fetchLeadCallHistory(lead.phone),
          fetchLeadCallSummaries(lead.id),
        ]);
        if (!cancelled) {
          setHistory(h);
          setSummaries(s);
        }
      } catch (err: any) {
        if (!cancelled) toast.push("error", err?.message || "Failed to load call history");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lead, toast]);

  if (!lead) return null;

  const campaign = campaigns.find((c) => c.id === lead.campaign_id);

  const saveNotes = async () => {
    if (notesDraft === (lead.notes || "")) return;
    setSavingNotes(true);
    try {
      await updateLeadNotes(lead.id, notesDraft);
      toast.push("success", "Notes saved");
      onChanged();
    } catch (err: any) {
      toast.push("error", err?.message || "Failed to save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const changeStatus = async (next: LeadStatus) => {
    if (next === lead.status) return;
    setSavingStatus(true);
    try {
      await updateLeadStatus(lead.id, next);
      toast.push("success", `Status changed to ${STATUS_LABELS[next]}`);
      onChanged();
    } catch (err: any) {
      toast.push("error", err?.message || "Failed to update status");
    } finally {
      setSavingStatus(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="flex-1 cursor-default"
      />
      <div className="w-full max-w-xl h-full overflow-y-auto bg-black border-l border-white/10 shadow-2xl shadow-black/40">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-md border-b border-white/10 px-6 py-5 flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-[#00B98E]">Lead detail</p>
            <h2 className="text-2xl font-semibold text-white mt-1 truncate">
              {lead.name || "Unnamed lead"}
            </h2>
            <p className="text-sm text-white/60 mt-0.5 font-mono">{lead.phone}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-xl w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center shrink-0 ml-3"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status row */}
          <div className="grid grid-cols-2 gap-3">
            <InfoCell label="Status">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusBadgeClasses(lead.status)}`}>
                {STATUS_LABELS[lead.status] || lead.status}
              </span>
            </InfoCell>
            <InfoCell label="Retry">
              <span className="text-white">{lead.retry_count}/{MAX_RETRIES}</span>
            </InfoCell>
            <InfoCell label="Source">
              <span className="text-white capitalize">{lead.source}</span>
            </InfoCell>
            <InfoCell label="Campaign">
              <span className="text-white">{campaign?.name || "—"}</span>
            </InfoCell>
            <InfoCell label="Next call">
              <span className="text-white">{formatNextCall(lead.next_call_at)}</span>
            </InfoCell>
            <InfoCell label="Last called">
              <span className="text-white">{formatIST(lead.last_called_at)}</span>
            </InfoCell>
            <InfoCell label="Created">
              <span className="text-white">{formatIST(lead.created_at)}</span>
            </InfoCell>
          </div>

          {/* Status override */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-white/60 mb-2">
              Override status
            </p>
            <select
              value={lead.status}
              onChange={(e) => changeStatus(e.target.value as LeadStatus)}
              disabled={savingStatus}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#00B98E] disabled:opacity-50"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="bg-black">
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wider text-white/60">Notes</p>
              {notesDraft !== (lead.notes || "") && (
                <button
                  onClick={saveNotes}
                  disabled={savingNotes}
                  className="text-xs px-3 py-1 rounded-full bg-[#00B98E] text-black font-semibold hover:bg-[#00d494] disabled:opacity-50"
                >
                  {savingNotes ? "Saving…" : "Save"}
                </button>
              )}
            </div>
            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              rows={3}
              placeholder="No notes"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-[#00B98E] resize-none"
            />
          </div>

          {/* Call summaries */}
          {summaries.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-wider text-white/60">Call summary</p>
              {summaries.map((s) => (
                <SummaryCard
                  key={s.id}
                  summary={s}
                  open={openTranscriptId === s.id}
                  onToggle={() =>
                    setOpenTranscriptId((curr) => (curr === s.id ? null : s.id))
                  }
                />
              ))}
            </div>
          )}

          {/* Call history */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-white/60">Call history</p>
            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                Loading…
              </div>
            ) : history.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                No calls yet for this lead.
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="text-left px-3 py-2 text-white/60 font-medium">Date</th>
                      <th className="text-left px-3 py-2 text-white/60 font-medium">Duration</th>
                      <th className="text-left px-3 py-2 text-white/60 font-medium">Status</th>
                      <th className="text-left px-3 py-2 text-white/60 font-medium">Hangup</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id} className="border-t border-white/5">
                        <td className="px-3 py-2 text-white/80">{formatIST(h.started_at)}</td>
                        <td className="px-3 py-2 text-white/80">{formatDuration(h.duration_seconds)}</td>
                        <td className="px-3 py-2 text-white/80 capitalize">{h.status || "—"}</td>
                        <td className="px-3 py-2 text-white/60">{h.hangup_cause || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-white/50">{label}</p>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}

function SummaryCard({
  summary,
  open,
  onToggle,
}: {
  summary: LeadCallSummary;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-white/60">{formatIST(summary.created_at)}</p>
        {summary.lead_score != null && (
          <span className="text-xs font-semibold text-[#00B98E]">
            Score {summary.lead_score}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs mb-3">
        <Pair label="Interest" value={summary.product_interest} />
        <Pair label="Budget" value={summary.budget} />
        <Pair label="Urgency" value={summary.urgency} />
      </div>
      {summary.summary_text && (
        <p className="text-sm text-white/80 leading-relaxed mb-3">{summary.summary_text}</p>
      )}
      {summary.full_transcript && (
        <>
          <button
            onClick={onToggle}
            className="text-xs text-[#00B98E] hover:underline"
          >
            {open ? "Hide transcript ▴" : "Show transcript ▾"}
          </button>
          {open && (
            <pre className="mt-3 max-h-64 overflow-y-auto whitespace-pre-wrap break-words text-xs text-white/70 bg-black/40 border border-white/10 rounded-xl p-3 font-mono">
              {summary.full_transcript}
            </pre>
          )}
        </>
      )}
    </div>
  );
}

function Pair({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-white/50">{label}</p>
      <p className="text-white/90 mt-0.5">{value || "—"}</p>
    </div>
  );
}
