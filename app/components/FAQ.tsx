"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "How long does it take to see results?",
    answer:
      "Most clients see initial traction within 30 days. Significant growth typically happens within 90 days as our strategies take hold and content compounds.",
  },
  {
    question: "Do you work with all types of brands?",
    answer:
      "We work with brands across categories—from startups to established enterprises. Our specialty is brands that want to build genuine communities, not just vanity metrics.",
  },
  {
    question: "What's included in social media management?",
    answer:
      "Our management package includes content creation, scheduling, community engagement, analytics reporting, and strategy calls. We handle everything except your product/service delivery.",
  },
  {
    question: "Can you help with paid advertising?",
    answer:
      "Absolutely! Our Growth and Pro plans include paid ad management. We handle Meta, Google, and LinkedIn ads with a focus on maximizing your ROAS.",
  },
  {
    question: "How do you measure success?",
    answer:
      "We track engagement rates, follower growth, reach, conversions, and most importantly—your specific business KPIs. You'll receive detailed monthly reports with actionable insights.",
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
        { y: 20, opacity: 0 },
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
      className="py-32 px-6 max-w-3xl mx-auto"
    >
      <div className="faq-header text-center mb-16">
        <p className="text-xs tracking-[0.2em] text-gold uppercase mb-4 font-body">
          FAQ
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">
          Questions We Get All The Time
        </h2>
      </div>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="faq-item border-b border-white/5"
          >
            <button
              className="w-full py-6 flex justify-between items-center cursor-pointer"
              onClick={() => toggleFAQ(index)}
            >
              <span className="font-body text-sm text-left hover:text-gold transition-colors">
                {faq.question}
              </span>
              <span
                className={`text-gold text-xl transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                ↓
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-sm text-white/50 leading-relaxed pb-4">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
