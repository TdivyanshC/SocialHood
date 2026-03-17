"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Business Analysis",
    description: "We analyze your current setup, identify gaps, and understand your growth goals.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Strategy Development",
    description: "We build a custom roadmap using proven strategies from successful companies.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Implementation",
    description: "We deploy cutting-edge technology and automation to transform your business.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Scale & Optimize",
    description: "We continuously monitor, optimize, and scale what delivers the best results.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
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
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#00ff41]/5 to-transparent pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-l from-[#00ff41]/3 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="process-header text-center mb-24">
          <p className="text-xs tracking-[0.3em] text-[#00ff41] uppercase mb-6 font-body">
            How We Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
            From <span className="text-[#00ff41]">Analysis</span> to{' '}
            <span className="text-[#00ff41]">Growth</span>
            <br />
            in 4 Steps
          </h2>
        </div>

        {/* Timeline */}
        <div className="process-timeline relative">
          {/* Animated connecting line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5">
            <div className="process-line absolute top-0 left-0 right-0 h-full bg-gradient-to-r from-[#00ff41] via-[#00ff41] to-[#00ff41] origin-left" />
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
                  <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-2xl bg-black border border-white/10 flex items-center justify-center group-hover:border-[#00ff41]/50 group-hover:bg-[#00ff41]/10 transition-all duration-300">
                    <div className="text-[#00ff41]">
                      {step.icon}
                    </div>
                    {/* Step number overlay */}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#00ff41] text-black text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                  </div>

                  {/* Card content */}
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-6 text-center group-hover:border-[#00ff41]/20 group-hover:bg-[#00ff41]/5 transition-all duration-300">
                    <h3 className="font-display text-lg mb-3 text-white group-hover:text-[#00ff41] transition-colors">
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
            Your growth journey starts <span className="text-[#00ff41]">here</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
