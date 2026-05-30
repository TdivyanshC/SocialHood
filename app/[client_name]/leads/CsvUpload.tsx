"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import type { Campaign } from "@/lib/supabase/campaigns";
import { bulkUploadLeads, isValidIndianPhone } from "@/lib/supabase/leads";
import { useToast } from "./Toast";

interface CsvUploadProps {
  isOpen: boolean;
  campaigns: Campaign[];
  defaultCampaignId: string | null;
  onClose: () => void;
  onImported: () => void;
}

type RawRow = Record<string, string>;

const TARGET_FIELDS = ["name", "phone", "notes"] as const;
type TargetField = (typeof TARGET_FIELDS)[number];

export function CsvUpload({
  isOpen,
  campaigns,
  defaultCampaignId,
  onClose,
  onImported,
}: CsvUploadProps) {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [rows, setRows] = useState<RawRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<TargetField, string>>({
    name: "",
    phone: "",
    notes: "",
  });
  const [dragging, setDragging] = useState(false);
  const [importing, setImporting] = useState(false);
  const [campaignId, setCampaignId] = useState<string>(defaultCampaignId || "");
  const [parseError, setParseError] = useState<string | null>(null);

  const reset = () => {
    setFileName(null);
    setRows([]);
    setHeaders([]);
    setMapping({ name: "", phone: "", notes: "" });
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

  const mappedPreview = useMemo(() => {
    if (!rows.length) return [];
    return rows.slice(0, 5).map((r) => ({
      name: mapping.name ? r[mapping.name] || "" : "",
      phone: mapping.phone ? r[mapping.phone] || "" : "",
      notes: mapping.notes ? r[mapping.notes] || "" : "",
    }));
  }, [rows, mapping]);

  const stats = useMemo(() => {
    if (!rows.length || !mapping.phone) return { total: 0, valid: 0, invalid: 0 };
    let valid = 0;
    let invalid = 0;
    for (const r of rows) {
      const phone = r[mapping.phone];
      if (phone && isValidIndianPhone(phone)) valid++;
      else invalid++;
    }
    return { total: rows.length, valid, invalid };
  }, [rows, mapping]);

  const canImport = !!mapping.phone && stats.valid > 0 && !importing;

  const doImport = async () => {
    if (!mapping.phone) return;
    setImporting(true);
    try {
      const payload = rows
        .filter((r) => isValidIndianPhone(r[mapping.phone]))
        .map((r) => ({
          name: mapping.name ? r[mapping.name] : undefined,
          phone: r[mapping.phone],
          notes: mapping.notes ? r[mapping.notes] : undefined,
        }));
      const result = await bulkUploadLeads(payload, campaignId || null);
      toast.push(
        "success",
        `${result.added} added, ${result.skipped} skipped (duplicates)${
          stats.invalid > 0 ? ` · ${stats.invalid} rows had invalid phones` : ""
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
            <h3 className="text-2xl font-semibold text-white mt-1">Import CSV</h3>
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
                dragging
                  ? "border-[#00B98E] bg-[#00B98E]/10"
                  : "border-white/15 bg-white/5 hover:border-[#00B98E]/60"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={onSelect}
                className="hidden"
              />
              <p className="text-white text-lg font-medium">Drag a .csv file here</p>
              <p className="text-sm text-white/60 mt-1">or click to browse</p>
              <p className="text-xs text-white/40 mt-4">
                Expected columns: <span className="font-mono">name, phone, notes</span> · phone required
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
                  {stats.total} rows · {stats.valid} valid · {stats.invalid} invalid phone
                </p>
              </div>
              <button
                onClick={reset}
                className="text-xs text-white/70 hover:text-white underline"
              >
                Choose different file
              </button>
            </div>

            <div className="space-y-3 mb-5">
              <p className="text-sm text-white/70">
                Map your CSV columns to lead fields:
              </p>
              {TARGET_FIELDS.map((field) => (
                <div key={field} className="grid grid-cols-3 gap-3 items-center">
                  <label className="text-sm text-white/80">
                    {field}
                    {field === "phone" && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  <select
                    value={mapping[field]}
                    onChange={(e) =>
                      setMapping((m) => ({ ...m, [field]: e.target.value }))
                    }
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

            <div className="mb-5">
              <label className="block text-sm text-white/70 mb-1.5">Campaign</label>
              <select
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-[#00B98E]"
              >
                <option value="" className="bg-black">No campaign</option>
                {campaigns.map((c) => (
                  <option key={c.id} value={c.id} className="bg-black">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {mappedPreview.length > 0 && (
              <div className="mb-5">
                <p className="text-sm text-white/70 mb-2">Preview (first 5 rows)</p>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-xs">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="text-left px-3 py-2 text-white/60 font-medium">Name</th>
                        <th className="text-left px-3 py-2 text-white/60 font-medium">Phone</th>
                        <th className="text-left px-3 py-2 text-white/60 font-medium">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mappedPreview.map((r, i) => (
                        <tr key={i} className="border-t border-white/5">
                          <td className="px-3 py-2 text-white/80">{r.name || "—"}</td>
                          <td className="px-3 py-2 text-white/80 font-mono">
                            {r.phone ? (
                              <span
                                className={
                                  isValidIndianPhone(r.phone)
                                    ? "text-white"
                                    : "text-red-400"
                                }
                              >
                                {r.phone}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td className="px-3 py-2 text-white/80 max-w-xs truncate">
                            {r.notes || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

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
                {importing ? "Importing…" : `Import ${stats.valid} leads`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
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
    name: find("name", "full_name", "fullname", "lead_name", "customer"),
    phone: find("phone", "phone_number", "mobile", "number", "contact"),
    notes: find("notes", "note", "comment", "comments", "remarks"),
  };
}
