"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CLIENTS as clients } from "../../lib/clients";

interface AiSystemProject {
  id: string;
  category: string;
  title: string;
  tagline: string;
  context: string;
  problem: string;
  whatWeBuilt: string;
  keyExecution: string[];
  result: string;
  stack: string[];
}

const AI_SYSTEMS: AiSystemProject[] = [
  {
    id: "voice-ai-furniture",
    category: "Voice AI",
    title: "Furniture Lead AI",
    tagline:
      "An AI voice agent that qualifies leads and books showroom visits — 24/7, no missed calls.",
    context:
      "₹2L/month in ad spend, 30-40 daily inbound leads, 5-6 person manual sales team. No lead infrastructure. Leads were sitting uncontacted for hours.",
    problem:
      "High volume of inbound and follow-up calls handled manually; leads going cold and slow response times.",
    whatWeBuilt:
      "Built a two-part AI agent system for a furniture business leaking revenue through uncontacted leads. A voice AI qualifies 30-40 daily leads within minutes of inquiry; a WhatsApp agent moves cold prospects to warm to hot over time. The 5-6 person manual follow-up team is being systematically replaced.",
    keyExecution: [
      "Inbound calls answered and qualified by the voice agent in real time, no hold time",
      "Structured qualification flow captures budget, timeline, and product interest on every call",
      "Appointments booked directly into the showroom calendar",
      "Automated follow-up sequence for leads who don't convert on the first call",
      "Every call transcribed, scored, and logged to the CRM automatically",
    ],
    result:
      "High ad spend with no systematic catch on the other side. Leads uncontacted for hours, manual team couldn't scale, and there was zero visibility into the pipeline.",
    stack: ["AI voice agent", "CRM integration", "Appointment scheduling", "Automated follow-up"],
  },
  {
    id: "social-auto-posting",
    category: "Automation",
    title: "Social Media Auto-Posting Agent",
    tagline: "Hands-off content publishing across platforms on a consistent cadence.",
    context:
      "A team publishing across Instagram, Facebook, and LinkedIn by hand — content sitting ready in drafts for days because nobody owned hitting publish on schedule.",
    problem:
      "Inconsistent posting and manual content ops eating team time — a queue of ready content with no reliable system to actually ship it.",
    whatWeBuilt:
      "An automation agent that prepares, schedules, and publishes content across social platforms on a set cadence, with an approval step before anything goes live.",
    keyExecution: [
      "Content queue pulled from a shared brief and auto-formatted per platform",
      "AI drafts captions and hashtags for each post",
      "Human approval step before anything goes live — nothing publishes unreviewed",
      "Scheduled publishing to Instagram, Facebook, and LinkedIn via native APIs",
      "Posting cadence and engagement logged automatically for weekly review",
    ],
    result:
      "Posting cadence went from a handful of posts a month to a consistent daily schedule, with zero missed publish windows since launch.",
    stack: ["Workflow automation (n8n)", "Social platform APIs", "AI content generation", "Approval workflow"],
  },
  {
    id: "ai-organic-growth-saas",
    category: "SaaS Product",
    title: "AI Organic Growth SaaS",
    tagline: "A product that turns AI into repeatable organic growth.",
    context:
      "Built in-house after watching the same organic-growth bottleneck repeat across client engagements — SEO and content work that stalls the moment it depends on a full-time team.",
    problem: "Organic growth via SEO/content is slow, manual, and hard to sustain.",
    whatWeBuilt:
      "An in-house SaaS product that uses AI to drive organic growth — content, SEO, and distribution — as a self-serve system rather than one-off manual work.",
    keyExecution: [
      "AI-generated content and topic clusters mapped to real search intent",
      "Automated technical SEO audits with prioritized, actionable fixes",
      "Distribution scheduled automatically across owned channels",
      "Self-serve dashboard — no in-house SEO team required to run it",
      "Keyword rankings and traffic tracked continuously, not in one-off reports",
    ],
    result:
      "Currently running on our own content and SEO — shipping 15+ optimized pieces a month with ranking movement tracked weekly. Opening to early pilot customers now.",
    stack: ["Next.js", "AI/LLM", "SEO automation"],
  },
];

// Cards with no live production URL (e.g. *.vercel.app preview links) render
// without an outbound link instead of pointing at a broken/mismatched domain.
const isLiveLink = (url: string) => !url.includes(".vercel.app");

function AiSystemCard({
  project,
  index,
  onOpen,
}: {
  project: AiSystemProject;
  index: number;
  onOpen: (id: string, el: HTMLButtonElement) => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => onOpen(project.id, e.currentTarget)}
      className="group h-full w-full flex flex-col text-left bg-black border border-white/10 rounded-2xl p-8 md:p-10 transition-all duration-300 hover:-translate-y-1 hover:border-[#00B98E] hover:shadow-[0_0_30px_rgba(0,185,142,0.15)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B98E] focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer"
    >
      <div className="flex items-start justify-between mb-8">
        <span className="text-[10px] tracking-[0.2em] text-[#00B98E] uppercase border border-[#00B98E]/30 rounded-full px-3 py-1">
          {project.category}
        </span>
        <span className="font-display text-2xl text-white/15 group-hover:text-[#00B98E]/40 transition-colors">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-white leading-snug">{project.title}</h3>
      <p className="text-white/50 text-[15px] mt-4 leading-relaxed">{project.tagline}</p>
      <div className="mt-auto pt-6 flex items-center gap-2 text-xs tracking-[0.2em] text-white/30 uppercase border-t border-white/5 group-hover:text-[#00B98E] group-hover:border-[#00B98E]/20 transition-colors">
        <span>View Case Study</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </div>
    </button>
  );
}

