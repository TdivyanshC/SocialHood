"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Campaign } from "@/lib/supabase/campaigns";
import {
  type FetchLeadsParams,
  type LeadStatus,
  type OutboundLead,
  fetchLeads,
} from "@/lib/supabase/leads";
import { getSupabaseClient } from "@/lib/supabaseClient";
import {
  MAX_RETRIES,
  STATUS_LABELS,
  STATUS_OPTIONS,
  formatIST,
  formatNextCall,
  statusBadgeClasses,
} from "./helpers";

interface LeadsTableProps {
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  onSelectLead: (lead: OutboundLead) => void;
  refreshToken: number;
}

type SortKey = "status" | "created_at" | "next_call_at";

const PAGE_SIZE = 25;

export function LeadsTable({
  campaigns,
  selectedCampaignId,
  onSelectLead,
  refreshToken,
}: LeadsTableProps) {
  const [rows, setRows] = useState<OutboundLead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<LeadStatus[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedSearch(search), 300);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, selectedCampaignId, debouncedSearch, sortBy, sortDir]);

  const params: FetchLeadsParams = useMemo(
    () => ({
      statuses: statusFilter.length ? statusFilter : undefined,
      campaignId: selectedCampaignId,
      search: debouncedSearch,
      sortBy,
      sortDir,
      page,
      pageSize: PAGE_SIZE,
    }),
    [statusFilter, selectedCampaignId, debouncedSearch, sortBy, sortDir, page],
  );

  const reloadRef = useRef(0);
  const load = useCallback(async () => {
    const myToken = ++reloadRef.current;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchLeads(params);
      if (reloadRef.current === myToken) {
        setRows(result.rows);
        setTotal(result.total);
      }
    } catch (err: any) {
      if (reloadRef.current === myToken) {
        setError(err?.message || "Failed to load leads");
        setRows([]);
        setTotal(0);
      }
    } finally {
      if (reloadRef.current === myToken) setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    load();
  }, [load, refreshToken]);

  // Realtime subscription
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const channel = supabase
      .channel("outbound_leads_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "outbound_leads",
          filter: "tenant_id=eq.krishna_furniture",
        },
        () => {
          load();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const toggleStatus = (s: LeadStatus) => {
    setStatusFilter((curr) =>
      curr.includes(s) ? curr.filter((x) => x !== s) : [...curr, s],
    );
  };

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("desc");
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      {/* Filters bar */}
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <h2 className="text-xl font-semibold text-white">Leads</h2>
          <div className="flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or phone…"
              className="w-full md:w-64 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-[#00B98E]"
            />
            <span className="text-xs text-white/50 whitespace-nowrap">
              {total} {total === 1 ? "lead" : "leads"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => {
            const active = statusFilter.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleStatus(s)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  active ? statusBadgeClasses(s) : "border border-white/10 bg-white/5 text-white/70 hover:border-white/30"
                }`}
              >
                {STATUS_LABELS[s]}
              </button>
            );
          })}
          {statusFilter.length > 0 && (
            <button
              onClick={() => setStatusFilter([])}
              className="rounded-full px-3 py-1 text-xs text-white/60 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {loading && rows.length === 0 ? (
        <LoadingSkeleton />
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
          {error}
        </div>
      ) : rows.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-white font-medium">No leads yet</p>
          <p className="text-sm text-white/60 mt-1">
            Add one manually or upload a CSV above to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <Th>Name</Th>
                <Th>Phone</Th>
                <Th sortable onClick={() => toggleSort("status")} active={sortBy === "status"} dir={sortDir}>
                  Status
                </Th>
                <Th>Retry</Th>
                <Th sortable onClick={() => toggleSort("next_call_at")} active={sortBy === "next_call_at"} dir={sortDir}>
                  Next call
                </Th>
                <Th>Last called</Th>
                <Th>Source</Th>
                <Th>Campaign</Th>
                <Th sortable onClick={() => toggleSort("created_at")} active={sortBy === "created_at"} dir={sortDir}>
                  Created
                </Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((lead) => (
                <Row
                  key={lead.id}
                  lead={lead}
                  campaignName={campaigns.find((c) => c.id === lead.campaign_id)?.name}
                  onClick={() => onSelectLead(lead)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {rows.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-white/60">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-white/80 hover:bg-white/5 disabled:opacity-30"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-full text-xs border border-white/10 text-white/80 hover:bg-white/5 disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Th({
  children,
  sortable,
  active,
  dir,
  onClick,
}: {
  children: React.ReactNode;
  sortable?: boolean;
  active?: boolean;
  dir?: "asc" | "desc";
  onClick?: () => void;
}) {
  if (sortable) {
    return (
      <th
        onClick={onClick}
        className={`text-left py-3 px-4 font-medium text-xs uppercase tracking-wider cursor-pointer select-none ${
          active ? "text-[#00B98E]" : "text-white/60 hover:text-white"
        }`}
      >
        {children}
        {active && <span className="ml-1">{dir === "asc" ? "↑" : "↓"}</span>}
      </th>
    );
  }
  return (
    <th className="text-left py-3 px-4 font-medium text-xs uppercase tracking-wider text-white/60">
      {children}
    </th>
  );
}

function Row({
  lead,
  campaignName,
  onClick,
}: {
  lead: OutboundLead;
  campaignName: string | undefined;
  onClick: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer"
    >
      <td className="py-3 px-4 text-white font-medium">{lead.name || "—"}</td>
      <td className="py-3 px-4 text-white/70 font-mono text-xs">{lead.phone}</td>
      <td className="py-3 px-4">
        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClasses(lead.status)}`}>
          {STATUS_LABELS[lead.status] || lead.status}
        </span>
      </td>
      <td className="py-3 px-4 text-white/70">{lead.retry_count}/{MAX_RETRIES}</td>
      <td className="py-3 px-4 text-white/70 text-xs">{formatNextCall(lead.next_call_at)}</td>
      <td className="py-3 px-4 text-white/70 text-xs">{formatIST(lead.last_called_at)}</td>
      <td className="py-3 px-4 text-white/70 capitalize text-xs">{lead.source}</td>
      <td className="py-3 px-4 text-white/70 text-xs">{campaignName || "—"}</td>
      <td className="py-3 px-4 text-white/70 text-xs">{formatIST(lead.created_at)}</td>
    </tr>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-12 rounded-xl bg-white/5 border border-white/10 animate-pulse"
        />
      ))}
    </div>
  );
}
