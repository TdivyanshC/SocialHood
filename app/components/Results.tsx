"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// This section used to hold four invented metrics (10x ROI, 300% growth, 80%
// cost reduction, 98% satisfaction). Unattributable numbers cost more
// credibility than they buy, so the real ones now sit on the case study and
// this slot does the more useful job: telling a reader whether to keep reading.
const FITS = [
  "You spend on ads or portals and the leads arrive faster than anyone can call them",
  "The purchase is considered — a showroom visit, a site visit, a consultation",
  "Enquiries land outside business hours and nobody picks them up",
  "Follow-up stops after one or two attempts because the team runs out of time",
  "An owner or director can decide, and wants to see what happened to every lead",
];

const DOES_NOT_FIT = [
  "There is no paid lead flow yet — there is nothing for a system to catch",
  "You are a marketplace or aggregator; you are the lead source",
  "You want one AI that does everything, scoped as we go",
  "The decision needs a committee and no owner will be in the room",
  "You want a chatbot on the website and nothing else",
];

export default function Results() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".fit-header",
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
        ".fit-column",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: ".fit-columns", start: "top 85%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="fit-header text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-6 font-body">
            Before You Book A Call
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight text-white mb-4">
            These Systems Are Not
            <br />
            For Everyone.
          </h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto font-body leading-relaxed">
            They pay for themselves where lead volume and deal value are already there. Where
            they are not, we will say so on the first call rather than sell you one.
          </p>
        </div>

        <div className="fit-columns grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fits */}
          <div className="fit-column bg-white/[0.02] border border-[#00B98E]/20 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-[#00B98E]/15 flex items-center justify-center text-[#00B98E]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </span>
              <h3 className="font-display text-xl text-white">This is built for you if</h3>
            </div>
            <ul className="space-y-4">
              {FITS.map((item) => (
                <li key={item} className="flex gap-3 font-body text-sm text-white/60 leading-relaxed">
                  <span className="shrink-0 mt-2 w-1 h-1 rounded-full bg-[#00B98E]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Does not fit */}
          <div className="fit-column bg-white/[0.02] border border-white/10 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/40">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
              <h3 className="font-display text-xl text-white/70">It is the wrong call if</h3>
            </div>
            <ul className="space-y-4">
              {DOES_NOT_FIT.map((item) => (
                <li key={item} className="flex gap-3 font-body text-sm text-white/40 leading-relaxed">
                  <span className="shrink-0 mt-2 w-1 h-1 rounded-full bg-white/20" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
