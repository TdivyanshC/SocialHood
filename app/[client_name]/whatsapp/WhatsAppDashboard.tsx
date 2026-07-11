"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type LeadDashboardRow,
  fetchLeadDashboard,
} from "@/lib/supabase/leadDashboard";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { ConversationCard } from "./ConversationCard";
import { ConversationDetailModal } from "./ConversationDetailModal";

type StatusFilter = "all" | "hot" | "warm" | "cold" | "visit";

const TEMPERATURE_RANK: Record<string, number> = { hot: 0, warm: 1, cold: 2 };

function sortByTemperature(rows: LeadDashboardRow[]): LeadDashboardRow[] {
  return [...rows].sort((a, b) => {
    const rankA = TEMPERATURE_RANK[(a.lead_status || "").toLowerCase()] ?? 3;
    const rankB = TEMPERATURE_RANK[(b.lead_status || "").toLowerCase()] ?? 3;
    if (rankA !== rankB) return rankA - rankB;
    return (b.score ?? -Infinity) - (a.score ?? -Infinity);
  });
}

export function WhatsAppDashboard() {
  const [rows, setRows] = useState<LeadDashboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<LeadDashboardRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchLeadDashboard();
      setRows(list);
    } catch (err: any) {
      setError(err?.message || "Failed to load WhatsApp leads");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const channel = supabase
      .channel("lead_dashboard_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "leads" },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const sortedRows = useMemo(() => sortByTemperature(rows), [rows]);

  const stats = useMemo(() => {
    const total = rows.length;
    const hot = rows.filter((r) => (r.lead_status || "").toLowerCase() === "hot").length;
    const warm = rows.filter((r) => (r.lead_status || "").toLowerCase() === "warm").length;
    const cold = rows.filter((r) => (r.lead_status || "").toLowerCase() === "cold").length;
    const visitConfirmed = rows.filter((r) => r.visit_confirmed).length;
    const totalInteractions = rows.reduce((s, r) => s + (r.interaction_count || 0), 0);
    const scored = rows.filter((r) => r.score != null);
    const avgScore =
      scored.length > 0
        ? Math.round(scored.reduce((s, r) => s + (r.score || 0), 0) / scored.length)
        : 0;
    return { total, hot, warm, cold, visitConfirmed, totalInteractions, avgScore };
  }, [rows]);

  const pipeline = useMemo(() => {
    const total = Math.max(stats.total, 1);
    return [
      { label: "Hot", value: stats.hot, pct: (stats.hot / total) * 100, color: "bg-red-500/70" },
      { label: "Warm", value: stats.warm, pct: (stats.warm / total) * 100, color: "bg-yellow-500/70" },
      { label: "Cold", value: stats.cold, pct: (stats.cold / total) * 100, color: "bg-blue-500/70" },
      {
        label: "Other",
        value: stats.total - stats.hot - stats.warm - stats.cold,
        pct: ((stats.total - stats.hot - stats.warm - stats.cold) / total) * 100,
        color: "bg-white/30",
      },
    ].filter((seg) => seg.value > 0);
  }, [stats]);

  const filtered = useMemo(() => {
    let r = sortedRows;
    if (statusFilter === "visit") {
      r = r.filter((row) => row.visit_confirmed);
    } else if (statusFilter !== "all") {
      r = r.filter((row) => (row.lead_status || "").toLowerCase() === statusFilter);
    }
    const term = search.trim().toLowerCase();
    if (term) {
      r = r.filter((row) =>
        [
          row.phone,
          row.last_message,
          row.interested_in,
          row.selected_product_name,
          row.conversation_summary,
        ]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term)),
      );
    }
    return r;
  }, [sortedRows, statusFilter, search]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard label="Total Leads" value={stats.total.toString()} color="green" />
        <MetricCard label="Hot Leads" value={stats.hot.toString()} color="red" />
        <MetricCard label="Warm Leads" value={stats.warm.toString()} color="yellow" />
        <MetricCard label="Cold Leads" value={stats.cold.toString()} color="blue" />
        <MetricCard label="Visit Confirmed" value={stats.visitConfirmed.toString()} color="purple" />
        <MetricCard label="Avg Score" value={stats.avgScore.toString()} color="cyan" />
      </div>

      {/* Pipeline */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Lead Pipeline</h2>
          <p className="text-sm text-white/60">
            {stats.totalInteractions.toLocaleString("en-IN")} total messages
          </p>
        </div>
        {pipeline.length === 0 ? (
          <p className="text-sm text-white/60">No leads yet.</p>
        ) : (
          <div className="flex h-16 gap-1 overflow-hidden rounded-lg bg-white/5">
            {pipeline.map((seg) => (
              <div
                key={seg.label}
                className={`${seg.color} flex items-center justify-center text-xs font-semibold transition`}
                style={{ width: `${seg.pct}%` }}
                title={`${seg.label}: ${seg.value}`}
              >
                <div className="text-center px-2">
                  <p className="text-white">{seg.value} {seg.label}</p>
                  <p className="text-white/70 text-[10px]">{Math.round(seg.pct)}%</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {(["all", "hot", "warm", "cold", "visit"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                s === "visit" ? "" : "capitalize"
              } ${
                statusFilter === s
                  ? "bg-[#00B98E] text-black"
                  : "border border-white/10 bg-white/5 text-white hover:border-[#00B98E]"
              }`}
            >
              {s === "visit" ? "Visit Confirmed" : s}
              {s !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  {s === "hot"
                    ? stats.hot
                    : s === "warm"
                    ? stats.warm
                    : s === "cold"
                    ? stats.cold
                    : stats.visitConfirmed}
                </span>
              )}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search phone, message, product…"
          className="w-full md:w-80 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-[#00B98E]"
        />
      </div>

      {/* Conversations */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-white">Conversations</h2>
          <p className="text-sm text-white/50">{filtered.length} shown</p>
        </div>

        {loading && rows.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-white/5 border border-white/10 animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-white font-medium">No conversations to show</p>
            <p className="text-sm text-white/60 mt-1">
              {rows.length === 0
                ? "WhatsApp leads will appear here as customers chat with the AI."
                : "Try changing the filter or clearing the search."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((row) => (
              <ConversationCard
                key={row.phone}
                row={row}
                onClick={() => setSelected(row)}
              />
            ))}
          </div>
        )}
      </div>

      <ConversationDetailModal
        row={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "border-blue-500/30 bg-blue-500/10",
    red: "border-red-500/30 bg-red-500/10",
    yellow: "border-yellow-500/30 bg-yellow-500/10",
    green: "border-green-500/30 bg-green-500/10",
    cyan: "border-cyan-500/30 bg-cyan-500/10",
    purple: "border-purple-500/30 bg-purple-500/10",
  };
  const valueColorMap: Record<string, string> = {
    blue: "text-blue-400",
    red: "text-red-400",
    yellow: "text-yellow-400",
    green: "text-green-400",
    cyan: "text-cyan-400",
    purple: "text-purple-400",
  };
  return (
    <div className={`rounded-2xl border p-4 ${colorMap[color]}`}>
      <p className="text-sm text-white/70 font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-2 ${valueColorMap[color]}`}>{value}</p>
    </div>
  );
}
