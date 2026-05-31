"use client";

import { useEffect, useState } from "react";
import {
  type SupportTicket,
  closeSupportTicket,
  reopenSupportTicket,
} from "@/lib/supabase/supportTickets";
import { useToast } from "../leads/Toast";
import {
  assemblyLabel,
  formatTicketDate,
  issueTypeLabel,
  safeDateText,
  ticketStatusClasses,
} from "./helpers";

interface TicketDetailModalProps {
  ticket: SupportTicket | null;
  onClose: () => void;
  onChanged: () => void;
}

export function TicketDetailModal({ ticket, onClose, onChanged }: TicketDetailModalProps) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (ticket) {
      setNotes(ticket.resolution_notes || "");
      setActivePhoto(null);
    }
  }, [ticket]);

  if (!ticket) return null;

  const allPhotos = collectAllPhotos(ticket);
  const isOpen = ticket.status === "open";

  const handleClose = async () => {
    setBusy(true);
    try {
      await closeSupportTicket(ticket.id, notes.trim() || null);
      toast.push("success", `Ticket ${ticket.ticket_number} marked as closed`);
      onChanged();
    } catch (err: any) {
      toast.push("error", err?.message || "Failed to close ticket");
    } finally {
      setBusy(false);
    }
  };

  const handleReopen = async () => {
    setBusy(true);
    try {
      await reopenSupportTicket(ticket.id);
      toast.push("success", `Ticket ${ticket.ticket_number} reopened`);
      onChanged();
    } catch (err: any) {
      toast.push("error", err?.message || "Failed to reopen ticket");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-white/10 bg-black shadow-2xl shadow-black/50">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-md border-b border-white/10 px-6 py-5 flex items-start justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-[#00B98E]">Support ticket</p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <h2 className="text-2xl font-semibold text-white font-mono">
                {ticket.ticket_number}
              </h2>
              <span
                className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${ticketStatusClasses(ticket.status)}`}
              >
                {ticket.status?.toUpperCase() || "—"}
              </span>
            </div>
            <p className="text-sm text-white/60 mt-1">
              Opened {formatTicketDate(ticket.created_at)}
              {ticket.resolved_at && ` · Resolved ${formatTicketDate(ticket.resolved_at)}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-xl w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center shrink-0 ml-3"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <InfoCell label="Customer">{ticket.customer_name || "—"}</InfoCell>
            <InfoCell label="Phone">
              <span className="font-mono">{ticket.phone || "—"}</span>
            </InfoCell>
            <InfoCell label="Order ID">
              <span className="font-mono">{ticket.order_id || "—"}</span>
            </InfoCell>
            <InfoCell label="Assigned to">
              {ticket.assigned_to || "Unassigned"}
            </InfoCell>
          </div>

          {/* Issue summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <InfoCell label="Issue type">{issueTypeLabel(ticket.issue_type)}</InfoCell>
            <InfoCell label="Resolution requested">
              {issueTypeLabel(ticket.resolution_requested)}
            </InfoCell>
            <InfoCell label="Assembly">{assemblyLabel(ticket.assembly_type)}</InfoCell>
            <InfoCell label="Usage affected">
              <span
                className={
                  ticket.usage_affected ? "text-red-300" : "text-white/70"
                }
              >
                {ticket.usage_affected ? "Yes" : "No"}
              </span>
            </InfoCell>
            <InfoCell label="Delivery date">{safeDateText(ticket.delivery_date)}</InfoCell>
            <InfoCell label="Issue noticed">
              {safeDateText(ticket.issue_noticed_date)}
            </InfoCell>
            <InfoCell label="Team notified">
              {formatTicketDate(ticket.team_notified_at)}
            </InfoCell>
            <InfoCell label="Lead ID">
              <span className="font-mono text-xs">{ticket.lead_id || "—"}</span>
            </InfoCell>
          </div>

          {/* Description */}
          {ticket.description && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-white/60 mb-2">
                Description
              </p>
              <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>
          )}

          {/* Photos */}
          {allPhotos.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-wider text-white/60 mb-3">
                Photos ({allPhotos.length})
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {allPhotos.map((p, i) => (
                  <button
                    key={`${p.url}-${i}`}
                    onClick={() => setActivePhoto(p.url)}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:border-[#00B98E]/60 transition"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.url}
                      alt={p.label}
                      className="w-full h-full object-cover transition group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
                      <p className="text-[10px] text-white/90 font-medium">{p.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resolution notes */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wider text-white/60 mb-2">
              Resolution notes
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={isOpen ? "Add notes before closing (optional)" : "No notes recorded"}
              disabled={!isOpen}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder-white/40 outline-none focus:border-[#00B98E] resize-none disabled:opacity-70"
            />
          </div>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-black/95 backdrop-blur-md border-t border-white/10 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-sm font-medium border border-white/10 text-white hover:bg-white/5"
          >
            Close
          </button>
          {isOpen ? (
            <button
              onClick={handleClose}
              disabled={busy}
              className="px-5 py-2 rounded-full text-sm font-semibold bg-[#00B98E] text-black hover:bg-[#00d494] disabled:opacity-50"
            >
              {busy ? "Marking…" : "✓ Mark as closed"}
            </button>
          ) : (
            <button
              onClick={handleReopen}
              disabled={busy}
              className="px-5 py-2 rounded-full text-sm font-semibold border border-amber-500/40 bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 disabled:opacity-50"
            >
              {busy ? "Reopening…" : "↻ Reopen ticket"}
            </button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-6 cursor-zoom-out"
          onClick={() => setActivePhoto(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activePhoto}
            alt="Photo"
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActivePhoto(null);
            }}
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

function InfoCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
      <p className="text-[10px] uppercase tracking-wider text-white/50">{label}</p>
      <div className="mt-1 text-sm text-white">{children}</div>
    </div>
  );
}

interface LabeledPhoto {
  url: string;
  label: string;
}

function collectAllPhotos(ticket: SupportTicket): LabeledPhoto[] {
  const out: LabeledPhoto[] = [];
  if (ticket.photos && Array.isArray(ticket.photos)) {
    ticket.photos.forEach((url, i) => {
      if (url) out.push({ url, label: `Photo ${i + 1}` });
    });
  }
  if (ticket.product_photo_url) {
    out.push({ url: ticket.product_photo_url, label: "Product photo" });
  }
  if (ticket.bill_photo_url) {
    out.push({ url: ticket.bill_photo_url, label: "Bill photo" });
  }
  return out;
}
