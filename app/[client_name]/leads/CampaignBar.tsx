"use client";

import { useState } from "react";
import {
  type Campaign,
  type CampaignStatus,
  createCampaign,
  updateCampaignStatus,
} from "@/lib/supabase/campaigns";
import { campaignBadgeClasses } from "./helpers";
import { useToast } from "./Toast";

interface CampaignBarProps {
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  onSelect: (id: string | null) => void;
  onCampaignsChange: () => void;
}

export function CampaignBar({
  campaigns,
  selectedCampaignId,
  onSelect,
  onCampaignsChange,
}: CampaignBarProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Campaigns</h2>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-full bg-[#00B98E] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#00d494]"
        >
          + New campaign
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelect(null)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            selectedCampaignId === null
              ? "bg-[#00B98E] text-black"
              : "border border-white/10 bg-white/5 text-white hover:border-[#00B98E]"
          }`}
        >
          All leads
        </button>

        {campaigns.length === 0 ? (
          <p className="text-sm text-white/60 self-center">
            No campaigns yet. Create one to group your leads.
          </p>
        ) : (
          campaigns.map((c) => (
            <CampaignPill
              key={c.id}
              campaign={c}
              selected={selectedCampaignId === c.id}
              onSelect={() => onSelect(c.id)}
              onStatusChange={onCampaignsChange}
            />
          ))
        )}
      </div>

      <NewCampaignModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={() => {
          setShowModal(false);
          onCampaignsChange();
        }}
      />
    </div>
  );
}

function CampaignPill({
  campaign,
  selected,
  onSelect,
  onStatusChange,
}: {
  campaign: Campaign;
  selected: boolean;
  onSelect: () => void;
  onStatusChange: () => void;
}) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const togglePause = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const next: CampaignStatus = campaign.status === "active" ? "paused" : "active";
    try {
      await updateCampaignStatus(campaign.id, next);
      toast.push("success", `Campaign ${next === "active" ? "resumed" : "paused"}`);
      onStatusChange();
    } catch (err: any) {
      toast.push("error", err?.message || "Failed to update campaign");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-full pl-3 pr-1 py-1 text-sm transition cursor-pointer ${
        selected
          ? "bg-[#00B98E] text-black"
          : "border border-white/10 bg-white/5 text-white hover:border-[#00B98E]"
      }`}
      onClick={onSelect}
    >
      <span className="font-medium">{campaign.name}</span>
      <span
        className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
          selected ? "bg-black/20 text-black" : campaignBadgeClasses(campaign.status)
        }`}
      >
        {campaign.status}
      </span>
      {campaign.status !== "done" && (
        <button
          onClick={togglePause}
          disabled={busy}
          className={`rounded-full w-6 h-6 flex items-center justify-center text-xs transition disabled:opacity-50 ${
            selected
              ? "bg-black/20 text-black hover:bg-black/30"
              : "bg-white/5 text-white/80 hover:bg-white/10"
          }`}
          title={campaign.status === "active" ? "Pause" : "Resume"}
        >
          {campaign.status === "active" ? "⏸" : "▶"}
        </button>
      )}
    </div>
  );
}

function NewCampaignModal({
  isOpen,
  onClose,
  onCreated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const toast = useToast();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      await createCampaign(trimmed);
      toast.push("success", `Campaign "${trimmed}" created`);
      setName("");
      onCreated();
    } catch (err: any) {
      toast.push("error", err?.message || "Failed to create campaign");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-black p-6 shadow-2xl shadow-black/40"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-[#00B98E]">New campaign</p>
            <h3 className="text-xl font-semibold text-white mt-1">Create campaign</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white text-xl w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <label className="block text-sm text-white/70 mb-2">Campaign name</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Diwali Push 2026"
          className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white placeholder-white/40 outline-none focus:border-[#00B98E]"
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm font-medium border border-white/10 text-white hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || saving}
            className="px-4 py-2 rounded-full text-sm font-semibold bg-[#00B98E] text-black hover:bg-[#00d494] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
