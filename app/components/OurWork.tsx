"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CLIENT_SYSTEMS, STATUS_LABEL } from "../../lib/systems";

gsap.registerPlugin(ScrollTrigger);

// The homepage proof slot. It used to be a carousel of client website
// screenshots, then a single-product pitch for one system. Neither said what
// the studio actually does. This shows the range: several systems, several
// verticals, with the live one marked as live. Our own products live on /work.
const SHOWCASE = CLIENT_SYSTEMS;

export default function OurWork() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".systems-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".system-tile",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: ".systems-grid", start: "top 85%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-black relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-l from-[#00B98E]/5 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="systems-header max-w-3xl mb-16">
          <p className="text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-6 font-body">
            The Systems
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight text-white mb-6">
            Different industries.
            <br />
            <span className="text-white/45">The same shape of loss.</span>
          </h2>
          <p className="font-body text-white/50 text-lg leading-relaxed">
            Something arrives — a call, a form, a quote request — and nobody reaches it in time.
            The shape repeats across verticals; only the conversation changes. These are the
            systems we put in that gap.
          </p>
        </div>

        {/* Systems */}
        <div className="systems-grid grid grid-cols-1 md:grid-cols-2 gap-5">
          {SHOWCASE.map((system, i) => {
            const isLive = system.status === "production";
            return (
              <Link
                key={system.id}
                href="/work"
                className={`system-tile group relative flex flex-col rounded-2xl p-8 md:p-9 border transition-all duration-300 hover:-translate-y-0.5 ${
                  isLive
                    ? "border-[#00B98E]/30 bg-[#00B98E]/[0.04] hover:border-[#00B98E]/60"
                    : "border-white/8 bg-white/[0.02] hover:border-white/20"
                }`}
              >
                {/* Status + index */}
                <div className="flex items-center justify-between mb-7">
                  <span
                    className={`inline-flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase rounded-full px-3 py-1 border ${
                      isLive
                        ? "text-[#00B98E] border-[#00B98E]/40"
                        : "text-white/35 border-white/10"
                    }`}
                  >
                    {isLive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00B98E]" />
                    )}
                    {STATUS_LABEL[system.status]}
                  </span>
                  <span className="font-display text-xl text-white/12">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="font-body text-xs tracking-[0.18em] uppercase text-white/35 mb-3">
                  {system.vertical}
                </p>
                <h3 className="font-display text-2xl md:text-3xl font-light text-white mb-4 group-hover:text-[#00B98E] transition-colors">
                  {system.name}
                </h3>
                <p className="font-body text-white/50 leading-relaxed">{system.headline}</p>

                {/* Live systems earn a result line here. Blueprints do not. */}
                {isLive && system.outcomes && (
                  <p className="mt-6 font-body text-sm text-white/80">
                    {system.outcomes[0]} &middot; {system.client}
                  </p>
                )}

                <div className="mt-auto pt-8 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {system.practices.map((practice) => (
                      <span
                        key={practice}
                        className="text-[10px] tracking-wider uppercase text-white/30 border border-white/8 rounded-full px-2.5 py-1"
                      >
                        {practice}
                      </span>
                    ))}
                  </div>
                  <span className="text-white/25 group-hover:text-[#00B98E] group-hover:translate-x-1 transition-all duration-300">
                    &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Link on to the rest of the portfolio */}
        <div className="mt-12 text-center">
          <Link
            href="/work"
            className="group relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-medium overflow-hidden transition-all duration-300"
            style={{ background: "transparent", border: "1px solid #00B98E" }}
          >
            <span className="absolute inset-0 w-full h-full bg-[#00B98E] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 text-[#00B98E] group-hover:text-black transition-colors duration-300">
              Open the systems in detail
            </span>
            <span className="relative z-10 flex items-center text-[#00B98E] group-hover:text-black transition-colors duration-300">
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
