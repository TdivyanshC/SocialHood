"use client";

import { useEffect, useState } from "react";
import { createWalkin, type WalkinSource } from "@/lib/supabase/walkins";
import { isValidIndianPhone } from "@/lib/supabase/leads";
import { useToast } from "../leads/Toast";

interface AddWalkinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

export function AddWalkinModal({ isOpen, onClose, onCreated }: AddWalkinModalProps) {
  const toast = useToast();
  const [phone, setPhone] = useState("");
  const [visitDate, setVisitDate] = useState(todayIso());
  const [source, setSource] = useState<WalkinSource>("offline");
  const [visitNumber, setVisitNumber] = useState("1");
  const [budgetManual, setBudgetManual] = useState("");
  const [followupCallsMade, setFollowupCallsMade] = useState("0");
  const [converted, setConverted] = useState(false);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPhone("");
      setVisitDate(todayIso());
      setSource("offline");
      setVisitNumber("1");
      setBudgetManual("");
      setFollowupCallsMade("0");
      setConverted(false);
      setNotes("");
      setPhoneError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    if (!phone.trim()) {
      setPhoneError("Phone is required");
      return;
    }
    if (!isValidIndianPhone(phone)) {
      setPhoneError("Enter a valid Indian phone (+91 followed by 10 digits, or 10 digits)");
      return;
    }

    setSaving(true);
    try {
      await createWalkin({
        phone,
        visit_date: visitDate,
        source,
        visit_number: parseInt(visitNumber, 10) || 1,
        budget_manual: budgetManual ? Number(budgetManual) : null,
        followup_calls_made: parseInt(followupCallsMade, 10) || 0,
        converted,
        converted_date: converted ? todayIso() : null,
        notes: notes || null,
      });
      toast.push("success", "Walk-in added");
      onCreated();
    } catch (err: any) {
      toast.push("error", err?.message || "Failed to add walk-in");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <button type="button" aria-label="Close" onClick={onClose} className="flex-1 cursor-default" />
      <form
        onSubmit={submit}
        className="w-full max-w-md h-full overflow-y-auto bg-black border-l border-white/10 p-6 shadow-2xl shadow-black/40 flex flex-col"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#00B98E]">Manual entry</p>
            <h3 className="text-2xl font-semibold text-white mt-1">Add walk-in</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white text-xl w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 flex-1">
          <div>
            <label className="block text-sm text-white/70 mb-1.5">
              Phone <span className="text-red-400">*</span>
            </label>
            <input
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (phoneError) setPhoneError(null);
              }}
              placeholder="+91 98xxxxxxxx or 10 digits"
              className={`w-full rounded-xl bg-white/5 border px-4 py-2.5 text-white placeholder-white/40 outline-none focus:border-[#00B98E] ${
                phoneError ? "border-red-500/50" : "border-white/10"
              }`}
            />
            {phoneError && <p className="mt-1.5 text-xs text-red-400">{phoneError}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-white/70 mb-1.5">
                Visit date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white outline-none focus:border-[#00B98E]"
              />
            </div>
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Visit #</label>
              <input
                type="number"
                min={1}
                value={visitNumber}
                onChange={(e) => setVisitNumber(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white outline-none focus:border-[#00B98E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as WalkinSource)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white outline-none focus:border-[#00B98E]"
            >
              <option value="offline" className="bg-black">Offline (manually logged)</option>
              <option value="system" className="bg-black">System-matched</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Budget (manual)</label>
            <input
              type="number"
              min={0}
              value={budgetManual}
              onChange={(e) => setBudgetManual(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder-white/40 outline-none focus:border-[#00B98E]"
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Follow-up calls made</label>
            <input
              type="number"
              min={0}
              max={3}
              value={followupCallsMade}
              onChange={(e) => setFollowupCallsMade(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white outline-none focus:border-[#00B98E]"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer">
            <input
              type="checkbox"
              checked={converted}
              onChange={(e) => setConverted(e.target.checked)}
              className="w-4 h-4 rounded accent-[#00B98E]"
            />
            Converted to sale
          </label>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any context worth keeping"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder-white/40 outline-none focus:border-[#00B98E] resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm font-medium border border-white/10 text-white hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-full text-sm font-semibold bg-[#00B98E] text-black hover:bg-[#00d494] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Add walk-in"}
          </button>
        </div>
      </form>
    </div>
  );
}
