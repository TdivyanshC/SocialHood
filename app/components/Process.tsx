"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "Discovery Call",
    description: "We learn about your brand, goals, and audience.",
  },
  {
    number: "02",
    title: "Strategy Sprint",
    description: "We build a custom roadmap for your growth.",
  },
  {
    number: "03",
    title: "Content & Launch",
    description: "We create and publish content that converts.",
  },
  {
    number: "04",
    title: "Grow & Optimise",
    description: "We monitor, tweak, and scale what works.",
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

      gsap.fromTo(
        ".process-step",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".process-steps",
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
      className="py-32 px-6 max-w-5xl mx-auto"
    >
      <div className="process-header text-center mb-16">
        <p className="text-xs tracking-[0.2em] text-gold uppercase mb-4 font-body">
          How It Works
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">
          From Brief to Viral in 4 Steps
        </h2>
      </div>

      <div className="process-steps flex flex-col md:flex-row gap-8 md:gap-4">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="process-step flex-1 relative flex flex-col items-center text-center"
          >
            {/* Step number circle */}
            <div className="w-10 h-10 rounded-full border border-gold flex items-center justify-center text-gold font-display text-lg mb-4 relative z-10 bg-black">
              {step.number}
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-5 left-1/2 w-full border-t border-dashed border-white/10" />
            )}

            <h3 className="font-body text-sm font-medium mt-4 mb-2">
              {step.title}
            </h3>
            <p className="text-xs text-white/50">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
