"use client";

import type { SupportTicket } from "@/lib/supabase/supportTickets";
import {
  formatTicketDate,
  issueTypeLabel,
  ticketStatusClasses,
} from "./helpers";

interface TicketCardProps {
  ticket: SupportTicket;
  onClick: () => void;
}

export function TicketCard({ ticket, onClick }: TicketCardProps) {
  const previewPhoto = pickPreview(ticket);
  const photoCount =
    (ticket.photos?.length || 0) +
    (ticket.bill_photo_url ? 1 : 0) +
    (ticket.product_photo_url ? 1 : 0);

  return (
    <button
      onClick={onClick}
      className="text-left group rounded-3xl border border-white/10 bg-white/5 overflow-hidden hover:border-[#00B98E]/60 hover:bg-white/[0.07] transition flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] w-full bg-white/5 overflow-hidden">
        {previewPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewPhoto}
            alt={`Ticket ${ticket.ticket_number}`}
            className="w-full h-full object-cover transition group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30 text-4xl">
            🖼
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${ticketStatusClasses(ticket.status)}`}
          >
            {ticket.status?.toUpperCase() || "—"}
          </span>
        </div>
        {photoCount > 1 && (
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2 py-1 rounded-full text-[10px] font-medium bg-black/60 text-white/90 backdrop-blur-sm">
              📷 {photoCount}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-[#00B98E] font-mono">{ticket.ticket_number}</p>
            <h3 className="text-lg font-semibold text-white mt-1 truncate">
              {ticket.customer_name || "Unknown customer"}
            </h3>
            <p className="text-xs text-white/60 font-mono mt-0.5">{ticket.phone || "—"}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ticket.issue_type && (
            <Pill>{issueTypeLabel(ticket.issue_type)}</Pill>
          )}
          {ticket.resolution_requested && (
            <Pill>{issueTypeLabel(ticket.resolution_requested)}</Pill>
          )}
          {ticket.usage_affected && (
            <Pill className="bg-red-500/15 text-red-300 border-red-500/30">
              Usage affected
            </Pill>
          )}
        </div>

        {ticket.description && (
          <p className="text-sm text-white/80 line-clamp-2">{ticket.description}</p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between border-t border-white/5">
          <p className="text-[11px] text-white/50">
            {formatTicketDate(ticket.created_at)}
          </p>
          {ticket.order_id && (
            <p className="text-[11px] text-white/50 font-mono">{ticket.order_id}</p>
          )}
        </div>
      </div>
    </button>
  );
}

function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium border border-white/10 bg-white/5 text-white/80 ${className || ""}`}
    >
      {children}
    </span>
  );
}

function pickPreview(ticket: SupportTicket): string | null {
  if (ticket.photos && ticket.photos.length > 0) return ticket.photos[0];
  if (ticket.product_photo_url) return ticket.product_photo_url;
  if (ticket.bill_photo_url) return ticket.bill_photo_url;
  return null;
}
