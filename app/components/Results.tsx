"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { value: "3.2x", label: "Average engagement rate increase" },
  { value: "68%", label: "Average follower growth in 90 days" },
  { value: "150+", label: "Brands grown" },
  { value: "4.2Cr+", label: "Organic reach delivered" },
];

const testimonials = [
  {
    quote:
      "The SocialHood transformed our Instagram presence completely. Within 3 months, we went from 2K to 50K followers with genuine engagement.",
    author: "Rahul Sharma",
    title: "Founder, UrbanThreads",
  },
  {
    quote:
      "They don't just post—they understand our brand voice better than we do. Our campaign went viral and sales increased by 200%.",
    author: "Priya Menon",
    title: "CMO, SpiceRoute",
  },
  {
    quote:
      "Finally, an agency that combines creativity with data. Every decision is backed by insights, and the results speak for themselves.",
    author: "Arjun Kapoor",
    title: "CEO, FitLife",
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

      gsap.fromTo(
        ".metric-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".metrics-grid",
            start: "top 85%",
          },
        }
      );

      gsap.fromTo(
        ".testimonial-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
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
      className="py-32 px-6 max-w-6xl mx-auto"
    >
      <div className="results-header text-center mb-20">
        <p className="text-xs tracking-[0.2em] text-gold uppercase mb-4 font-body">
          Results
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">
          Numbers That Speak Louder Than Pitches
        </h2>
      </div>

      {/* Metrics */}
      <div className="metrics-grid grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
        {metrics.map((metric) => (
          <div key={metric.value} className="metric-card text-center">
            <p className="font-display text-6xl font-light text-gold">
              {metric.value}
            </p>
            <p className="text-xs text-white/40 mt-2 font-body">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="testimonial-card bg-surface border border-white/5 rounded-xl p-8"
          >
            <p className="font-display text-6xl text-gold/30">"</p>
            <p className="font-body text-sm text-white/70 leading-relaxed italic mb-6">
              {testimonial.quote}
            </p>
            <p className="text-sm font-medium">{testimonial.author}</p>
            <p className="text-xs text-white/40">{testimonial.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
