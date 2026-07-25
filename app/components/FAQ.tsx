"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "What exactly does an AI voice agent do?",
    answer:
      "It answers or makes calls on your behalf — qualifying leads, booking appointments, answering common questions, and following up — using your business's real information, and hands off to a human whenever a call needs one.",
  },
  {
    question: "How is a WhatsApp AI agent different from a chatbot?",
    answer:
      "It runs on the official Meta Cloud API and connects directly into your CRM and workflows — nurturing leads, answering support questions, and triggering follow-ups automatically, not just replying to FAQs in a widget.",
  },
  {
    question: "What kind of tasks can custom automation actually replace?",
    answer:
      "Repetitive work that eats staff time today — research, data scraping, report generation, emailing, CRM updates, and multi-step workflows. We map your actual process first, then automate the parts that don't need a human.",
  },
  {
    question: "Do you only build AI systems, or also websites and software?",
    answer:
      "Both. Most engagements combine custom software or a website with the automation layer on top — dashboards, CRMs, internal tools, and product builds on Next.js, React, Node.js, MongoDB, and Supabase.",
  },
  {
    question: "Do you work with small businesses or only large companies?",
    answer:
      "We work with businesses of all sizes—from startups to enterprises—across Real Estate, Financial Services, E-commerce, Education, Manufacturing, and service businesses. Solutions are scoped to your budget and complexity.",
  },
  {
    question: "How quickly can I see results?",
    answer:
      "Most engagements start delivering within 30 days; automation systems and AI agents typically show measurable impact — fewer manual hours, faster response times — within the first 60-90 days.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-header",
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
        ".faq-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".faq-list",
            start: "top 85%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 bg-black relative overflow-hidden"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#00B98E]/5 to-transparent pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-l from-[#00B98E]/3 to-transparent pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="faq-header text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-6 font-body">
            FAQ
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-4">
            Common Questions{' '}
            <span className="text-white">Answered</span>
          </h2>
          <p className="text-white/50 text-sm font-body">
            Everything you need to know about working with us.
          </p>
        </div>

        {/* FAQ List */}
        <div className="faq-list space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item group rounded-2xl border transition-all duration-300 ${
                openIndex === index
                  ? "bg-white/[0.03] border-[#00B98E]/30"
                  : "bg-white/[0.02] border-white/5 hover:border-white/10"
              }`}
            >
              <button
                className="w-full p-6 flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <span className={`font-body text-sm text-left pr-4 transition-colors ${
                  openIndex === index ? "text-[#00B98E]" : "text-white"
                }`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openIndex === index
                    ? "bg-[#00B98E] text-black"
                    : "bg-white/5 text-white/40 group-hover:bg-[#00B98E]/10 group-hover:text-[#00B98E]"
                }`}>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="h-px bg-gradient-to-r from-[#00B98E]/20 via-[#00B98E]/10 to-transparent mb-4" />
                  <p className="text-sm text-white/60 leading-relaxed font-body">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-white/40 text-sm font-body">
            Still have questions?{" "}
            <Link href="/contact" className="text-[#00B98E] hover:underline">
              Get in touch
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

