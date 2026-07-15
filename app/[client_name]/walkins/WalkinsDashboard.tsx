"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchConversionReport,
  fetchWalkinsForTable,
  type ConversionReport as ConversionReportData,
  type WalkinTableRow,
} from "@/lib/supabase/walkins";
import { ToastProvider } from "../leads/Toast";
import { AddWalkinModal } from "./AddWalkinModal";
import { ConversionReport } from "./ConversionReport";
import { WalkinsCsvUpload } from "./WalkinsCsvUpload";
import { WalkinsTable } from "./WalkinsTable";

type ViewMode = "table" | "report";

export function WalkinsDashboard() {
  return (
    <ToastProvider>
      <WalkinsDashboardInner />
    </ToastProvider>
  );
}

function WalkinsDashboardInner() {
  const [view, setView] = useState<ViewMode>("table");

  const [rows, setRows] = useState<WalkinTableRow[]>([]);
  const [rowsLoading, setRowsLoading] = useState(true);
  const [rowsError, setRowsError] = useState<string | null>(null);

  const [report, setReport] = useState<ConversionReportData | null>(null);
  const [reportLoading, setReportLoading] = useState(true);
  const [reportError, setReportError] = useState<string | null>(null);

  const [showAdd, setShowAdd] = useState(false);
  const [showCsv, setShowCsv] = useState(false);

  const loadTable = useCallback(async () => {
    setRowsLoading(true);
    setRowsError(null);
    try {
      setRows(await fetchWalkinsForTable());
    } catch (err: any) {
      setRowsError(err?.message || "Failed to load walk-ins");
    } finally {
      setRowsLoading(false);
    }
  }, []);

  const loadReport = useCallback(async () => {
    setReportLoading(true);
    setReportError(null);
    try {
      setReport(await fetchConversionReport());
    } catch (err: any) {
      setReportError(err?.message || "Failed to load conversion report");
    } finally {
      setReportLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTable();
    loadReport();
  }, [loadTable, loadReport]);

  const refreshAll = () => {
    loadTable();
    loadReport();
  };

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Walk-ins</h2>
          <p className="text-sm text-white/60 mt-1">
            Track in-store visits logged by the client, whether or not they came through the AI pipeline.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowCsv(true)}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:border-[#00B98E] transition"
          >
            ⬆ Upload CSV
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="rounded-full bg-[#00B98E] px-4 py-2 text-sm font-semibold text-black hover:bg-[#00d494] transition"
          >
            + Add walk-in
          </button>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex flex-wrap gap-2">
        {(["table", "report"] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              view === v
                ? "bg-[#00B98E] text-black"
                : "border border-white/10 bg-white/5 text-white hover:border-[#00B98E]"
            }`}
          >
            {v === "table" ? "Table" : "Conversion Report"}
          </button>
        ))}
      </div>

      {view === "table" ? (
        <WalkinsTable rows={rows} loading={rowsLoading} error={rowsError} />
      ) : (
        <ConversionReport report={report} loading={reportLoading} error={reportError} />
      )}

      <AddWalkinModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={() => {
          setShowAdd(false);
          refreshAll();
        }}
      />

      <WalkinsCsvUpload
        isOpen={showCsv}
        onClose={() => setShowCsv(false)}
        onImported={() => {
          setShowCsv(false);
          refreshAll();
        }}
      />
    </div>
  );
}
