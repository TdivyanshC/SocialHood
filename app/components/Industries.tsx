"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const industries = [
  { name: "Real Estate & PropTech" },
  { name: "Financial Services" },
  { name: "E-commerce" },
  { name: "Education" },
  { name: "Manufacturing" },
  { name: "Service Businesses" },
  { name: "Custom Enterprise Solutions" },
];

export default function Industries() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".industries-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        ".industry-pill",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: ".industries-grid", start: "top 85%" },
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
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        <div className="industries-header mb-16">
          <p className="text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-6 font-body">
            Who We Work With
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">
            Industries We <span className="text-white">Serve</span>
          </h2>
        </div>

        <div className="industries-grid flex flex-wrap justify-center gap-4">
          {industries.map((industry) => (
            <div
              key={industry.name}
              className="industry-pill px-6 py-4 rounded-full border border-white/10 bg-white/[0.02] text-white/70 font-body text-sm md:text-base hover:border-[#00B98E]/40 hover:text-white transition-colors duration-300"
            >
              {industry.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
