"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "What does the voice agent actually do on a call?",
    answer:
      "It answers or places the call, works through your qualification script — budget, timeline, what they are actually looking for — books the visit or the callback into your calendar, and hands over to a human the moment the conversation needs one. Then it writes the transcript, the outcome and the score into your CRM before the next call starts.",
  },
  {
    question: "Will it sound like a robot?",
    answer:
      "Judge it yourself rather than take our word for it. On the first call we run a live call from the agent to your phone, in your language, using your script. Not a recording, not a demo video.",
  },
  {
    question: "Does it speak Hindi?",
    answer:
      "Hindi, English, Hinglish and regional languages. Most of the calls we run in India are mixed Hindi and English, which is how the callers actually speak.",
  },
  {
    question: "My team already calls every lead. Why would I need this?",
    answer:
      "How fast, and who calls the one that comes in at 11pm on a Sunday? The agent does not replace your team — it removes the dialling and the chasing, so they walk into a qualified conversation instead of working down a cold list.",
  },
  {
    question: "We tried a chatbot before and it did nothing.",
    answer:
      "A chatbot waits for someone to open your website. This calls them. The WhatsApp side runs on the official Meta Cloud API and shares a CRM with the voice agent, so a conversation that starts on a call continues on WhatsApp without anyone re-typing anything.",
  },
  {
    question: "What do I actually see once it is running?",
    answer:
      "A portal of your own: every call handled with its transcript and outcome, every lead and where it stands, WhatsApp threads, the follow-up queue, support tickets, and walk-ins matched back to the calls that produced them. You do not have to ask anyone for a report.",
  },
  {
    question: "How long before it is live?",
    answer:
      "We commit to a date in the scope document before any work starts, and it is short — this is a build we have done before, not research. Where it lands depends on how many products, languages and integrations the agent has to handle, which is exactly what the scoping call establishes.",
  },
  {
    question: "Do you only build lead-response systems?",
    answer:
      "No. Lead response is where we have the clearest proof, so it is where most conversations start, but the same four practices build support desks, booking and recall systems, back-office automation, reporting pipelines and the dashboards and software those run inside. If the work repeats and follows rules, it is a candidate.",
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
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-4 text-white">
            The Questions We
            <br />
            Get Asked On Every Call
          </h2>
          <p className="text-white/50 text-sm font-body">
            Answered here so the first call can be about your numbers instead.
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
                className={`grid transition-all duration-300 ease-in-out ${
                  openIndex === index ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6">
                    <div className="h-px bg-gradient-to-r from-[#00B98E]/20 via-[#00B98E]/10 to-transparent mb-4" />
                    <p className="text-sm text-white/60 leading-relaxed font-body">
                      {faq.answer}
                    </p>
                  </div>
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

