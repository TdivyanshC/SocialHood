"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import { bulkUploadWalkins } from "@/lib/supabase/walkins";
import { isValidIndianPhone } from "@/lib/supabase/leads";
import { useToast } from "../leads/Toast";

interface WalkinsCsvUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onImported: () => void;
}

type RawRow = Record<string, string>;

const TARGET_FIELDS = [
  "phone",
  "visit_date",
  "source",
  "visit_number",
  "budget_manual",
  "budget_wa",
  "followup_calls_made",
  "converted",
  "notes",
] as const;
type TargetField = (typeof TARGET_FIELDS)[number];

const REQUIRED_FIELDS: TargetField[] = ["phone", "visit_date"];

export function WalkinsCsvUpload({ isOpen, onClose, onImported }: WalkinsCsvUploadProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<RawRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<TargetField, string>>(emptyMapping());
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const reset = () => {
    setFileName(null);
    setRows([]);
    setHeaders([]);
    setMapping(emptyMapping());
    setParseError(null);
    setImporting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFile = useCallback((file: File) => {
    setParseError(null);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setParseError("Only .csv files are accepted");
      return;
    }
    setFileName(file.name);
    Papa.parse<RawRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsed = (result.data || []).filter((r) => Object.values(r).some((v) => v));
        const detected = result.meta.fields || [];
        setRows(parsed);
        setHeaders(detected);
        setMapping(autoMap(detected));
      },
      error: (err) => {
        setParseError(err.message || "Failed to parse CSV");
      },
    });
  }, []);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const stats = useMemo(() => {
    if (!rows.length || !mapping.phone || !mapping.visit_date) return { total: 0, valid: 0, invalid: 0 };
    let valid = 0;
    let invalid = 0;
    for (const r of rows) {
      const phone = r[mapping.phone];
      const visitDate = r[mapping.visit_date];
      if (phone && isValidIndianPhone(phone) && visitDate) valid++;
      else invalid++;
    }
    return { total: rows.length, valid, invalid };
  }, [rows, mapping]);

  const canImport = !!mapping.phone && !!mapping.visit_date && stats.valid > 0 && !importing;

  const doImport = async () => {
    if (!mapping.phone || !mapping.visit_date) return;
    setImporting(true);
    try {
      const payload = rows
        .filter((r) => isValidIndianPhone(r[mapping.phone]) && r[mapping.visit_date])
        .map((r) => ({
          phone: r[mapping.phone],
          visit_date: r[mapping.visit_date],
          source: mapping.source ? r[mapping.source] : undefined,
          visit_number: mapping.visit_number ? r[mapping.visit_number] : undefined,
          budget_manual: mapping.budget_manual ? r[mapping.budget_manual] : undefined,
          budget_wa: mapping.budget_wa ? r[mapping.budget_wa] : undefined,
          followup_calls_made: mapping.followup_calls_made ? r[mapping.followup_calls_made] : undefined,
          converted: mapping.converted ? r[mapping.converted] : undefined,
          notes: mapping.notes ? r[mapping.notes] : undefined,
        }));
      const result = await bulkUploadWalkins(payload);
      toast.push(
        "success",
        `${result.added} added, ${result.skipped} skipped${
          stats.invalid > 0 ? ` · ${stats.invalid} rows had invalid phone/date` : ""
        }`,
      );
      reset();
      onImported();
    } catch (err: any) {
      toast.push("error", err?.message || "Import failed");
    } finally {
      setImporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 bg-black p-6 shadow-2xl shadow-black/40">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#00B98E]">Bulk upload</p>
            <h3 className="text-2xl font-semibold text-white mt-1">Import walk-ins CSV</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="text-white/60 hover:text-white text-xl w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {!rows.length ? (
          <>
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={`block rounded-2xl border-2 border-dashed p-10 text-center cursor-pointer transition ${
                dragging ? "border-[#00B98E] bg-[#00B98E]/10" : "border-white/15 bg-white/5 hover:border-[#00B98E]/60"
              }`}
            >
              <input ref={fileInputRef} type="file" accept=".csv" onChange={onSelect} className="hidden" />
              <p className="text-white text-lg font-medium">Drag a .csv file here</p>
              <p className="text-sm text-white/60 mt-1">or click to browse</p>
              <p className="text-xs text-white/40 mt-4">
                Expected columns:{" "}
                <span className="font-mono">
                  phone, visit_date, source, visit_number, budget_manual, budget_wa, followup_calls_made, converted,
                  notes
                </span>{" "}
                · phone and visit_date required
              </p>
            </label>
            {parseError && <p className="mt-3 text-sm text-red-400">{parseError}</p>}
          </>
        ) : (
          <>
            <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-medium">{fileName}</p>
                <p className="text-xs text-white/60 mt-0.5">
                  {stats.total} rows · {stats.valid} valid · {stats.invalid} invalid
                </p>
              </div>
              <button onClick={reset} className="text-xs text-white/70 hover:text-white underline">
                Choose different file
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <p className="text-sm text-white/70">Map your CSV columns to walk-in fields:</p>
              {TARGET_FIELDS.map((field) => (
                <div key={field} className="grid grid-cols-3 gap-3 items-center">
                  <label className="text-sm text-white/80">
                    {field}
                    {REQUIRED_FIELDS.includes(field) && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  <select
                    value={mapping[field]}
                    onChange={(e) => setMapping((m) => ({ ...m, [field]: e.target.value }))}
                    className="col-span-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#00B98E]"
                  >
                    <option value="" className="bg-black">— skip —</option>
                    {headers.map((h) => (
                      <option key={h} value={h} className="bg-black">
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  reset();
                  onClose();
                }}
                className="px-4 py-2 rounded-full text-sm font-medium border border-white/10 text-white hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={doImport}
                disabled={!canImport}
                className="px-5 py-2 rounded-full text-sm font-semibold bg-[#00B98E] text-black hover:bg-[#00d494] disabled:opacity-50"
              >
                {importing ? "Importing…" : `Import ${stats.valid} walk-ins`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function emptyMapping(): Record<TargetField, string> {
  return {
    phone: "",
    visit_date: "",
    source: "",
    visit_number: "",
    budget_manual: "",
    budget_wa: "",
    followup_calls_made: "",
    converted: "",
    notes: "",
  };
}

function autoMap(headers: string[]): Record<TargetField, string> {
  const lower = headers.map((h) => h.trim().toLowerCase());
  const find = (...candidates: string[]) => {
    for (const c of candidates) {
      const idx = lower.indexOf(c);
      if (idx >= 0) return headers[idx];
    }
    return "";
  };
  return {
    phone: find("phone", "phone_number", "mobile", "number", "contact"),
    visit_date: find("visit_date", "date", "visit date", "visitdate"),
    source: find("source"),
    visit_number: find("visit_number", "visit#", "visit_no", "visit number"),
    budget_manual: find("budget_manual", "budget", "manual_budget"),
    budget_wa: find("budget_wa", "wa_budget", "whatsapp_budget"),
    followup_calls_made: find("followup_calls_made", "followup_calls", "follow_up_calls", "calls_made"),
    converted: find("converted", "sale", "converted_to_sale"),
    notes: find("notes", "note", "comment", "comments", "remarks"),
  };
}
