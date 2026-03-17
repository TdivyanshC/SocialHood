"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { 
    value: "10x", 
    label: "Average ROI Increase",
    description: "For every ₹1 invested",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  { 
    value: "300%", 
    label: "Average Lead Growth",
    description: "Within first 90 days",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  { 
    value: "80%", 
    label: "Cost Reduction",
    description: "Via automation & AI",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  { 
    value: "24/7", 
    label: "Support Available",
    description: "Always here for you",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const testimonials = [
  {
    quote:
      "SocialHood transformed our business with a custom website and automation tools. Our operational costs dropped by 60% and leads increased 5x in just 3 months.",
    author: "Rajesh Kumar",
    title: "CEO, TechStart Solutions",
  },
  {
    quote:
      "The guaranteed lead generation is real. They delivered 3x more queries than our previous agency. The tech stack they built for us is world-class.",
    author: "Anita Sharma",
    title: "Director, GrowthMart",
  },
  {
    quote:
      "Finally, a company that focuses on results over vanity metrics. Their PPC campaigns doubled our sales in 60 days. Highly recommended.",
    author: "Vikram Singh",
    title: "Founder, AutoFlow",
  },
];

export default function Results() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".results-header",
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

      // Animated counter for metrics
      gsap.fromTo(
        ".metric-card",
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".metrics-container",
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".testimonial-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".testimonials-grid",
            start: "top 90%",
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
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-b from-[#00ff41]/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-t from-[#00ff41]/3 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="results-header text-center mb-20">
          <p className="text-xs tracking-[0.3em] text-[#00ff41] uppercase mb-6 font-body">
            Results That Matter
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-4">
            <span className="text-[#00ff41]">Real Numbers.</span> Real Growth.{' '}
            <span className="text-[#00ff41]">Real ROI.</span>
          </h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto font-body">
            We don't just promise results—we deliver measurable outcomes that impact your bottom line.
          </p>
        </div>

        {/* Metrics */}
        <div className="metrics-container grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20">
          {metrics.map((metric, index) => (
            <div 
              key={metric.value} 
              className="metric-card group relative bg-white/[0.02] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-[#00ff41]/30 hover:bg-[#00ff41]/5 transition-all duration-300"
            >
              {/* Background glow on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-[#00ff41]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#00ff41]/10 flex items-center justify-center text-[#00ff41] mb-4 group-hover:bg-[#00ff41] group-hover:text-black transition-all duration-300">
                  {metric.icon}
                </div>

                {/* Value */}
                <p className="font-display text-5xl md:text-6xl font-light text-[#00ff41] mb-2">
                  {metric.value}
                </p>

                {/* Label */}
                <p className="font-body text-sm text-white font-medium mb-1">
                  {metric.label}
                </p>

                {/* Description */}
                <p className="text-xs text-white/40">
                  {metric.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <p className="text-center text-xs tracking-[0.2em] text-white/30 uppercase mb-10 font-body">
            What Our Clients Say
          </p>
        </div>

        <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="testimonial-card group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:border-[#00ff41]/20 transition-all duration-300"
            >
              {/* Quote icon */}
              <div className="font-display text-7xl text-[#00ff41]/20 absolute top-4 left-6 leading-none">
                "
              </div>

              <div className="relative z-10 pt-8">
                <p className="font-body text-sm text-white/70 leading-relaxed italic mb-6">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#00ff41]/20 flex items-center justify-center text-[#00ff41] font-bold text-sm">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{testimonial.author}</p>
                    <p className="text-xs text-white/40">{testimonial.title}</p>
                  </div>
                </div>
              </div>

              {/* Bottom border */}
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#00ff41]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
