"use client";

export default function Marquee() {
  const items = [
    "Brand Strategy",
    "Content Creation",
    "Reels & Shorts",
    "Influencer Campaigns",
    "Community Building",
    "Paid Social",
    "Analytics & Growth",
    "Web Development",
    "Business Automation",
    "Lead Generation",
    "PPC Campaigns",
    "Growth Strategy",
  ];

  return (
    <div className="border-y border-white/10 py-8 overflow-hidden bg-black relative">
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      {/* First row - left to right */}
      <div className="flex mb-4">
        <div className="flex animate-marquee whitespace-nowrap">
          {items.map((item, index) => (
            <span
              key={`first-${index}`}
              className="text-lg tracking-[0.15em] text-gold font-body mx-8 flex items-center gap-4"
            >
              <span className="w-2 h-2 rounded-full bg-gold" />
              {item}
            </span>
          ))}
          {/* Duplicate for infinite loop */}
          {items.map((item, index) => (
            <span
              key={`first-dup-${index}`}
              className="text-lg tracking-[0.15em] text-gold font-body mx-8 flex items-center gap-4"
            >
              <span className="w-2 h-2 rounded-full bg-gold" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Second row - right to left */}
      <div className="flex">
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {items.slice().reverse().map((item, index) => (
            <span
              key={`second-${index}`}
              className="text-lg tracking-[0.15em] text-white/40 font-body mx-8 flex items-center gap-4"
            >
              <span className="w-2 h-2 rounded-full bg-white/40" />
              {item}
            </span>
          ))}
          {/* Duplicate for infinite loop */}
          {items.slice().reverse().map((item, index) => (
            <span
              key={`second-dup-${index}`}
              className="text-lg tracking-[0.15em] text-white/40 font-body mx-8 flex items-center gap-4"
            >
              <span className="w-2 h-2 rounded-full bg-white/40" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
