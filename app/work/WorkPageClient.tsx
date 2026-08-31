"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CLIENTS as clients } from "../../lib/clients";
import {
  SYSTEMS,
  PRODUCTION_SYSTEMS,
  BLUEPRINT_SYSTEMS,
  PRODUCT_SYSTEMS,
  STATUS_LABEL,
  type SystemEntry,
} from "../../lib/systems";

// Cards with no live production URL (e.g. *.vercel.app preview links) render
// without an outbound link instead of pointing at a broken/mismatched domain.
const isLiveLink = (url: string) => !url.includes(".vercel.app");

function StatusChip({ system }: { system: SystemEntry }) {
  const isLive = system.status === "production";
  return (
    <span
      className={`inline-flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase rounded-full px-3 py-1 border ${
        isLive ? "text-[#00B98E] border-[#00B98E]/40" : "text-white/35 border-white/10"
      }`}
    >
      {isLive && <span className="w-1.5 h-1.5 rounded-full bg-[#00B98E]" />}
      {STATUS_LABEL[system.status]}
    </span>
  );
}

/* ------------------------------------------------------------------ *
 * Featured — the one system that is live for a named client.
 * ------------------------------------------------------------------ */
function FeaturedSystem({
  system,
  onOpen,
}: {
  system: SystemEntry;
  onOpen: (id: string, el: HTMLButtonElement) => void;
}) {
  return (
    <div className="relative rounded-3xl border border-[#00B98E]/25 bg-[#00B98E]/[0.03] overflow-hidden">
      <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-gradient-to-bl from-[#00B98E]/[0.08] to-transparent pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12">
        {/* Narrative */}
        <div className="lg:col-span-7 p-9 md:p-14">
          <StatusChip system={system} />

          <p className="mt-8 font-body text-xs tracking-[0.2em] uppercase text-white/35">
            {system.vertical}
          </p>
          <h3 className="mt-4 font-display text-4xl md:text-5xl font-light text-white leading-[1.05]">
            {system.client}
          </h3>
          <p className="mt-3 font-body text-lg text-[#00B98E]">{system.name}</p>

          <p className="mt-8 font-body text-white/55 text-lg leading-relaxed max-w-xl">
            {system.headline}
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {system.practices.map((practice) => (
              <span
                key={practice}
                className="text-[10px] tracking-wider uppercase text-white/40 border border-white/10 rounded-full px-3 py-1.5"
              >
                {practice}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={(e) => onOpen(system.id, e.currentTarget)}
            className="mt-10 group inline-flex items-center gap-3 text-sm text-white hover:text-[#00B98E] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B98E] rounded-full"
          >
            <span className="w-10 h-10 rounded-full border border-white/15 group-hover:border-[#00B98E] flex items-center justify-center transition-colors">
              &rarr;
            </span>
            Open the full case study
          </button>
        </div>

        {/* Outcomes */}
        <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-white/8 p-9 md:p-14 flex flex-col justify-center">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-white/35 mb-8">
            What it did
          </p>
          <div className="space-y-6">
            {system.outcomes?.map((outcome) => (
              <div key={outcome} className="flex gap-4">
                <span className="shrink-0 mt-2.5 w-1.5 h-1.5 rounded-full bg-[#00B98E]" />
                <p className="font-body text-white/85 leading-relaxed">{outcome}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Blueprint / in-house card.
 * ------------------------------------------------------------------ */
function SystemCard({
  system,
  index,
  onOpen,
}: {
  system: SystemEntry;
  index: number;
  onOpen: (id: string, el: HTMLButtonElement) => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => onOpen(system.id, e.currentTarget)}
      className="group h-full w-full flex flex-col text-left rounded-2xl border border-white/8 bg-white/[0.02] p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B98E] focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer"
    >
      <div className="flex items-start justify-between mb-8">
        <StatusChip system={system} />
        <span className="font-display text-xl text-white/12">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <p className="font-body text-xs tracking-[0.18em] uppercase text-white/35 mb-3">
        {system.vertical}
      </p>
      <h3 className="font-display text-2xl md:text-3xl font-light text-white leading-snug group-hover:text-[#00B98E] transition-colors">
        {system.name}
      </h3>
      <p className="mt-4 font-body text-white/50 leading-relaxed">{system.headline}</p>

      <div className="mt-7 pt-6 border-t border-white/5">
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-white/25 mb-3">
          What it takes over
        </p>
        <ul className="space-y-2">
          {system.howItRuns.slice(0, 3).map((item) => (
            <li key={item} className="flex gap-2.5 font-body text-sm text-white/45 leading-relaxed">
              <span className="shrink-0 mt-[9px] w-1 h-1 rounded-full bg-white/25" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-8 flex items-center justify-between">
        <span className="font-body text-xs tracking-[0.2em] uppercase text-white/30 group-hover:text-[#00B98E] transition-colors">
          Open the system
        </span>
        <span className="text-white/25 group-hover:text-[#00B98E] group-hover:translate-x-1 transition-all duration-300">
          &rarr;
        </span>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ *
 * Detail modal.
 * ------------------------------------------------------------------ */
function SystemModal({ system, onClose }: { system: SystemEntry; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  const Block = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <p className="font-body text-[10px] tracking-[0.25em] uppercase text-[#00B98E] mb-4">
        {label}
      </p>
      {children}
    </div>
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-8 bg-black/85 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="system-modal-title"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl max-h-[88vh] flex flex-col bg-[#08080A] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,185,142,0.08)]"
      >
        {/* Sticky header */}
        <div className="shrink-0 flex items-start justify-between gap-6 px-7 md:px-12 pt-8 md:pt-10 pb-6 border-b border-white/8">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <StatusChip system={system} />
              <span className="font-body text-xs tracking-[0.18em] uppercase text-white/30">
                {system.vertical}
              </span>
            </div>
            <h3
              id="system-modal-title"
              className="font-display text-3xl md:text-4xl font-light text-white leading-tight"
            >
              {system.client ?? system.name}
            </h3>
            {system.client && (
              <p className="mt-2 font-body text-[#00B98E]">{system.name}</p>
            )}
          </div>

          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close details"
            className="shrink-0 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-black hover:bg-[#00B98E] hover:border-[#00B98E] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B98E]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/*
          data-lenis-prevent stops the global Lenis smooth-scroll from swallowing
          the wheel/trackpad event and scrolling the page behind the modal;
          overscroll-contain stops the scroll chaining once this pane hits an end.
          body{overflow:hidden} alone does neither, because Lenis drives scroll
          with transforms rather than the document's own scrollTop.
        */}
        <div
          data-lenis-prevent
          className="flex-1 overflow-y-auto overscroll-contain px-7 md:px-12 py-8 md:py-10"
        >
          <p className="font-body text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
            {system.headline}
          </p>

          {system.outcomes && (
            <div
              className={`rounded-2xl p-6 md:p-7 mb-10 border ${
                system.status === "production"
                  ? "bg-[#00B98E]/[0.06] border-[#00B98E]/20"
                  : "bg-white/[0.02] border-white/10"
              }`}
            >
              <p className="font-body text-[10px] tracking-[0.25em] uppercase text-[#00B98E] mb-5">
                {system.status === "production" ? "What it did" : "Where it stands"}
              </p>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {system.outcomes.map((outcome) => (
                  <div key={outcome} className="flex gap-2.5">
                    <span className="shrink-0 mt-[9px] w-1 h-1 rounded-full bg-[#00B98E]" />
                    <p className="font-body text-white text-sm leading-relaxed">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-10 md:gap-12">
            <div className="space-y-9">
              <Block label="What leaks today">
                <p className="font-body text-white/55 text-sm leading-relaxed">{system.leak}</p>
              </Block>
              <Block label="What the system does">
                <p className="font-body text-white/55 text-sm leading-relaxed">
                  {system.whatItDoes}
                </p>
              </Block>
              <Block label="Built with">
                <div className="flex flex-wrap gap-2">
                  {system.stack.map((item) => (
                    <span
                      key={item}
                      className="text-xs text-white/60 border border-white/10 rounded-full px-3 py-1.5"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Block>
            </div>

            <div className="space-y-9">
              <Block label="How it runs">
                <div className="space-y-3">
                  {system.howItRuns.map((item, i) => (
                    <div key={item} className="flex gap-3">
                      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full border border-white/15 flex items-center justify-center text-[10px] text-white/45">
                        {i + 1}
                      </span>
                      <p className="font-body text-white/55 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </Block>
              <Block label="What the owner sees">
                <ul className="space-y-2.5">
                  {system.measured.map((item) => (
                    <li key={item} className="flex gap-2.5 font-body text-sm text-white/55 leading-relaxed">
                      <span className="shrink-0 mt-[9px] w-1 h-1 rounded-full bg-[#00B98E]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Block>
            </div>
          </div>
        </div>

        {/* Sticky footer */}
        <div className="shrink-0 flex items-center justify-between gap-4 px-7 md:px-12 py-5 border-t border-white/8 bg-black/40">
          <button
            type="button"
            onClick={onClose}
            className="font-body text-xs tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B98E] rounded"
          >
            Close
          </button>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#00B98E] text-black font-medium px-6 py-3 rounded-full text-xs tracking-widest hover:bg-[#00B98E]/85 transition-all duration-300"
          >
            Talk about this one &rarr;
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

export default function WorkPageClient() {
  const [openId, setOpenId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openSystem = (id: string, el: HTMLButtonElement) => {
    triggerRef.current = el;
    setOpenId(id);
  };

  const closeSystem = () => {
    setOpenId(null);
    triggerRef.current?.focus();
  };

  const activeSystem = SYSTEMS.find((s) => s.id === openId) ?? null;

  return (
    <main className="bg-black min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.2em] text-[#00B98E] uppercase mb-6 font-body">
            Our Work
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-[1.05] mb-8 text-white">
            The systems,
            <br />
            <span className="text-white/45">opened up.</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl font-body leading-relaxed">
            Each one below opens into what leaks today, what the system takes over, how it runs,
            and what the owner sees once it does. Two labels appear:{" "}
            <span className="text-[#00B98E]">in production</span> means live for a named client,
            with their numbers. <span className="text-white/70">System we build</span> means a
            system design we deploy for that vertical — described as it is built, not dressed up
            as someone else&apos;s case study.
          </p>
        </div>
      </section>

      {/* In production */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {PRODUCTION_SYSTEMS.map((system) => (
            <FeaturedSystem key={system.id} system={system} onOpen={openSystem} />
          ))}
        </div>
      </section>

      {/* Systems we build */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12 max-w-2xl">
            <p className="text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-4 font-body">
              Systems We Build
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-light text-white mb-4">
              Same shape, different conversation
            </h2>
            <p className="font-body text-white/45 leading-relaxed">
              The mechanism transfers across verticals; the script, the qualification and the
              calendar do not. These are the system designs we deploy, written out in full.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
            {BLUEPRINT_SYSTEMS.map((system, index) => (
              <SystemCard key={system.id} system={system} index={index} onOpen={openSystem} />
            ))}
          </div>
        </div>
      </section>

      {/* Built in-house */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-4 font-body">
              Our Own Products
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-light text-white mb-4">
              Built for ourselves first
            </h2>
            <p className="font-body text-white/45 leading-relaxed">
              The same four practices, pointed inward. What works here becomes something we
              can put in front of a client; what does not, we find out on our own time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRODUCT_SYSTEMS.map((system, index) => (
              <SystemCard key={system.id} system={system} index={index} onOpen={openSystem} />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeSystem && <SystemModal system={activeSystem} onClose={closeSystem} />}
      </AnimatePresence>

      {/* Prior work — websites and platforms. Deliberately quieter than the
          systems above: these are credentials, not the offer. */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-4 font-body">
              Before The Systems
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-light text-white/70 mb-4">
              Websites and platforms we have shipped
            </h2>
            <p className="font-body text-sm text-white/35 leading-relaxed">
              The studio started here, and we still build this layer when a system needs it.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {clients.map((client) => {
              const CardBody = (
                <div className="bg-black border border-white/5 w-full rounded-xl overflow-hidden transition-all duration-300 group-hover:border-white/20">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={client.image}
                      alt={client.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 50vw, 33vw"
                      className="object-cover opacity-45 transition-all duration-300 group-hover:opacity-90 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                      {client.name}
                    </h3>
                    <p className="text-white/30 text-xs mt-1">{client.description}</p>
                  </div>
                </div>
              );

              return isLiveLink(client.website) ? (
                <a
                  key={client.id}
                  href={client.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  {CardBody}
                </a>
              ) : (
                <div key={client.id} className="block group cursor-default">
                  {CardBody}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-light text-white mb-5">
            Which of these is your business losing?
          </h2>
          <p className="text-white/50 mb-8 font-body leading-relaxed">
            We start by filling in your own enquiry form and timing the reply. You see the gap in
            your own data before anyone talks about building anything.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#00B98E] text-black font-medium px-8 py-4 rounded-full text-sm tracking-widest hover:bg-[#00B98E]/85 transition-all duration-300"
          >
            Book the audit call &rarr;
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
