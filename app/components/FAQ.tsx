"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "How quickly can I see results?",
    answer:
      "Most clients see initial results within 30 days. Significant lead increases typically happen within 60-90 days as our strategies and automation take full effect.",
  },
  {
    question: "Do you work with small businesses or only large companies?",
    answer:
      "We work with businesses of all sizes—from startups to enterprises. Our solutions are scalable and tailored to your specific needs and budget.",
  },
  {
    question: "What makes your web development different from others?",
    answer:
      "We don't use basic WordPress templates. We build custom websites using enterprise-grade tech stacks (React, Next.js, Node.js) that the biggest companies use. This ensures speed, security, and scalability.",
  },
  {
    question: "How does business automation help my company?",
    answer:
      "Automation eliminates repetitive tasks, reduces the need for additional employees, and increases efficiency. Our clients typically see 40-80% reduction in operational costs.",
  },
  {
    question: "What is your guarantee on lead generation?",
    answer:
      "We guarantee a minimum increase in your daily queries based on your industry and current setup. This is backed by our performance contract—your growth is our priority.",
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

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 bg-black relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#00ff41]/5 to-transparent pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-l from-[#00ff41]/3 to-transparent pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="faq-header text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-[#00ff41] uppercase mb-6 font-body">
            FAQ
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-4">
            Common Questions{' '}
            <span className="text-[#00ff41]">Answered</span>
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
                  ? "bg-white/[0.03] border-[#00ff41]/30"
                  : "bg-white/[0.02] border-white/5 hover:border-white/10"
              }`}
            >
              <button
                className="w-full p-6 flex justify-between items-center cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <span className={`font-body text-sm text-left pr-4 transition-colors ${
                  openIndex === index ? "text-[#00ff41]" : "text-white"
                }`}>
                  {faq.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  openIndex === index
                    ? "bg-[#00ff41] text-black"
                    : "bg-white/5 text-white/40 group-hover:bg-[#00ff41]/10 group-hover:text-[#00ff41]"
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
                  <div className="h-px bg-gradient-to-r from-[#00ff41]/20 via-[#00ff41]/10 to-transparent mb-4" />
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
            <Link href="/contact" className="text-[#00ff41] hover:underline">
              Get in touch
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
