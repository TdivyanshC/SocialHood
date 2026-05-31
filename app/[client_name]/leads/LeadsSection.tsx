"use client";

import { useCallback, useEffect, useState } from "react";
import { type Campaign, fetchCampaigns } from "@/lib/supabase/campaigns";
import type { OutboundLead } from "@/lib/supabase/leads";
import { AddLeadModal } from "./AddLeadModal";
import { CampaignBar } from "./CampaignBar";
import { CsvUpload } from "./CsvUpload";
import { LeadDetailPanel } from "./LeadDetailPanel";
import { LeadsStatsBar } from "./LeadsStatsBar";
import { LeadsTable } from "./LeadsTable";
import { ToastProvider, useToast } from "./Toast";

export function LeadsSection() {
  return (
    <ToastProvider>
      <LeadsSectionInner />
    </ToastProvider>
  );
}

function LeadsSectionInner() {
  const toast = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<OutboundLead | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showCsv, setShowCsv] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  const loadCampaigns = useCallback(async () => {
    setCampaignsLoading(true);
    try {
      const list = await fetchCampaigns();
      setCampaigns(list);
    } catch (err: any) {
      toast.push("error", err?.message || "Failed to load campaigns");
    } finally {
      setCampaignsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  const refreshLeads = useCallback(() => {
    setRefreshToken((t) => t + 1);
  }, []);

  return (
    <div className="space-y-6">
      {/* Action bar */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Outbound Leads</h2>
          <p className="text-sm text-white/60 mt-1">
            Manage the queue your AI agent will call.
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
            + Add lead
          </button>
        </div>
      </div>

      {campaignsLoading ? (
        <div className="h-24 rounded-3xl bg-white/5 border border-white/10 animate-pulse" />
      ) : (
        <CampaignBar
          campaigns={campaigns}
          selectedCampaignId={selectedCampaignId}
          onSelect={setSelectedCampaignId}
          onCampaignsChange={loadCampaigns}
        />
      )}

      <LeadsStatsBar />

      <LeadsTable
        campaigns={campaigns}
        selectedCampaignId={selectedCampaignId}
        onSelectLead={setSelectedLead}
        refreshToken={refreshToken}
      />

      <AddLeadModal
        isOpen={showAdd}
        campaigns={campaigns}
        defaultCampaignId={selectedCampaignId}
        onClose={() => setShowAdd(false)}
        onCreated={() => {
          setShowAdd(false);
          refreshLeads();
        }}
      />

      <CsvUpload
        isOpen={showCsv}
        campaigns={campaigns}
        defaultCampaignId={selectedCampaignId}
        onClose={() => setShowCsv(false)}
        onImported={() => {
          setShowCsv(false);
          refreshLeads();
        }}
      />

      <LeadDetailPanel
        lead={selectedLead}
        campaigns={campaigns}
        onClose={() => setSelectedLead(null)}
        onChanged={() => {
          refreshLeads();
        }}
      />
    </div>
  );
}
