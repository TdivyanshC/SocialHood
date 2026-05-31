"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  type SupportTicket,
  fetchSupportTickets,
} from "@/lib/supabase/supportTickets";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { ToastProvider } from "../leads/Toast";
import { TicketCard } from "./TicketCard";
import { TicketDetailModal } from "./TicketDetailModal";

type StatusFilter = "all" | "open" | "closed";

export function SupportTicketsSection() {
  return (
    <ToastProvider>
      <SupportTicketsSectionInner />
    </ToastProvider>
  );
}

function SupportTicketsSectionInner() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SupportTicket | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchSupportTickets();
      setTickets(list);
      setSelected((curr) => (curr ? list.find((t) => t.id === curr.id) || null : null));
    } catch (err: any) {
      setError(err?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Realtime subscription
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const channel = supabase
      .channel("support_tickets_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_tickets" },
        () => {
          load();
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const filtered = useMemo(() => {
    let rows = tickets;
    if (statusFilter !== "all") {
      rows = rows.filter((t) => t.status === statusFilter);
    }
    const term = search.trim().toLowerCase();
    if (term) {
      rows = rows.filter((t) =>
        [
          t.ticket_number,
          t.customer_name,
          t.phone,
          t.order_id,
          t.description,
          t.issue_type,
        ]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(term)),
      );
    }
    return rows;
  }, [tickets, statusFilter, search]);

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === "open").length,
      closed: tickets.filter((t) => t.status === "closed").length,
    };
  }, [tickets]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Support Tickets</h2>
        <p className="text-sm text-white/60 mt-1">
          Customer complaints captured by the AI agent.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total" value={stats.total} tone="white" />
        <StatCard label="Open" value={stats.open} tone="amber" />
        <StatCard label="Closed" value={stats.closed} tone="green" />
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex gap-2">
          {(["all", "open", "closed"] as StatusFilter[]).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                statusFilter === s
                  ? "bg-[#00B98E] text-black"
                  : "border border-white/10 bg-white/5 text-white hover:border-[#00B98E]"
              }`}
            >
              {s}
              {s !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  {s === "open" ? stats.open : stats.closed}
                </span>
              )}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search ticket, customer, phone, order…"
          className="w-full md:w-80 rounded-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-[#00B98E]"
        />
      </div>

      {/* Grid */}
      {loading && tickets.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden animate-pulse"
            >
              <div className="aspect-[16/10] bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="h-3 w-24 bg-white/10 rounded" />
                <div className="h-5 w-40 bg-white/10 rounded" />
                <div className="h-3 w-full bg-white/10 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
          {error}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-white font-medium">No tickets to show</p>
          <p className="text-sm text-white/60 mt-1">
            {tickets.length === 0
              ? "Complaints from the AI agent will appear here."
              : "Try changing the filter or clearing the search."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              onClick={() => setSelected(ticket)}
            />
          ))}
        </div>
      )}

      <TicketDetailModal
        ticket={selected}
        onClose={() => setSelected(null)}
        onChanged={load}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "white" | "amber" | "green";
}) {
  const palette =
    tone === "amber"
      ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
      : tone === "green"
        ? "border-green-500/30 bg-green-500/10 text-green-300"
        : "border-white/10 bg-white/5 text-white";
  return (
    <div className={`rounded-2xl border p-4 ${palette}`}>
      <p className="text-xs uppercase tracking-wider opacity-80">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}
