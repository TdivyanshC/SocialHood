"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Audit",
    description:
      "We fill in your own enquiry form and time the reply. You see your response gap in your own data — not on a slide.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Scope",
    description:
      "What the system will do, what it will not, and where it hands a conversation to a human. Fixed in writing before anything is built.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Build",
    description:
      "Agents trained on your products, your objections, your booking rules — then wired into your CRM, calendar and WhatsApp number and tested on real calls.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Run",
    description:
      "Live, and then watched. We read the transcripts weekly and tune the script against real conversations. Your dashboard shows what happened to every single lead.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
];

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".process-header",
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

      // Animated line drawing
      gsap.fromTo(
        ".process-line",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: ".process-timeline",
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        ".process-step",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".process-timeline",
            start: "top 65%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-32 px-6 bg-black relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-white/5 to-transparent pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-l from-white/3 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="process-header text-center mb-24">
          <p className="text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-6 font-body">
            How We Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6 text-white">
            From Your Enquiry Form
            <br />
            To A System That Runs
          </h2>
          <p className="text-white/50 font-body max-w-xl mx-auto leading-relaxed">
            The same four steps whatever we are building. You know what is happening in each
            of them, and exactly what you are signing, before anything starts.
          </p>
        </div>

        {/* Timeline */}
        <div className="process-timeline relative">
          {/* Animated connecting line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5">
            <div className="process-line absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-[#00B98E] via-[#00B98E] to-[#00B98E] origin-left" />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className="process-step relative flex flex-col items-center"
              >
                {/* Step card */}
                <div className="group w-full">
                  {/* Number badge */}
                  <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:border-[#00B98E]/50 group-hover:bg-[#00B98E]/10 transition-all duration-300">
                    <div className="text-[#00B98E]">
                      {step.icon}
                    </div>
                    {/* Step number overlay */}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#00B98E] text-black text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>

                  {/* Card content */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 text-center group-hover:border-[#00B98E]/20 group-hover:bg-[#00B98E]/5 transition-all duration-300">
                    <h3 className="font-display text-lg mb-3 text-white group-hover:text-[#00B98E] transition-colors">
                      {step.title}
                    </h3>
                    <p className="font-body text-sm text-white/50 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow connector (mobile) */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex items-center justify-center my-4">
                    <svg className="w-6 h-6 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="text-center mt-20">
          <p className="font-display text-2xl text-white/30">
            Then we keep it <span className="text-white">running</span>.
          </p>
        </div>
      </div>
    </section>
  );
}

