"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Industries from "../components/Industries";
import { PRACTICES, CLIENT_SYSTEMS } from "../../lib/systems";

const ASSEMBLIES = CLIENT_SYSTEMS;

gsap.registerPlugin(ScrollTrigger);

// Work we do that is real revenue but deliberately not a headline offer. It
// lives under Software rather than as a fifth practice — a flat menu of nine
// co-equal services is what this page used to be, and it read like an agency.
const ALSO_BUILD = [
  {
    title: "Websites & product builds",
    detail: "Next.js, React, Node and Supabase. Fast, owned, and not a template.",
  },
  {
    title: "Landing pages & funnels",
    detail: "The pages the ads point at, wired into the same CRM as the agents.",
  },
  {
    title: "SEO & organic systems",
    detail: "Content and technical work run as a loop, not delivered as a report.",
  },
  {
    title: "Advisory",
    detail: "Where automation belongs in a roadmap, and where it does not yet.",
  },
];

export default function ServicesPageClient() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-container",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".assembly-row",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".assembly-block",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={sectionRef} className="bg-black min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-6 font-body">
            What We Build
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6 text-white">
            Four Practices.
            <br />
            Assembled Into Systems.
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-body leading-relaxed">
            We are an AI Systems Studio. These are the four things we build, and they are
            almost never bought one at a time — a working system usually needs two or three
            of them wired together.
          </p>
        </div>
      </section>

      {/* The four practices */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto services-container space-y-8">
          {PRACTICES.map((practice) => (
            <div
              key={practice.id}
              id={practice.id}
              className="service-card group relative bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 hover:border-[#00B98E]/30 transition-all duration-500 scroll-mt-28"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#00B98E]/0 via-[#00B98E]/5 to-[#00B98E]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 grid md:grid-cols-12 gap-8">
                <div className="md:col-span-3">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#00B98E]/10 flex items-center justify-center text-[#00B98E] group-hover:bg-[#00B98E]/20 transition-colors shrink-0">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={practice.iconPath} />
                      </svg>
                    </div>
                    <span className="font-display text-4xl text-white/15 group-hover:text-[#00B98E]/50 transition-colors">
                      {practice.number}
                    </span>
                  </div>
                </div>

                <div className="md:col-span-5">
                  <h2 className="font-display text-3xl mb-3 text-white group-hover:text-[#00B98E] transition-colors">
                    {practice.name}
                  </h2>
                  <p className="font-body text-white/75 mb-4">{practice.promise}</p>
                  <p className="font-body text-white/50 leading-relaxed">
                    {practice.description}
                  </p>
                </div>

                <div className="md:col-span-4">
                  <p className="text-[10px] tracking-[0.25em] text-white/30 uppercase mb-4 font-body">
                    In practice
                  </p>
                  <ul className="space-y-2.5">
                    {practice.capabilities.map((capability) => (
                      <li key={capability} className="flex items-start gap-2.5 text-white/55 text-sm font-body">
                        <span className="shrink-0 mt-[7px] w-1 h-1 rounded-full bg-[#00B98E]" />
                        {capability}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What the practices look like once they are assembled. Deliberately
          plural: several systems across several verticals, not one product. */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="assembly-block max-w-5xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <p className="text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-6 font-body">
              Assembled
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-6">
              Two or three practices
              <br />
              <span className="text-white/45">become a system.</span>
            </h2>
            <p className="text-white/50 font-body leading-relaxed">
              What gets built depends on where the business is losing the conversation. Same
              parts, assembled differently for each vertical.
            </p>
          </div>

          <div className="border border-white/10 rounded-3xl divide-y divide-white/5 overflow-hidden">
            {ASSEMBLIES.map((system) => (
              <Link
                key={system.id}
                href="/work"
                className="assembly-row group grid md:grid-cols-12 gap-x-6 gap-y-3 p-6 md:p-8 hover:bg-white/[0.025] transition-colors"
              >
                <div className="md:col-span-4">
                  <p className="font-body text-[10px] tracking-[0.2em] uppercase text-white/30 mb-2">
                    {system.vertical}
                  </p>
                  <h3 className="font-display text-xl text-white group-hover:text-[#00B98E] transition-colors">
                    {system.name}
                  </h3>
                </div>
                <p className="md:col-span-5 font-body text-white/50 leading-relaxed">
                  {system.headline}
                </p>
                <div className="md:col-span-3 flex md:justify-end items-start gap-2 flex-wrap">
                  {system.practices.map((practice) => (
                    <span
                      key={practice}
                      className="text-[10px] tracking-wider uppercase text-white/35 border border-white/10 rounded-full px-2.5 py-1 h-fit"
                    >
                      {practice}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm text-[#00B98E] hover:gap-3 transition-all duration-300"
            >
              See each one in detail
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <Industries />

      {/* Adjacent work — real, deliberately subordinate */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-4 font-body">
              Also Built
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-light text-white/70 mb-4">
              The work that sits around a system
            </h2>
            <p className="font-body text-sm text-white/40 leading-relaxed">
              Real work we do and have done for years. It usually arrives as part of a Software
              engagement rather than on its own, which is why it is not one of the four.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            {ALSO_BUILD.map((item) => (
              <div key={item.title} className="border-t border-white/5 pt-5">
                <h3 className="font-body text-white/70 mb-1.5">{item.title}</h3>
                <p className="font-body text-sm text-white/35 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-light text-white mb-5">
            Start with the audit
          </h2>
          <p className="text-white/50 mb-8 font-body leading-relaxed">
            We fill in your own enquiry form, time the reply, and show you where the
            conversation is being lost — in your own data. One call. If a system is the wrong
            answer for you, you will hear that instead of a proposal.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#00B98E] text-black font-medium hover:bg-[#00D9A6] transition-colors"
          >
            Book the call
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
