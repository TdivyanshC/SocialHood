"use client";

export default function Marquee() {
  const text =
    "Brand Strategy ✦ Content Creation ✦ Reels & Shorts ✦ Influencer Campaigns ✦ Community Building ✦ Paid Social ✦ Analytics & Growth ✦ ";

  return (
    <div className="border-y border-white/5 py-4 overflow-hidden bg-black">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="text-xs tracking-[0.2em] text-gold font-body mx-4">
          {text}
        </span>
        <span className="text-xs tracking-[0.2em] text-gold font-body mx-4">
          {text}
        </span>
      </div>
    </div>
  );
}
