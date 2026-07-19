"use client";

import { useEffect, useState, useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { normalizePhoneBatch } from "@/lib/phone";
import { fetchWalkinSummaryByPhone, type WalkinCardSummary } from "@/lib/supabase/walkins";
import { WalkinBadges } from "./walkins/WalkinIndicator";

// call_number 2/3 accents need to stack with the pink walk-in accent when a
// row is both a follow-up call and a walk-in (inline style, not the
// WALKIN_ACCENT_SHADOW Tailwind class, since the combined band widths are
// computed per-row rather than being one of a fixed set of literal classes
// Tailwind's JIT scanner could pick up statically).
const WALKIN_RGBA = "rgba(244,114,182,0.65)";
const CALL_STAGE: Record<number, { label: string; badgeClass: string; rgba: string }> = {
  2: { label: "2nd Follow-up", badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30", rgba: "rgba(245,158,11,0.6)" },
  3: { label: "Final Call", badgeClass: "bg-red-400/20 text-red-300 border-red-400/30", rgba: "rgba(248,113,113,0.55)" },
};

function rowAccentStyle(hasWalkin: boolean, callNumber: number | null): React.CSSProperties | undefined {
  const layers: string[] = [];
  if (hasWalkin) layers.push(`inset 3px 0 0 0 ${WALKIN_RGBA}`);
  const stage = callNumber != null ? CALL_STAGE[callNumber] : undefined;
  if (stage) layers.push(`inset ${hasWalkin ? 6 : 3}px 0 0 0 ${stage.rgba}`);
  return layers.length ? { boxShadow: layers.join(", ") } : undefined;
}

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
  call_number: number | null;
}

type CampaignFilter = "all" | "fresh_lead" | "react_a" | "react_b" | "react_c" | "reactivation" | "followup_wa";
type TierFilter = "all" | "hot" | "warm" | "cold";
type StatusFilter = "all" | "answered" | "mid_answered" | "unanswered";

const PAGE_SIZE = 50;
const STATS_CHUNK_SIZE = 1000;

interface CallStats {
  total: number;
  answered: number;
  hot: number;
  waTriggered: number;
  avgDuration: number;
}

// Ground truth for "did the phone get picked up" would be call_logs.status,
// but that table is empty tenant-wide (confirmed directly against it), so
// this always falls through to the turn_count check. duration_seconds > 0
// was tried first and rejected: 74% of calls it called "answered" had
// turn_count === 0 — a brief connect/voicemail with no real back-and-forth,
// not a picked-up call. turn_count > 0 means the customer actually said
// something. Shared by the paginated table fetch and the all-rows stats
// fetch so the two can't drift out of sync on what counts as "answered".
function deriveStatus(
  logStatus: string | null | undefined,
  turnCount: number | null | undefined,
): "answered" | "unanswered" {
  if (typeof logStatus === "string") {
    return logStatus.toLowerCase() === "answered" ? "answered" : "unanswered";
  }
  return (turnCount ?? 0) > 0 ? "answered" : "unanswered";
}

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

  // Keyed by normalize_phone()'s canonical form (see lib/phone.ts), then
  // re-keyed to each call's raw phone string below for O(1) render lookups.
  const [walkinSummaries, setWalkinSummaries] = useState<Map<string, WalkinCardSummary>>(new Map());
  const [walkinByPhone, setWalkinByPhone] = useState<Map<string, WalkinCardSummary>>(new Map());

  useEffect(() => {
    fetchWalkinSummaryByPhone()
      .then(setWalkinSummaries)
      .catch(() => {
        // Non-critical: card badges just won't show if this fails.
      });
  }, []);

  useEffect(() => {
    if (calls.length === 0 || walkinSummaries.size === 0) {
      setWalkinByPhone(new Map());
      return;
    }
    const supabase = getSupabaseClient();
    if (!supabase) return;
    let cancelled = false;
    normalizePhoneBatch(supabase, calls.map((c) => c.phone)).then((keys) => {
      if (cancelled) return;
      const map = new Map<string, WalkinCardSummary>();
      for (const call of calls) {
        const key = keys.get(call.phone);
        const summary = key ? walkinSummaries.get(key) : undefined;
        if (summary) map.set(call.phone, summary);
      }
      setWalkinByPhone(map);
    });
    return () => {
      cancelled = true;
    };
  }, [calls, walkinSummaries]);

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

      let query = supabase
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
          started_at,
          call_number,
          call_logs(recording_url, status, hangup_cause, duration_seconds, call_number)
        `
        )
        .eq("tenant_id", "krishna_furniture");

      // Applied server-side (not client-side over whatever's been paginated
      // in so far) so "Load More" keeps fetching more *matching* rows —
      // filtering the already-loaded page alone was under-reporting real
      // totals for anyone who hadn't clicked through every page yet.
      if (campaignFilter !== "all") query = query.eq("campaign_type", campaignFilter);
      if (tierFilter !== "all") query = query.eq("lead_tier", tierFilter);

      // deriveStatus() prefers call_logs.status as ground truth, but
      // call_logs is empty tenant-wide (confirmed directly against the
      // table), so that branch never actually fires today and this filter
      // is exactly equivalent to deriveStatus() as currently observed.
      // "mid_answered" never occurs — deriveStatus only ever returns
      // answered/unanswered — so it's left matching zero rows, same as
      // before this fix. If call_logs starts getting written to, this
      // filter and deriveStatus() will need to be reconciled together.
      if (statusFilter === "answered") query = query.gt("turn_count", 0);
      else if (statusFilter === "unanswered") query = query.or("turn_count.is.null,turn_count.lte.0");
      else if (statusFilter === "mid_answered") query = query.eq("id", "00000000-0000-0000-0000-000000000000");

      const { data, error: fetchError } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      const rows: CallRecord[] = (data || []).map((s: any) => {
        const log = Array.isArray(s.call_logs) ? s.call_logs[0] : s.call_logs;
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
          status: deriveStatus(log?.status, s.turn_count),
          turn_count: s.turn_count ?? 0,
          final_state: s.final_state || "-",
          recording_url: s.recording_url || null,
          interest_signals: s.interest_signals ?? 0,
          rejection_signals: s.rejection_signals ?? 0,
          wa_triggered: s.wa_triggered ?? false,
          full_transcript: Array.isArray(s.full_transcript) ? s.full_transcript : [],
          // call_logs.call_number is ground truth (written once at dispatch);
          // call_summaries.call_number silently defaulted to 1 whenever a
          // call's WebSocket stream never connected (fixed backend-side, but
          // still prefer the reliable column here). NULL on any row from
          // before the call_number migration — expected, not an error case.
          // Badge is simply omitted for those rows.
          call_number: typeof log?.call_number === "number" ? log.call_number : (typeof s.call_number === "number" ? s.call_number : null),
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
  }, [campaignFilter, tierFilter, statusFilter]);

  useEffect(() => {
    setPage(1);
    fetchCalls(1);
  }, [fetchCalls]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchCalls(next);
  };

  const [stats, setStats] = useState<CallStats>({ total: 0, answered: 0, hot: 0, waTriggered: 0, avgDuration: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // The stat cards are meant to describe every call ever made, not just the
  // page(s) of 50 loaded into the table below — so this walks the whole
  // call_summaries table in its own chunked pass, independent of `calls`/
  // pagination, accumulating counts rather than holding every row in memory.
  useEffect(() => {
    let cancelled = false;

    async function fetchAllStats() {
      setStatsLoading(true);
      const supabase = getSupabaseClient();
      if (!supabase) {
        setStatsLoading(false);
        return;
      }

      const totals = { total: 0, answered: 0, hot: 0, waTriggered: 0, durationSum: 0 };
      let from = 0;

      while (true) {
        const { data, error: fetchError } = await supabase
          .from("call_summaries")
          .select("duration_seconds, turn_count, lead_tier, wa_triggered, call_logs(status)")
          .eq("tenant_id", "krishna_furniture")
          .range(from, from + STATS_CHUNK_SIZE - 1);

        if (cancelled) return;
        if (fetchError || !data) break;

        for (const s of data as any[]) {
          const log = Array.isArray(s.call_logs) ? s.call_logs[0] : s.call_logs;
          totals.total += 1;
          if (deriveStatus(log?.status, s.turn_count) === "answered") {
            totals.answered += 1;
          }
          if (s.lead_tier === "hot") totals.hot += 1;
          if (s.wa_triggered) totals.waTriggered += 1;
          totals.durationSum += s.duration_seconds ?? 0;
        }

        if (data.length < STATS_CHUNK_SIZE) break;
        from += STATS_CHUNK_SIZE;
      }

      if (!cancelled) {
        setStats({
          total: totals.total,
          answered: totals.answered,
          hot: totals.hot,
          waTriggered: totals.waTriggered,
          avgDuration: totals.total > 0 ? Math.round(totals.durationSum / totals.total) : 0,
        });
        setStatsLoading(false);
      }
    }

    fetchAllStats();
    return () => {
      cancelled = true;
    };
  }, []);

  // Campaign, tier, and status are now all applied server-side in
  // fetchCalls, so `calls` already only contains matching rows.
  const filtered = calls;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total Calls" value={statsLoading ? "…" : String(stats.total)} color="blue" />
        <StatCard label="Answered" value={statsLoading ? "…" : String(stats.answered)} color="green" />
        <StatCard label="Hot Leads" value={statsLoading ? "…" : String(stats.hot)} color="red" />
        <StatCard label="WA Triggered" value={statsLoading ? "…" : String(stats.waTriggered)} color="purple" />
        <StatCard label="Avg Duration" value={statsLoading ? "…" : formatDuration(stats.avgDuration)} color="cyan" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-6">
        <FilterGroup
          label="Campaign"
          options={[
            { value: "all", label: "All" },
            { value: "fresh_lead", label: "Fresh Lead" },
            { value: "react_a", label: "Plan A" },
            { value: "react_b", label: "Plan B" },
            { value: "react_c", label: "Plan C" },
            { value: "reactivation", label: "Reactivation" },
            { value: "followup_wa", label: "Follow Up" },
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
                  <th className="py-3 px-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((call) => (
                  <>
                    <CallRow
                      key={call.call_uuid}
                      call={call}
                      walkin={walkinByPhone.get(call.phone)}
                      expanded={expandedId === call.call_uuid}
                      onToggle={() =>
                        setExpandedId(expandedId === call.call_uuid ? null : call.call_uuid)
                      }
                    />
                    {expandedId === call.call_uuid && (
                      <tr key={`${call.call_uuid}-expand`}>
                        <td colSpan={10} className="bg-black/40 border-b border-white/10">
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
  walkin,
  expanded,
  onToggle,
}: {
  call: CallRecord;
  walkin?: WalkinCardSummary;
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
    react_a:      "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    react_b:      "bg-purple-500/20 text-purple-300 border-purple-500/30",
    react_c:      "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    reactivation: "bg-orange-500/20 text-orange-300 border-orange-500/30",
    fresh_lead:   "bg-blue-500/20 text-blue-300 border-blue-500/30",
    followup_wa:  "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  };
  const campaignLabel: Record<string, string> = {
    react_a:      "Plan A",
    react_b:      "Plan B",
    react_c:      "Plan C",
    reactivation: "Reactivation",
    fresh_lead:   "Fresh Lead",
    followup_wa:  "Follow Up",
  };

  const statusLabel: Record<string, string> = {
    answered: "Answered",
    mid_answered: "Mid",
    unanswered: "No Answer",
  };

  const callStage = call.call_number != null ? CALL_STAGE[call.call_number] : undefined;

  return (
    <tr
      className={`border-b border-white/5 cursor-pointer transition-colors ${
        expanded ? "bg-white/5" : "hover:bg-white/[0.03]"
      }`}
      style={rowAccentStyle(!!walkin, call.call_number)}
      onClick={onToggle}
    >
      <td className="py-4 px-4">
        <p className="text-white font-medium leading-tight">{call.caller_name}</p>
        <p className="text-white/40 text-xs mt-0.5">{call.phone}</p>
        {(call.call_number != null || walkin) && (
          <div className="flex flex-wrap items-center gap-1 mt-1.5">
            {call.call_number != null && (
              <span className="inline-block px-2 py-0.5 rounded-full text-xs border bg-white/10 text-white/60 border-white/20">
                Call {call.call_number}
              </span>
            )}
            {callStage && (
              <span className={`inline-block px-2 py-0.5 rounded-full text-xs border ${callStage.badgeClass}`}>
                {callStage.label}
              </span>
            )}
            {walkin && <WalkinBadges walkin={walkin} />}
          </div>
        )}
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
          {campaignLabel[call.campaign_type] || call.campaign_type}
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
      <td className="py-4 px-2" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => call.recording_url && window.open(call.recording_url, "_blank")}
          title={call.recording_url ? "Play recording" : "No recording"}
          disabled={!call.recording_url}
          className={`flex items-center justify-center w-7 h-7 rounded-full border transition ${
            call.recording_url
              ? "bg-[#00B98E]/15 border-[#00B98E]/30 text-[#00B98E] hover:bg-[#00B98E]/30 cursor-pointer"
              : "bg-white/5 border-white/10 text-white/20 cursor-not-allowed"
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
          </svg>
        </button>
      </td>
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
      <div>
        <div className="flex items-center gap-3 mb-2">
          <p className="text-xs text-white/40 uppercase tracking-wider">Recording</p>
          {call.recording_url ? (
            <button
              onClick={() => window.open(call.recording_url!, "_blank")}
              title="Open in new tab"
              className="flex items-center justify-center w-6 h-6 rounded-full bg-[#00B98E]/15 border border-[#00B98E]/30 text-[#00B98E] hover:bg-[#00B98E]/30 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path d="M6.3 2.84A1.5 1.5 0 0 0 4 4.11v11.78a1.5 1.5 0 0 0 2.3 1.27l9.344-5.891a1.5 1.5 0 0 0 0-2.538L6.3 2.84Z" />
              </svg>
            </button>
          ) : (
            <span className="text-xs text-white/30">No recording available</span>
          )}
        </div>
        {call.recording_url && (
          <audio
            controls
            src={call.recording_url}
            className="w-full max-w-lg rounded-xl"
            style={{ accentColor: "#00B98E" }}
          />
        )}
      </div>

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
