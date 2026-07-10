"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { CallsDataDashboard } from "./CallsDataDashboard";
import { LeadsSection } from "./leads/LeadsSection";
import { SupportTicketsSection } from "./support/SupportTicketsSection";
import { WhatsAppDashboard } from "./whatsapp/WhatsAppDashboard";

interface ClientProfile {
  client_name: string;
  display_name: string;
  custom_message: string | null;
}

export default function ClientPageClient({ clientName }: { clientName: string }) {
  const [status, setStatus] = useState<"loading" | "authorized" | "denied" | "missing">("loading");
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [activeTab, setActiveTab] = useState<"calls" | "leads" | "support" | "whatsapp">("calls");

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
    <main className="crm-dashboard min-h-screen bg-black text-white px-4 py-6">
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
              onClick={() => setActiveTab("support")}
              className={`px-6 py-3 rounded-full font-medium transition ${
                activeTab === "support"
                  ? "bg-[#00B98E] text-black"
                  : "border border-white/10 bg-white/5 text-white hover:border-[#00B98E]"
              }`}
            >
              🎫 Support
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

        {/* Support Tickets Section */}
        {activeTab === "support" && <SupportTicketsSection />}

        {/* WhatsApp Section */}
        {activeTab === "whatsapp" && <WhatsAppDashboard />}
      </div>
    </main>
  );
}

