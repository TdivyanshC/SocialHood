"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PRACTICES } from "../../lib/systems";

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".services-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".service-row",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-container",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="py-32 px-6 bg-black relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-white/5 to-transparent pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-l from-white/3 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="services-header text-center mb-20">
          <p className="text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-6 font-body">
            What We Build
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight max-w-3xl mx-auto text-white">
            Four Practices.
            <br />
            One Way Of Working.
          </h2>
          <p className="mt-6 text-white/50 font-body max-w-xl mx-auto leading-relaxed">
            Most engagements combine two or three of these. They are built as one system,
            not bought as separate line items.
          </p>
        </div>

        {/* Practices */}
        <div className="services-container space-y-4">
          {PRACTICES.map((practice, index) => (
            <div
              key={practice.id}
              className={`service-row group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 md:p-10 hover:border-[#00B98E]/30 transition-all duration-500 ${
                index % 2 === 0 ? "md:mr-20" : "md:ml-20"
              }`}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00B98E]/0 via-[#00B98E]/5 to-[#00B98E]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-start gap-6">
                {/* Icon & Number */}
                <div className="flex items-center gap-6 md:w-48 shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-[#00B98E]/10 flex items-center justify-center text-[#00B98E] group-hover:bg-[#00B98E]/20 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={practice.iconPath} />
                    </svg>
                  </div>
                  <span className="font-display text-4xl text-white/20 group-hover:text-[#00B98E] transition-colors">
                    {practice.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-display text-2xl mb-2 text-white group-hover:text-[#00B98E] transition-colors">
                    {practice.name}
                  </h3>
                  <p className="font-body text-white/70 mb-3">{practice.promise}</p>
                  <p className="font-body text-white/50 leading-relaxed">
                    {practice.description}
                  </p>
                </div>
              </div>

              {/* Bottom line indicator */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00B98E] group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Honest footnote — websites and SEO are real work, just not the headline */}
        <div className="mt-12 text-center">
          <p className="font-body text-sm text-white/35 max-w-2xl mx-auto leading-relaxed">
            We also build the websites, funnels and search systems these run alongside — usually
            as part of a Software engagement rather than on their own.{" "}
            <Link href="/services" className="text-[#00B98E]/70 hover:text-[#00B98E] transition-colors">
              See the full breakdown
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
