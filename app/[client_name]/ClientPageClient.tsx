"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { CallsDataDashboard } from "./CallsDataDashboard";
import { LeadsSection } from "./leads/LeadsSection";

interface ClientProfile {
  client_name: string;
  display_name: string;
  custom_message: string | null;
}

export default function ClientPageClient({ clientName }: { clientName: string }) {
  const [status, setStatus] = useState<"loading" | "authorized" | "denied" | "missing">("loading");
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"calls" | "leads" | "whatsapp">("calls");

  useEffect(() => {
    const checkAuth = async () => {
      const stored = typeof window !== "undefined" ? localStorage.getItem("socialhood_client_auth") : null;
      const parsed = stored ? JSON.parse(stored) : null;

      if (!parsed || parsed.clientName !== clientName) {
        setStatus("denied");
        return;
      }

      const supabase = getSupabaseClient();
      if (!supabase) {
        setStatus("missing");
        return;
      }

      const { data, error } = await supabase
        .from("client_credentials")
        .select("client_name, display_name, custom_message")
        .eq("client_name", clientName)
        .maybeSingle();

      if (error || !data) {
        setStatus("missing");
        return;
      }

      setProfile(data as ClientProfile);
      setStatus("authorized");
    };

    checkAuth();
  }, [clientName]);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <p className="text-center text-lg text-white/80">Loading your client page…</p>
        </div>
      </main>
    );
  }

  if (status === "denied") {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
        <div className="max-w-xl w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <h1 className="text-3xl font-semibold text-white">Access Denied</h1>
          <p className="mt-4 text-white/70">
            You must log in with the assigned client credentials to access this page.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-[#00B98E] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#00d494]"
            >
              Go to Login
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-[#00B98E] hover:text-[#00B98E]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (status === "missing" || !profile) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">
        <div className="max-w-xl w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <h1 className="text-3xl font-semibold text-white">Client Not Found</h1>
          <p className="mt-4 text-white/70">
            The client profile for <span className="font-semibold">{clientName}</span> was not found in Supabase.
          </p>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-[#00B98E] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#00d494]"
            >
              Try a different login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 py-6">
      <div className="mx-auto max-w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-[#00B98E]">Client Portal</p>
              <h1 className="mt-3 text-4xl font-semibold text-white">
                {profile.display_name || profile.client_name}
              </h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">Status</p>
              <p className="mt-2 text-lg font-semibold text-[#00B98E]">● Live</p>
            </div>
          </div>

          {/* Tab Toggle */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab("calls")}
              className={`px-6 py-3 rounded-full font-medium transition ${
                activeTab === "calls"
                  ? "bg-[#00B98E] text-black"
                  : "border border-white/10 bg-white/5 text-white hover:border-[#00B98E]"
              }`}
            >
              📞 Calls
            </button>
            <button
              onClick={() => setActiveTab("leads")}
              className={`px-6 py-3 rounded-full font-medium transition ${
                activeTab === "leads"
                  ? "bg-[#00B98E] text-black"
                  : "border border-white/10 bg-white/5 text-white hover:border-[#00B98E]"
              }`}
            >
              👥 Leads
            </button>
            <button
              onClick={() => setActiveTab("whatsapp")}
              className={`px-6 py-3 rounded-full font-medium transition ${
                activeTab === "whatsapp"
                  ? "bg-[#00B98E] text-black"
                  : "border border-white/10 bg-white/5 text-white hover:border-[#00B98E]"
              }`}
            >
              💬 WhatsApp
            </button>
          </div>
        </div>

        {/* Calls Section */}
        {activeTab === "calls" && <CallsDataDashboard />}

        {/* Leads Section */}
        {activeTab === "leads" && <LeadsSection />}

        {/* WhatsApp Section */}
        {activeTab === "whatsapp" && <WhatsAppDashboard profile={profile} />}
      </div>
    </main>
  );
}

function WhatsAppDashboard({ profile }: { profile: ClientProfile }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <MetricCard label="Total Messages" value="1,247" change="+42% vs last week" color="green" />
        <MetricCard label="Open Rate" value="94%" change="-3% from yesterday" color="yellow" />
        <MetricCard label="Response Time" value="1.4s" change="+0.2s from yesterday" color="cyan" />
        <MetricCard label="Sent" value="523" change="+12% this week" color="blue" />
        <MetricCard label="Delivered" value="512" change="+10% this week" color="purple" />
        <MetricCard label="Conversion" value="31%" change="+5% vs last month" color="green" />
      </div>

      {/* WhatsApp Pipeline */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Message Pipeline</h2>
        <div className="flex h-16 gap-1 overflow-hidden rounded-lg bg-white/5">
          <div className="flex-1 bg-blue-500/70 flex items-center justify-center text-xs font-semibold">
            <div className="text-center">
              <p className="text-white">523 Sent</p>
              <p className="text-white/70 text-[10px]">42%</p>
            </div>
          </div>
          <div className="flex-1 bg-purple-500/70 flex items-center justify-center text-xs font-semibold">
            <div className="text-center">
              <p className="text-white">512 Delivered</p>
              <p className="text-white/70 text-[10px]">41%</p>
            </div>
          </div>
          <div className="flex-1 bg-[#00B98E]/70 flex items-center justify-center text-xs font-semibold">
            <div className="text-center">
              <p className="text-white">389 Read</p>
              <p className="text-white/70 text-[10px]">31%</p>
            </div>
          </div>
          <div className="flex-1 bg-green-500/70 flex items-center justify-center text-xs font-semibold">
            <div className="text-center">
              <p className="text-white">163 Replied</p>
              <p className="text-white/70 text-[10px]">13%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Conversations</h2>
        <div className="space-y-4">
          {MOCK_WHATSAPP.map((conv, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 rounded-2xl border border-white/10 hover:border-[#00B98E]/50 transition cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00B98E] to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                {conv.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{conv.name}</h3>
                  <span className="text-xs text-white/50">{conv.time}</span>
                </div>
                <p className="text-sm text-white/70 line-clamp-2">{conv.message}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(conv.status)}`}>
                    {conv.status}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getScoreColor(conv.score)}`}>
                    {conv.score}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Response Time Analysis */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">AI vs Human Speed</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center p-6 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-sm text-white/70 mb-2">AI First Response</p>
            <p className="text-3xl font-bold text-[#00B98E]">1m 12s</p>
            <p className="text-xs text-white/50 mt-2">Average</p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-sm text-white/70 mb-2">Human Response</p>
            <p className="text-3xl font-bold text-yellow-500">42 hours</p>
            <p className="text-xs text-white/50 mt-2">Industry Average</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  color,
  warning,
}: {
  label: string;
  value: string;
  change: string;
  color: string;
  warning?: boolean;
}) {
  const colorMap: Record<string, string> = {
    blue: "border-blue-500/30 bg-blue-500/10",
    red: "border-red-500/30 bg-red-500/10",
    yellow: "border-yellow-500/30 bg-yellow-500/10",
    green: "border-green-500/30 bg-green-500/10",
    cyan: "border-cyan-500/30 bg-cyan-500/10",
    purple: "border-purple-500/30 bg-purple-500/10",
  };

  const valueColorMap: Record<string, string> = {
    blue: "text-blue-400",
    red: "text-red-400",
    yellow: "text-yellow-400",
    green: "text-green-400",
    cyan: "text-cyan-400",
    purple: "text-purple-400",
  };

  return (
    <div className={`rounded-2xl border p-4 ${colorMap[color]}`}>
      <p className="text-sm text-white/70 font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-2 ${valueColorMap[color]}`}>{value}</p>
      <p className={`text-xs mt-2 ${warning ? "text-red-400" : "text-white/50"}`}>{change}</p>
    </div>
  );
}

const MOCK_WHATSAPP = [
  {
    name: "Arjun Mehra",
    phone: "+91 98100 00001",
    message: "Hi, I saw your property in Gurgaon. Still available? When can I visit?",
    status: "Replied",
    score: "Hot - 92",
    time: "2 mins ago",
  },
  {
    name: "Priya Sharma",
    phone: "+91 99200 00002",
    message: "Yes! Found 3 properties matching your budget. When are you free for a tour?",
    status: "Delivered",
    score: "Warm - 88",
    time: "5 mins ago",
  },
  {
    name: "Rohit Kapoor",
    phone: "+91 97300 00003",
    message: "Thanks for the details. I'll check with my family and get back to you.",
    status: "Read",
    score: "Warm - 71",
    time: "15 mins ago",
  },
];

function getStatusColor(status: string): string {
  if (status === "Converted") return "bg-green-500/20 text-green-300 border border-green-500/30";
  if (status === "Attended") return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
  if (status === "Unanswered") return "bg-red-500/20 text-red-300 border border-red-500/30";
  if (status === "Replied") return "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30";
  if (status === "Scheduled") return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
  if (status === "Read") return "bg-purple-500/20 text-purple-300 border border-purple-500/30";
  if (status === "Delivered") return "bg-[#00B98E]/20 text-[#00B98E] border border-[#00B98E]/30";
  return "bg-white/10 text-white/70 border border-white/20";
}

function getScoreColor(score: string): string {
  if (score.includes("Hot")) return "bg-red-500/20 text-red-300 border border-red-500/30";
  if (score.includes("Warm")) return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
  if (score.includes("Cold")) return "bg-blue-500/20 text-blue-300 border border-blue-500/30";
  return "bg-white/10 text-white/70 border border-white/20";
}
