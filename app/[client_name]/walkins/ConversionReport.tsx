"use client";

import type { ConversionReport as ConversionReportData } from "@/lib/supabase/walkins";

interface ConversionReportProps {
  report: ConversionReportData | null;
  loading: boolean;
  error: string | null;
}

export function ConversionReport({ report, loading, error }: ConversionReportProps) {
  if (error) {
    return (
      <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">{error}</div>
    );
  }
  if (loading || !report) {
    return <div className="h-64 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Walk-ins" value={String(report.totalWalkins)} color="blue" />
        <StatCard label="Converted" value={String(report.converted)} color="green" />
        <StatCard label="Conversion Rate" value={`${report.conversionRate}%`} color="cyan" />
        <StatCard label="System-matched" value={String(report.bySource.system)} color="purple" />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">System vs Offline</h3>
        <ProportionBar
          segments={[
            { label: "System", value: report.bySource.system, color: "bg-cyan-500/70" },
            { label: "Offline", value: report.bySource.offline, color: "bg-white/30" },
          ]}
        />
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-white">Originating Funnel</h3>
        </div>
        <p className="text-xs text-white/40 mb-4">
          Derived by matching each walk-in's linked lead campaign name for "fresh" / "reactivation" — walk-ins with
          no linked lead, or a campaign name that doesn't match either keyword, fall under "Other".
        </p>
        <ProportionBar
          segments={[
            { label: "Fresh", value: report.byFunnel.fresh, color: "bg-blue-500/70" },
            { label: "Reactivation", value: report.byFunnel.reactivation, color: "bg-orange-500/70" },
            { label: "Other", value: report.byFunnel.other, color: "bg-white/30" },
          ]}
        />
        <div className="grid grid-cols-3 gap-3 mt-4">
          <FunnelConvertedCell
            label="Fresh"
            total={report.byFunnel.fresh}
            converted={report.convertedByFunnel.fresh}
          />
          <FunnelConvertedCell
            label="Reactivation"
            total={report.byFunnel.reactivation}
            converted={report.convertedByFunnel.reactivation}
          />
          <FunnelConvertedCell
            label="Other"
            total={report.byFunnel.other}
            converted={report.convertedByFunnel.other}
          />
        </div>
      </div>
    </div>
  );
}

function FunnelConvertedCell({ label, total, converted }: { label: string; total: number; converted: number }) {
  const rate = total > 0 ? Math.round((converted / total) * 100) : 0;
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-white/50">{label}</p>
      <p className="mt-0.5 text-sm text-white">
        {converted}/{total} <span className="text-white/40">converted</span>
      </p>
      <p className="text-xs text-green-400">{rate}%</p>
    </div>
  );
}

function ProportionBar({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) {
    return <p className="text-sm text-white/50">No data yet.</p>;
  }
  return (
    <div className="space-y-3">
      <div className="flex h-10 gap-1 overflow-hidden rounded-lg bg-white/5">
        {segments
          .filter((seg) => seg.value > 0)
          .map((seg) => (
            <div
              key={seg.label}
              className={`${seg.color} flex items-center justify-center text-xs font-semibold transition`}
              style={{ width: `${(seg.value / total) * 100}%` }}
              title={`${seg.label}: ${seg.value}`}
            >
              {seg.value}
            </div>
          ))}
      </div>
      <div className="flex flex-wrap gap-4">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5 text-xs text-white/70">
            <span className={`w-2.5 h-2.5 rounded-full ${seg.color}`} />
            {seg.label}: {seg.value}
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const border: Record<string, string> = {
    blue: "border-blue-500/30 bg-blue-500/10",
    green: "border-green-500/30 bg-green-500/10",
    cyan: "border-cyan-500/30 bg-cyan-500/10",
    purple: "border-purple-500/30 bg-purple-500/10",
  };
  const text: Record<string, string> = {
    blue: "text-blue-400",
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
