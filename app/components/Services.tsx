"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "Premium Web Development",
    description:
      "Custom websites built with enterprise-grade tech stacks. Not basic WordPress—platforms that Fortune 500 companies use. Lightning fast, SEO optimized, and scalable.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Business Automation",
    description:
      "Reduce manual work and employee costs with intelligent automation. Streamline operations, eliminate repetitive tasks, and get more done with fewer resources.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Guaranteed Lead Generation",
    description:
      "We guarantee a minimum increase in your daily queries. Our data-driven approach ensures consistent lead flow to grow your business.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "PPC & Ad Campaign Management",
    description:
      "Google Ads, Meta Ads, and LinkedIn campaigns designed for maximum ROI. We optimize every campaign to convert clicks into customers.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Growth Strategy & Roadmap",
    description:
      "Proven strategies and roadmaps from successful companies. We build your customized growth plan based on what actually works.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    number: "06",
    title: "Latest Technology Integration",
    description:
      "We implement the newest technologies in the market to give you the best competitive advantage and customer experience.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        ".services-header",
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

      // Service items stagger from alternating sides
      gsap.fromTo(
        ".service-row",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-container",
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
      id="services"
      className="py-32 px-6 bg-black relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[#00ff41]/5 to-transparent pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-gradient-to-l from-[#00ff41]/3 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="services-header text-center mb-20">
          <p className="text-xs tracking-[0.3em] text-[#00ff41] uppercase mb-6 font-body">
            What We Offer
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight max-w-3xl mx-auto">
            Complete Business{' '}
            <span className="text-[#00ff41]">Growth</span> Solutions
          </h2>
        </div>

        {/* Services - Alternating layout */}
        <div className="services-container space-y-4">
          {services.map((service, index) => (
            <div
              key={service.number}
              className={`service-row group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 md:p-10 hover:border-[#00ff41]/30 transition-all duration-500 ${
                index % 2 === 0 ? "md:mr-20" : "md:ml-20"
              }`}
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#00ff41]/0 via-[#00ff41]/5 to-[#00ff41]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                {/* Icon & Number */}
                <div className="flex items-center gap-6 md:w-48 shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-[#00ff41]/10 flex items-center justify-center text-[#00ff41] group-hover:bg-[#00ff41]/20 transition-colors">
                    {service.icon}
                  </div>
                  <span className="font-display text-4xl text-white/20 group-hover:text-[#00ff41] transition-colors">
                    {service.number}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-display text-2xl mb-3 text-white group-hover:text-[#00ff41] transition-colors">
                    {service.title}
                  </h3>
                  <p className="font-body text-white/50 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex w-12 h-12 rounded-full border border-white/10 items-center justify-center group-hover:bg-[#00ff41] group-hover:border-[#00ff41] group-hover:text-black transition-all duration-300">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>

              {/* Bottom line indicator */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#00ff41] group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
