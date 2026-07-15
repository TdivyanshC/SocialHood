"use client";

import type { WalkinCardSummary } from "@/lib/supabase/walkins";

// Pink is the one color in this codebase's dark-card palette that isn't
// already claimed: WhatsApp cards use red/yellow/blue/purple (helpers.ts
// cardAccentClasses) and Calls rows use green/red/yellow/orange/blue/purple/
// cyan/indigo (CallsDataDashboard.tsx). Applied as an inset box-shadow
// (not the `border` utility) so it layers on top of each card's existing
// border classes instead of fighting them for the same CSS property —
// per-repo convention is a thick border over a glow for dark-bg status
// color, but this is a secondary indicator riding alongside a border that's
// already doing that job, not a new full-card status.
export const WALKIN_ACCENT_SHADOW = "shadow-[inset_3px_0_0_0_rgba(244,114,182,0.65)]";

const WALKIN_BADGE_CLASS =
  "inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium bg-pink-500/20 text-pink-300 border border-pink-500/30";

const CONVERTED_BADGE_CLASS =
  "inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium bg-green-500/20 text-green-300 border border-green-500/30";

export function WalkinBadges({ walkin }: { walkin: WalkinCardSummary }) {
  return (
    <>
      <span className={WALKIN_BADGE_CLASS} title={walkin.source === "system" ? "System-matched walk-in" : "Offline walk-in"}>
        {walkin.source === "system" ? "📞" : "•"}
        {walkin.visitNumber > 1 ? `Visit ${walkin.visitNumber}` : "Walk-in"}
      </span>
      {walkin.converted && <span className={CONVERTED_BADGE_CLASS}>✓ Converted</span>}
    </>
  );
}
