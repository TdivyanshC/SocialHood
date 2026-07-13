"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { type FollowupStatusRow, fetchFollowupStatuses } from "@/lib/supabase/followupStatus";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { FollowupCard } from "./FollowupCard";
import { visitStatusBucket, type VisitStatusBucket } from "./helpers";

type CallStageFilter = "all" | "fresh_1" | "react_1" | "react_2" | "react_3" | "none";
type VisitFilter = "all" | VisitStatusBucket;
type WhatsappFilter = "all" | "has" | "none";

const CALL_STAGE_OPTIONS: { key: CallStageFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "fresh_1", label: "Fresh Call 1" },
  { key: "react_1", label: "Reactivation 1" },
  { key: "react_2", label: "Reactivation 2" },
  { key: "react_3", label: "Reactivation 3" },
  { key: "none", label: "Not in queue" },
];

const VISIT_OPTIONS: { key: VisitFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "confirmed", label: "Confirmed" },
  { key: "conflict", label: "Conflict" },
  { key: "pending", label: "Pending" },
];

const WHATSAPP_OPTIONS: { key: WhatsappFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "has", label: "Has WhatsApp activity" },
  { key: "none", label: "No WhatsApp activity" },
];

export function FollowupDashboard() {
  const [rows, setRows] = useState<FollowupStatusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [callStageFilter, setCallStageFilter] = useState<CallStageFilter>("all");
  const [visitFilter, setVisitFilter] = useState<VisitFilter>("all");
  const [whatsappFilter, setWhatsappFilter] = useState<WhatsappFilter>("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchFollowupStatuses();
      setRows(list);
    } catch (err: any) {
      setError(err?.message || "Failed to load follow-up status");
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
      .channel("followup_status_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "outbound_leads" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const stats = useMemo(() => {
    const total = rows.length;
    const confirmed = rows.filter((r) => visitStatusBucket(r.visitDate) === "confirmed").length;
    const conflict = rows.filter((r) => visitStatusBucket(r.visitDate) === "conflict").length;
    const pending = rows.filter((r) => visitStatusBucket(r.visitDate) === "pending").length;
    const hasWhatsapp = rows.filter((r) => r.whatsappMessageCount > 0).length;
    return { total, confirmed, conflict, pending, hasWhatsapp };
  }, [rows]);

  const filtered = useMemo(() => {
    let r = rows;
    if (callStageFilter !== "all") {
      r = r.filter((row) => (row.callStage?.key ?? "none") === callStageFilter);
    }
    if (visitFilter !== "all") {
      r = r.filter((row) => visitStatusBucket(row.visitDate) === visitFilter);
    }
    if (whatsappFilter !== "all") {
      const wantsActivity = whatsappFilter === "has";
      r = r.filter((row) => (row.whatsappMessageCount > 0) === wantsActivity);
    }
    const term = search.trim().toLowerCase();
    if (term) {
      r = r.filter((row) =>
        [row.phone, row.name, row.interestedIn].filter(Boolean).some((v) => String(v).toLowerCase().includes(term)),
      );
    }
    // conflicts surface first — they're the ones that need a human decision
    return [...r].sort((a, b) => {
      const rank = (row: FollowupStatusRow) => (visitStatusBucket(row.visitDate) === "conflict" ? 0 : 1);
      return rank(a) - rank(b);
    });
  }, [rows, callStageFilter, visitFilter, whatsappFilter, search]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard label="Total Leads" value={stats.total} color="green" />
        <MetricCard label="Visit Confirmed" value={stats.confirmed} color="cyan" />
        <MetricCard label="Conflicts" value={stats.conflict} color="red" />
        <MetricCard label="Pending" value={stats.pending} color="yellow" />
        <MetricCard label="Has WhatsApp" value={stats.hasWhatsapp} color="purple" />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 space-y-4">
        <FilterRow label="Call stage" options={CALL_STAGE_OPTIONS} value={callStageFilter} onChange={setCallStageFilter} />
        <FilterRow label="Visit date" options={VISIT_OPTIONS} value={visitFilter} onChange={setVisitFilter} />
        <FilterRow label="WhatsApp" options={WHATSAPP_OPTIONS} value={whatsappFilter} onChange={setWhatsappFilter} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search phone, name, interest…"
          className="w-full md:w-80 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-[#00B98E]"
        />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-semibold text-white">Follow-up Status</h2>
          <p className="text-sm text-white/50">{filtered.length} shown</p>
        </div>

        {loading && rows.length === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
            <p className="text-white font-medium">No leads match these filters</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((row) => (
              <FollowupCard key={row.phone} row={row} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs uppercase tracking-wider text-white/40 w-28 shrink-0">{label}</span>
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
            value === opt.key
              ? "bg-[#00B98E] text-black"
              : "border border-white/10 bg-white/5 text-white hover:border-[#00B98E]"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: number; color: string }) {
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
