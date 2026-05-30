"use client";

import { useEffect, useState } from "react";
import type { Campaign } from "@/lib/supabase/campaigns";
import { createLead, isValidIndianPhone } from "@/lib/supabase/leads";
import { useToast } from "./Toast";

interface AddLeadModalProps {
  isOpen: boolean;
  campaigns: Campaign[];
  defaultCampaignId: string | null;
  onClose: () => void;
  onCreated: () => void;
}

export function AddLeadModal({
  isOpen,
  campaigns,
  defaultCampaignId,
  onClose,
  onCreated,
}: AddLeadModalProps) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [campaignId, setCampaignId] = useState<string>(defaultCampaignId || "");
  const [saving, setSaving] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setPhone("");
      setNotes("");
      setCampaignId(defaultCampaignId || "");
      setPhoneError(null);
    }
  }, [isOpen, defaultCampaignId]);

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
      await createLead({
        name: name || null,
        phone,
        notes: notes || null,
        campaign_id: campaignId || null,
        source: "manual",
      });
      toast.push("success", "Lead added");
      onCreated();
    } catch (err: any) {
      const msg: string = err?.message || "Failed to add lead";
      if (msg.toLowerCase().includes("duplicate") || err?.code === "23505") {
        setPhoneError("This phone number already exists for this tenant");
      } else {
        toast.push("error", msg);
      }
    } finally {
      setSaving(false);
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
      <form
        onSubmit={submit}
        className="w-full max-w-md h-full overflow-y-auto bg-black border-l border-white/10 p-6 shadow-2xl shadow-black/40 flex flex-col"
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#00B98E]">Manual entry</p>
            <h3 className="text-2xl font-semibold text-white mt-1">Add lead</h3>
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
            <label className="block text-sm text-white/70 mb-1.5">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder-white/40 outline-none focus:border-[#00B98E]"
            />
          </div>

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

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Campaign</label>
            <select
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white outline-none focus:border-[#00B98E]"
            >
              <option value="" className="bg-black">No campaign</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id} className="bg-black">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1.5">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Any context the agent should know"
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
            {saving ? "Saving…" : "Add lead"}
          </button>
        </div>
      </form>
    </div>
  );
}
