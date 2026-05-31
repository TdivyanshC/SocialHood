"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import type { LeadStatus } from "@/lib/supabase/leads";

interface StatCard {
  key: LeadStatus;
  label: string;
  icon: string;
  description: string;
  tone: "gray" | "blue" | "green" | "amber" | "orange" | "red";
}

const CARDS: StatCard[] = [
  {
    key: "pending",
    label: "Scheduled",
    icon: "📅",
    description: "Queued and waiting to be called",
    tone: "gray",
  },
  {
    key: "in_progress",
    label: "In Progress",
    icon: "📞",
    description: "Currently being called by the agent",
    tone: "blue",
  },
  {
    key: "answered",
    label: "Answered",
    icon: "✅",
    description: "All 3 slots collected",
    tone: "green",
  },
  {
    key: "mid_answered",
    label: "Mid-Answered",
    icon: "⏳",
    description: "Picked up, incomplete info, will retry in 1 day",
    tone: "amber",
  },
  {
    key: "unanswered",
    label: "Unanswered",
    icon: "🔁",
    description: "Rang but not picked up, retrying with gap",
    tone: "orange",
  },
  {
    key: "dnc",
    label: "DNC",
    icon: "⛔",
    description: "Do not call",
    tone: "red",
  },
];

const TONE_CARD: Record<StatCard["tone"], string> = {
  gray: "border-white/15 bg-white/5",
  blue: "border-blue-500/30 bg-blue-500/10",
  green: "border-green-500/30 bg-green-500/10",
  amber: "border-amber-500/30 bg-amber-500/10",
  orange: "border-orange-500/30 bg-orange-500/10",
  red: "border-red-500/30 bg-red-500/10",
};

const TONE_COUNT: Record<StatCard["tone"], string> = {
  gray: "text-white",
  blue: "text-blue-300",
  green: "text-green-300",
  amber: "text-amber-300",
  orange: "text-orange-300",
  red: "text-red-300",
};

export function LeadsStatsBar() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from("outbound_leads")
      .select("status")
      .eq("tenant_id", "krishna_furniture");
    if (error) {
      setLoading(false);
      return;
    }
    const next: Record<string, number> = {};
    for (const row of data || []) {
      const s = (row as { status: string }).status;
      next[s] = (next[s] || 0) + 1;
    }
    setCounts(next);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    const channel = supabase
      .channel("outbound_leads_stats")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "outbound_leads",
          filter: "tenant_id=eq.krishna_furniture",
        },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {CARDS.map((card) => {
        const count = counts[card.key] ?? 0;
        return (
          <div
            key={card.key}
            className={`rounded-2xl border p-4 flex flex-col gap-1.5 transition ${TONE_CARD[card.tone]}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-lg" aria-hidden>
                {card.icon}
              </span>
              <span
                className={`text-2xl font-bold ${TONE_COUNT[card.tone]} ${
                  loading ? "opacity-40" : ""
                }`}
              >
                {loading ? "—" : count}
              </span>
            </div>
            <p className="text-sm font-semibold text-white">{card.label}</p>
            <p className="text-[11px] leading-snug text-white/60">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
