"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";

interface CallRecord {
  id: string;
  call_uuid: string;
  lead_id: string;
  phone_number: string;
  lead_name: string;
  lead_score: number;
  lead_tier: "hot" | "warm" | "cold";
  duration_seconds: number;
  started_at: string;
  status: string;
  product_interest: string;
  budget_mentioned: string;
  urgency_mentioned: string;
  full_transcript: string;
  summary_text: string;
}

interface TranscriptModalProps {
  isOpen: boolean;
  callData: CallRecord | null;
  onClose: () => void;
}

export function CallsDataDashboard() {
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCallForTranscript, setSelectedCallForTranscript] = useState<CallRecord | null>(null);
  const [sortBy, setSortBy] = useState<"score" | "recent">("score");

  useEffect(() => {
    const fetchCallsData = async () => {
      setLoading(true);
      const supabase = getSupabaseClient();
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        // Fetch from call_summaries with call_logs and leads joins
        const { data: callData, error } = await supabase
          .from("call_summaries")
          .select(
            `
            id,
            call_uuid,
            lead_id,
            lead_score,
            lead_tier,
            product_interest,
            budget_mentioned,
            urgency_mentioned,
            full_transcript,
            summary_text,
            tenant_id,
            created_at,
            call_logs(
              call_uuid,
              from_number,
              to_number,
              direction,
              status,
              duration_seconds,
              started_at
            ),
            leads(
              id,
              phone,
              name,
              budget,
              timeline,
              furniture_interest
            )
          `
          )
          .eq("tenant_id", "krishna_furniture")
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) {
          console.error("Error fetching calls:", error);
          console.error("Supabase error details:", error);
          setLoading(false);
          return;
        }

        if (callData && Array.isArray(callData)) {
          const formattedCalls: CallRecord[] = callData
            .map((summary: any) => {
              const callLog = Array.isArray(summary.call_logs)
                ? summary.call_logs[0]
                : summary.call_logs;
              const lead = Array.isArray(summary.leads) ? summary.leads[0] : summary.leads;

              return {
                id: summary.id,
                call_uuid: summary.call_uuid,
                lead_id: summary.lead_id,
                phone_number: lead?.phone || callLog?.to_number || "N/A",
                lead_name: lead?.name || "Unknown Lead",
                lead_score: summary.lead_score || 0,
                lead_tier: summary.lead_tier || "cold",
                duration_seconds: callLog?.duration_seconds || 0,
                started_at: callLog?.started_at || summary.created_at,
                status: callLog?.status || "unknown",
                product_interest: summary.product_interest || "-",
                budget_mentioned: summary.budget_mentioned || (lead?.budget ? `₹${lead.budget}` : "-"),
                urgency_mentioned: summary.urgency_mentioned || lead?.timeline || "-",
                full_transcript: summary.full_transcript || "No transcript available",
                summary_text: summary.summary_text || "No summary available",
              };
            })
            .filter((call: CallRecord) => call.lead_score > 0);

          console.log("Formatted calls:", formattedCalls);
          setCalls(formattedCalls);
        } else {
          console.log("No call data returned from Supabase");
        }
      } catch (err) {
        console.error("Error fetching calls data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCallsData();
  }, []);

  const sortedCalls = useMemo(() => {
    const sorted = [...calls];
    if (sortBy === "score") {
      sorted.sort((a, b) => b.lead_score - a.lead_score);
    } else if (sortBy === "recent") {
      sorted.sort(
        (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
      );
    }
    return sorted;
  }, [calls, sortBy]);

  const stats = useMemo(() => {
    return {
      total: calls.length,
      hot: calls.filter((c) => c.lead_tier === "hot").length,
      warm: calls.filter((c) => c.lead_tier === "warm").length,
      cold: calls.filter((c) => c.lead_tier === "cold").length,
      avgDuration: calls.length > 0
        ? Math.round(calls.reduce((sum, c) => sum + c.duration_seconds, 0) / calls.length / 60)
        : 0,
    };
  }, [calls]);

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-white/70">Loading calls data...</p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00B98E] animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-[#00B98E] animate-pulse delay-100" />
            <div className="w-2 h-2 rounded-full bg-[#00B98E] animate-pulse delay-200" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Calls" value={stats.total.toString()} color="blue" />
        <StatCard label="Hot Leads" value={stats.hot.toString()} color="red" />
        <StatCard label="Warm Leads" value={stats.warm.toString()} color="yellow" />
        <StatCard label="Cold Leads" value={stats.cold.toString()} color="cyan" />
        <StatCard label="Avg Duration" value={`${stats.avgDuration}m`} color="purple" />
      </div>

      {/* Sort Controls */}
      <div className="flex gap-3">
        <button
          onClick={() => setSortBy("score")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            sortBy === "score"
              ? "bg-[#00B98E] text-black"
              : "border border-white/10 bg-white/5 text-white hover:border-[#00B98E]"
          }`}
        >
          Sort by Lead Score ⬇
        </button>
        <button
          onClick={() => setSortBy("recent")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition ${
            sortBy === "recent"
              ? "bg-[#00B98E] text-black"
              : "border border-white/10 bg-white/5 text-white hover:border-[#00B98E]"
          }`}
        >
          Sort by Recent
        </button>
      </div>

      {/* Calls Table */}
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 overflow-hidden">
        <h2 className="text-xl font-semibold text-white mb-6">Call Records</h2>
        {sortedCalls.length === 0 ? (
          <div className="text-center py-8 text-white/70">
            No call data available yet. Calls will appear here once they are logged in Supabase.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Lead Name</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Phone</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Date & Time</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Duration</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Product Interest</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Budget</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Urgency</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Lead Score</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedCalls.map((call) => (
                  <CallRow
                    key={call.call_uuid}
                    call={call}
                    onViewTranscript={() => setSelectedCallForTranscript(call)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transcript Modal */}
      <TranscriptModal
        isOpen={!!selectedCallForTranscript}
        callData={selectedCallForTranscript}
        onClose={() => setSelectedCallForTranscript(null)}
      />
    </div>
  );
}

const CallRow = ({
  call,
  onViewTranscript,
}: {
  call: CallRecord;
  onViewTranscript: () => void;
}) => {
  const tierColor: Record<string, string> = {
    hot: "bg-red-500/20 text-red-300 border border-red-500/30",
    warm: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
    cold: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <tr className="border-b border-white/5 hover:bg-white/5 transition cursor-pointer">
      <td className="py-4 px-4 text-white font-medium">{call.lead_name}</td>
      <td className="py-4 px-4 text-white/70">{call.phone_number}</td>
      <td className="py-4 px-4 text-white/70 text-xs">{formatDate(call.started_at)}</td>
      <td className="py-4 px-4 text-white/70">{formatDuration(call.duration_seconds)}</td>
      <td className="py-4 px-4 text-white/70">{call.product_interest}</td>
      <td className="py-4 px-4 text-white/70">{call.budget_mentioned}</td>
      <td className="py-4 px-4 text-white/70">{call.urgency_mentioned}</td>
      <td className="py-4 px-4">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${tierColor[call.lead_tier]}`}>
          {call.lead_tier.toUpperCase()} • {call.lead_score}
        </span>
      </td>
      <td className="py-4 px-4">
        <button
          onClick={onViewTranscript}
          className="px-3 py-1 rounded-full text-xs font-medium bg-[#00B98E]/20 text-[#00B98E] border border-[#00B98E]/30 hover:bg-[#00B98E]/30 transition"
        >
          📄 View
        </button>
      </td>
    </tr>
  );
};

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
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
    </div>
  );
}

function TranscriptModal({ isOpen, callData, onClose }: TranscriptModalProps) {
  if (!isOpen || !callData) return null;

  if (typeof window !== "undefined") {
    console.log("[TranscriptModal] full_transcript:", callData.full_transcript);
    console.log("[TranscriptModal] full_transcript type:", typeof callData.full_transcript);
  }

  const extractArrayFromObject = (obj: any): any[] | null => {
    if (!obj || typeof obj !== "object") return null;
    if (Array.isArray(obj)) return obj;
    const keys = ["messages", "conversation", "chat", "transcript", "turns", "dialog", "dialogue", "history"];
    for (const k of keys) {
      if (Array.isArray(obj[k])) return obj[k];
    }
    return null;
  };

  const formatTranscript = (transcript: any): any[] => {
    if (transcript == null) return [];

    if (Array.isArray(transcript)) return transcript;

    if (typeof transcript === "string") {
      const trimmed = transcript.trim();
      if (!trimmed) return [];
      try {
        const parsed = JSON.parse(trimmed);
        const arr = extractArrayFromObject(parsed);
        if (arr) return arr;
        if (typeof parsed === "string") return [{ role: "system", content: parsed }];
        if (typeof parsed === "object" && parsed !== null) {
          if (typeof parsed.content === "string") return [{ role: "system", content: parsed.content }];
          if (typeof parsed.text === "string") return [{ role: "system", content: parsed.text }];
          return [{ role: "system", content: JSON.stringify(parsed, null, 2) }];
        }
        return [{ role: "system", content: String(parsed) }];
      } catch {
        return [{ role: "system", content: trimmed }];
      }
    }

    if (typeof transcript === "object") {
      const arr = extractArrayFromObject(transcript);
      if (arr) return arr;
      if (typeof transcript.content === "string") return [{ role: "system", content: transcript.content }];
      if (typeof transcript.text === "string") return [{ role: "system", content: transcript.text }];
      return [{ role: "system", content: JSON.stringify(transcript, null, 2) }];
    }

    return [{ role: "system", content: String(transcript) }];
  };

  const getMessageRole = (msg: any): string => {
    if (!msg || typeof msg !== "object") return "system";
    const raw = msg.role || msg.speaker || msg.from || msg.sender || msg.who || msg.type || "";
    return String(raw).toLowerCase();
  };

  const getMessageContent = (msg: any): string => {
    if (msg == null) return "";
    if (typeof msg === "string") return msg;
    if (typeof msg !== "object") return String(msg);
    const candidates = [
      msg.content,
      msg.text,
      msg.message,
      msg.transcript,
      msg.utterance,
      msg.value,
      msg.body,
      msg.response,
      msg.dialogue,
      msg.line,
    ];
    for (const c of candidates) {
      if (typeof c === "string" && c.trim()) return c;
      if (typeof c === "number") return String(c);
    }
    // Some shapes: { agent: "...", user: "..." } — one of these will be the text
    if (typeof msg.agent === "string" && msg.agent.trim()) return msg.agent;
    if (typeof msg.user === "string" && msg.user.trim()) return msg.user;
    if (typeof msg.caller === "string" && msg.caller.trim()) return msg.caller;
    return "";
  };

  const isCallerRole = (role: string): boolean => {
    return ["user", "caller", "customer", "client", "human", "lead"].includes(role);
  };

  const rawTranscript = callData.full_transcript;
  const hasTranscript =
    rawTranscript != null &&
    !(typeof rawTranscript === "string" && (rawTranscript.trim() === "" || rawTranscript === "No transcript available")) &&
    !(Array.isArray(rawTranscript) && rawTranscript.length === 0);

  const transcriptData = hasTranscript ? formatTranscript(rawTranscript) : [];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black border border-white/10 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="border-b border-white/10 p-6 flex items-start justify-between">
          <div>
            <p className="text-sm text-[#00B98E] font-medium">CALL TRANSCRIPT</p>
            <h2 className="text-2xl font-bold text-white mt-2">{callData.lead_name}</h2>
            <p className="text-sm text-white/70 mt-1">{callData.phone_number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition text-2xl w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Call Summary */}
        <div className="border-b border-white/10 p-6 bg-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider">Lead Score</p>
              <p className={`text-lg font-bold mt-1 ${
                callData.lead_tier === "hot" ? "text-red-400" :
                callData.lead_tier === "warm" ? "text-yellow-400" :
                "text-blue-400"
              }`}>
                {callData.lead_tier.toUpperCase()} • {callData.lead_score}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider">Duration</p>
              <p className="text-lg font-bold mt-1 text-cyan-400">
                {Math.floor(callData.duration_seconds / 60)}m {callData.duration_seconds % 60}s
              </p>
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider">Budget</p>
              <p className="text-lg font-bold mt-1 text-green-400">{callData.budget_mentioned}</p>
            </div>
            <div>
              <p className="text-xs text-white/70 uppercase tracking-wider">Urgency</p>
              <p className="text-lg font-bold mt-1 text-purple-400">{callData.urgency_mentioned}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-white/70 uppercase tracking-wider mb-2">Interest</p>
            <p className="text-white">{callData.product_interest}</p>
          </div>
        </div>

        {/* Transcript Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!hasTranscript ? (
            <div className="text-center py-8 text-white/70">
              <p>No transcript available for this call.</p>
            </div>
          ) : transcriptData.length === 0 ? (
            <div className="text-center py-8 text-white/70">
              <p>Transcript data is empty.</p>
            </div>
          ) : (
            transcriptData.map((msg: any, idx: number) => {
              const role = getMessageRole(msg);
              const content = getMessageContent(msg);
              const caller = isCallerRole(role);
              return (
                <div
                  key={idx}
                  className={`flex ${caller ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-2xl ${
                      caller
                        ? "bg-[#00B98E]/20 border border-[#00B98E]/30 text-white"
                        : "bg-white/10 border border-white/20 text-white/90"
                    }`}
                  >
                    <p className="text-xs font-semibold opacity-70 mb-1">
                      {caller ? "Caller" : role ? role.charAt(0).toUpperCase() + role.slice(1) : "Agent"}
                    </p>
                    {content ? (
                      <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
                    ) : (
                      <pre className="text-[10px] whitespace-pre-wrap break-all opacity-60 font-mono">
                        {JSON.stringify(msg, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Summary Footer */}
        {callData.summary_text && (
          <div className="border-t border-white/10 p-6 bg-white/5">
            <p className="text-xs text-white/70 uppercase tracking-wider mb-2">Call Summary</p>
            <p className="text-sm text-white/80 leading-relaxed">{callData.summary_text}</p>
          </div>
        )}
      </div>
    </div>
  );
}
