"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

interface CallRecord {
  id: string;
  call_uuid: string;
  phone: string;
  caller_name: string;
  lead_score: number;
  lead_tier: "hot" | "warm" | "cold";
  campaign_type: "reactivation" | "fresh_lead" | string;
  duration_seconds: number;
  started_at: string;
  status: "answered" | "mid_answered" | "unanswered" | string;
  turn_count: number;
  final_state: string;
  recording_url: string | null;
  interest_signals: number;
  rejection_signals: number;
  wa_triggered: boolean;
  full_transcript: [string, string][];
}

type CampaignFilter = "all" | "reactivation" | "fresh_lead";
type TierFilter = "all" | "hot" | "warm" | "cold";
type StatusFilter = "all" | "answered" | "mid_answered" | "unanswered";

const PAGE_SIZE = 50;

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function CallsDataDashboard() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [campaignFilter, setCampaignFilter] = useState<CampaignFilter>("all");
  const [tierFilter, setTierFilter] = useState<TierFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchCalls = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase client unavailable. Check environment variables.");
      setLoading(false);
      return;
    }

    try {
      const from = (pageNum - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      const { data, error: fetchError } = await supabase
        .from("call_summaries")
        .select(
          `
          id,
          call_uuid,
          phone,
          turn_count,
          final_state,
          full_transcript,
          lead_score,
          lead_tier,
          campaign_type,
          recording_url,
          interest_signals,
          rejection_signals,
          wa_triggered,
          created_at,
          duration_seconds,
          caller_name,
          started_at
        `
        )
        .eq("tenant_id", "krishna_furniture")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      const rows: CallRecord[] = (data || []).map((s: any) => {
        return {
          id: s.id,
          call_uuid: s.call_uuid,
          phone: s.phone || "N/A",
          caller_name: s.caller_name || "Unknown",
          lead_score: s.lead_score ?? 0,
          lead_tier: s.lead_tier || "cold",
          campaign_type: s.campaign_type || "fresh_lead",
          duration_seconds: s.duration_seconds ?? 0,
          started_at: s.started_at || s.created_at,
          status: s.wa_triggered ? "answered" : s.turn_count > 0 ? "answered" : "unanswered",
          turn_count: s.turn_count ?? 0,
          final_state: s.final_state || "-",
          recording_url: s.recording_url || null,
          interest_signals: s.interest_signals ?? 0,
          rejection_signals: s.rejection_signals ?? 0,
          wa_triggered: s.wa_triggered ?? false,
          full_transcript: Array.isArray(s.full_transcript) ? s.full_transcript : [],
        };
      });

      setHasMore(rows.length === PAGE_SIZE);
      if (pageNum === 1) {
        setCalls(rows);
      } else {
        setCalls((prev) => [...prev, ...rows]);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load calls.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchCalls(1);
  }, [fetchCalls]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchCalls(next);
  };

  const filtered = useMemo(() => {
    return calls.filter((c) => {
      if (campaignFilter !== "all" && c.campaign_type !== campaignFilter) return false;
      if (tierFilter !== "all" && c.lead_tier !== tierFilter) return false;
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      return true;
    });
  }, [calls, campaignFilter, tierFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: calls.length,
    answered: calls.filter((c) => c.status === "answered").length,
    hot: calls.filter((c) => c.lead_tier === "hot").length,
    waTriggered: calls.filter((c) => c.wa_triggered).length,
    avgDuration: calls.length > 0
      ? Math.round(calls.reduce((s, c) => s + c.duration_seconds, 0) / calls.length)
      : 0,
  }), [calls]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Calls" value={String(stats.total)} color="blue" />
        <StatCard label="Answered" value={String(stats.answered)} color="green" />
        <StatCard label="Hot Leads" value={String(stats.hot)} color="red" />
        <StatCard label="WA Triggered" value={String(stats.waTriggered)} color="purple" />
        <StatCard label="Avg Duration" value={formatDuration(stats.avgDuration)} color="cyan" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-6">
        <FilterGroup
          label="Campaign"
          options={[
            { value: "all", label: "All" },
            { value: "reactivation", label: "Reactivation" },
            { value: "fresh_lead", label: "Fresh Lead" },
          ]}
          value={campaignFilter}
          onChange={(v) => setCampaignFilter(v as CampaignFilter)}
        />
        <FilterGroup
          label="Tier"
          options={[
            { value: "all", label: "All" },
            { value: "hot", label: "🔴 Hot" },
            { value: "warm", label: "🟡 Warm" },
            { value: "cold", label: "⚪ Cold" },
          ]}
          value={tierFilter}
          onChange={(v) => setTierFilter(v as TierFilter)}
        />
        <FilterGroup
          label="Status"
          options={[
            { value: "all", label: "All" },
            { value: "answered", label: "Answered" },
            { value: "mid_answered", label: "Mid-answered" },
            { value: "unanswered", label: "Unanswered" },
          ]}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as StatusFilter)}
        />
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">
            Call Records{" "}
            <span className="text-sm font-normal text-white/50">
              ({filtered.length} shown)
            </span>
          </h2>
        </div>

        {error ? (
          <div className="p-8 text-center text-red-400">{error}</div>
        ) : loading && calls.length === 0 ? (
          <div className="p-8 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00B98E] animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-[#00B98E] animate-pulse delay-100" />
            <div className="w-2 h-2 rounded-full bg-[#00B98E] animate-pulse delay-200" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-white/50">No calls match the selected filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                  <th className="text-left py-3 px-4 font-medium">Name / Phone</th>
                  <th className="text-left py-3 px-4 font-medium">Date & Time</th>
                  <th className="text-left py-3 px-4 font-medium">Duration</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Campaign</th>
                  <th className="text-left py-3 px-4 font-medium">Tier</th>
                  <th className="text-left py-3 px-4 font-medium">Score</th>
                  <th className="text-left py-3 px-4 font-medium">WA</th>
                  <th className="text-left py-3 px-4 font-medium">Turns</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((call) => (
                  <>
                    <CallRow
                      key={call.call_uuid}
                      call={call}
                      expanded={expandedId === call.call_uuid}
                      onToggle={() =>
                        setExpandedId(expandedId === call.call_uuid ? null : call.call_uuid)
                      }
                    />
                    {expandedId === call.call_uuid && (
                      <tr key={`${call.call_uuid}-expand`}>
                        <td colSpan={9} className="bg-black/40 border-b border-white/10">
                          <ExpandedRow call={call} />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {hasMore && (
          <div className="p-4 flex justify-center border-t border-white/10">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-6 py-2 rounded-full text-sm font-medium bg-white/5 border border-white/10 text-white hover:border-[#00B98E] transition disabled:opacity-50"
            >
              {loading ? "Loading…" : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CallRow({
  call,
  expanded,
  onToggle,
}: {
  call: CallRecord;
  expanded: boolean;
  onToggle: () => void;
}) {
  const statusBadge: Record<string, string> = {
    answered: "bg-green-500/20 text-green-300 border-green-500/30",
    mid_answered: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    unanswered: "bg-red-500/20 text-red-300 border-red-500/30",
  };
  const tierBadge: Record<string, string> = {
    hot: "bg-red-500/20 text-red-300 border-red-500/30",
    warm: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    cold: "bg-white/10 text-white/50 border-white/20",
  };
  const campaignBadge: Record<string, string> = {
    reactivation: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    fresh_lead: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  };

  const statusLabel: Record<string, string> = {
    answered: "Answered",
    mid_answered: "Mid",
    unanswered: "No Answer",
  };

  return (
    <tr
      className={`border-b border-white/5 cursor-pointer transition-colors ${
        expanded ? "bg-white/5" : "hover:bg-white/[0.03]"
      }`}
      onClick={onToggle}
    >
      <td className="py-4 px-4">
        <p className="text-white font-medium leading-tight">{call.caller_name}</p>
        <p className="text-white/40 text-xs mt-0.5">{call.phone}</p>
      </td>
      <td className="py-4 px-4 text-white/60 text-xs whitespace-nowrap">
        {formatDateTime(call.started_at)}
      </td>
      <td className="py-4 px-4 text-white/70 font-mono">
        {formatDuration(call.duration_seconds)}
      </td>
      <td className="py-4 px-4">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs border ${
            statusBadge[call.status] || "bg-white/10 text-white/50 border-white/20"
          }`}
        >
          {statusLabel[call.status] || call.status}
        </span>
      </td>
      <td className="py-4 px-4">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs border ${
            campaignBadge[call.campaign_type] || "bg-white/10 text-white/50 border-white/20"
          }`}
        >
          {call.campaign_type === "reactivation" ? "Reactivation" : "Fresh Lead"}
        </span>
      </td>
      <td className="py-4 px-4">
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs border ${
            tierBadge[call.lead_tier] || "bg-white/10 text-white/50 border-white/20"
          }`}
        >
          {call.lead_tier.toUpperCase()}
        </span>
      </td>
      <td className="py-4 px-4">
        <span
          className={`text-sm font-bold ${
            call.lead_score >= 70
              ? "text-red-400"
              : call.lead_score >= 40
              ? "text-orange-400"
              : "text-white/40"
          }`}
        >
          {call.lead_score}
        </span>
      </td>
      <td className="py-4 px-4">
        {call.wa_triggered ? (
          <span className="text-green-400 text-xs font-medium">✓ Sent</span>
        ) : (
          <span className="text-white/30 text-xs">—</span>
        )}
      </td>
      <td className="py-4 px-4 text-white/60 text-sm">{call.turn_count}</td>
    </tr>
  );
}

function ExpandedRow({ call }: { call: CallRecord }) {
  return (
    <div className="px-6 py-5 space-y-5">
      {/* Meta row */}
      <div className="flex flex-wrap gap-6 text-sm">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Final State</p>
          <p className="text-white font-medium">{call.final_state}</p>
        </div>
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Interest Signals</p>
          <p className="text-green-400 font-bold">+{call.interest_signals}</p>
        </div>
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Rejection Signals</p>
          <p className="text-red-400 font-bold">−{call.rejection_signals}</p>
        </div>
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Turn Count</p>
          <p className="text-white">{call.turn_count}</p>
        </div>
      </div>

      {/* Audio player */}
      {call.recording_url && (() => {
        const recordingId = call.recording_url.split("/").pop()?.replace(/\.mp3$/i, "");
        const proxySrc = recordingId ? `https://voice.thesocialhood.in/recording/${recordingId}` : null;
        return proxySrc ? (
          <div>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Recording</p>
            <audio
              controls
              src={proxySrc}
              className="w-full max-w-lg rounded-xl"
              style={{ accentColor: "#00B98E" }}
            />
          </div>
        ) : null;
      })()}

      {/* Transcript */}
      <div>
        <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Transcript</p>
        {call.full_transcript.length === 0 ? (
          <p className="text-white/30 text-sm">No transcript available.</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {call.full_transcript.map(([role, text], idx) => {
              const isUser = role === "user";
              return (
                <div key={idx} className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                      isUser
                        ? "bg-white/10 border border-white/10 text-white/90 rounded-tl-sm"
                        : "bg-[#00B98E]/20 border border-[#00B98E]/30 text-white rounded-tr-sm"
                    }`}
                  >
                    <p className="text-[10px] font-semibold opacity-50 mb-1 uppercase tracking-wider">
                      {isUser ? "Customer" : "AI"}
                    </p>
                    <p className="whitespace-pre-wrap break-words leading-snug">{text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-white/40 uppercase tracking-wider mr-1">{label}:</span>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
            value === opt.value
              ? "bg-[#00B98E] text-black"
              : "border border-white/10 bg-white/5 text-white/70 hover:border-[#00B98E]/50"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const border: Record<string, string> = {
    blue: "border-blue-500/30 bg-blue-500/10",
    red: "border-red-500/30 bg-red-500/10",
    green: "border-green-500/30 bg-green-500/10",
    cyan: "border-cyan-500/30 bg-cyan-500/10",
    purple: "border-purple-500/30 bg-purple-500/10",
  };
  const text: Record<string, string> = {
    blue: "text-blue-400",
    red: "text-red-400",
    green: "text-green-400",
    cyan: "text-cyan-400",
    purple: "text-purple-400",
  };
  return (
    <div className={`rounded-2xl border p-4 ${border[color]}`}>
      <p className="text-sm text-white/70 font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-2 ${text[color]}`}>{value}</p>
    </div>
  );
}