function ProjectModal({
  project,
  index,
  onClose,
}: {
  project: AiSystemProject;
  index: number;
  onClose: () => void;
}) {
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

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-black border border-white/10 rounded-2xl p-8 md:p-12 shadow-[0_0_60px_rgba(0,185,142,0.1)]"
      >
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-bl from-[#00B98E]/5 to-transparent pointer-events-none" />

        <button
          type="button"
          ref={closeButtonRef}
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-6 right-6 w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/50 hover:text-black hover:bg-[#00B98E] hover:border-[#00B98E] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B98E]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] tracking-[0.2em] text-[#00B98E] uppercase border border-[#00B98E]/30 rounded-full px-3 py-1">
              {project.category}
            </span>
            <span className="text-xs text-white/30 tracking-widest">
              {String(index + 1).padStart(2, "0")} / {String(AI_SYSTEMS.length).padStart(2, "0")}
            </span>
          </div>

          <h3
            id="project-modal-title"
            className="font-display text-3xl md:text-4xl font-light text-white mb-3 leading-tight"
          >
            {project.title}
          </h3>
          <p className="text-white/50 italic text-lg mb-10 font-body">{project.tagline}</p>

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-8">
              <div>
                <p className="text-xs tracking-[0.25em] text-[#00B98E] uppercase mb-3 font-body">
                  Context
                </p>
                <p className="text-white/60 text-sm leading-relaxed">{project.context}</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] text-[#00B98E] uppercase mb-3 font-body">
                  The Problem
                </p>
                <p className="text-white/60 text-sm leading-relaxed">{project.problem}</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] text-[#00B98E] uppercase mb-3 font-body">
                  What We Built
                </p>
                <p className="text-white/60 text-sm leading-relaxed">{project.whatWeBuilt}</p>
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-xs tracking-[0.25em] text-[#00B98E] uppercase mb-3 font-body">
                  Key Execution
                </p>
                <div className="space-y-3">
                  {project.keyExecution.map((item, i) => (
                    <div key={item} className="flex gap-3">
                      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full border border-white/15 flex items-center justify-center text-[10px] text-white/50">
                        {i + 1}
                      </span>
                      <p className="text-white/60 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                <p className="text-xs tracking-[0.25em] text-[#00B98E] uppercase mb-3 font-body">
                  Result
                </p>
                <p className="text-white text-sm leading-relaxed">{project.result}</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.25em] text-[#00B98E] uppercase mb-3 font-body">
                  Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((item) => (
                    <span
                      key={item}
                      className="text-xs text-white/70 border border-white/10 rounded-full px-3 py-1"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="text-xs tracking-widest text-white/40 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00B98E] rounded"
            >
              CLOSE DETAILS
            </button>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#00B98E] text-black font-medium px-6 py-3 rounded-full text-xs tracking-widest hover:bg-[#00B98E]/80 transition-all duration-300"
            >
              Build Something Like This →
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function WorkPageClient() {
  const [openId, setOpenId] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const openProject = (id: string, el: HTMLButtonElement) => {
    triggerRef.current = el;
    setOpenId(id);
  };

  const closeProject = () => {
    setOpenId(null);
    triggerRef.current?.focus();
  };

  const activeIndex = AI_SYSTEMS.findIndex((p) => p.id === openId);
  const activeProject = activeIndex >= 0 ? AI_SYSTEMS[activeIndex] : null;

  return (
    <main className="bg-black min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-white uppercase mb-6 font-body">
            Our Work
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            AI Systems <span style={{ color: '#00B98E' }}>We've Built & Run</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-body">
            Voice agents, automation pipelines, and products we've shipped — plus the
            websites and platforms we've built along the way.
          </p>
        </div>
      </section>

      {/* Group A - AI Systems */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-4 font-body">
              Group A
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-light text-white">
              AI Systems
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {AI_SYSTEMS.map((project, index) => (
              <AiSystemCard
                key={project.id}
                project={project}
                index={index}
                onOpen={openProject}
              />
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {activeProject && (
          <ProjectModal project={activeProject} index={activeIndex} onClose={closeProject} />
        )}
      </AnimatePresence>

      {/* Group B - Web & Product Builds */}
      <section className="py-20 px-6 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-xs tracking-[0.3em] text-white/40 uppercase mb-4 font-body">
              Group B
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-light text-white/70">
              Web & Product Builds
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {clients.map((client) => {
              const CardBody = (
                <div className="bg-black border border-white/10 w-full h-auto rounded-xl overflow-hidden transition-all duration-300 group-hover:border-[#00B98E] group-hover:shadow-[0_0_30px_rgba(0,185,142,0.15)]">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={client.image}
                      alt={client.name}
                      fill
                      className="object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00B98E] transition-colors">
                      {client.name}
                    </h3>
                    <p className="text-white/60 text-sm mt-2">
                      {client.description}
                    </p>
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

      {/* Stats Section */}
      <section className="py-20 px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="font-display text-5xl text-white">50+</p>
              <p className="text-white/50 text-sm mt-2">Projects Completed</p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-white">10x</p>
              <p className="text-white/50 text-sm mt-2">Avg ROI</p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-white">300%</p>
              <p className="text-white/50 text-sm mt-2">Avg Growth</p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-white">98%</p>
              <p className="text-white/50 text-sm mt-2">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl mb-6">Want an AI System Built for Your Business?</h2>
          <p className="text-white/50 mb-8 font-body">
            Let's talk about what we can automate, qualify, or run for you — the way we've
            done for the businesses above.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#00B98E] text-black font-medium px-8 py-4 rounded-full text-sm tracking-widest hover:bg-[#00B98E]/80 transition-all duration-300"
          >
            Start Your Project →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
