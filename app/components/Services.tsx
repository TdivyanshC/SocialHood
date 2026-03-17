"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "Social Media Management",
    description:
      "Full-service management of Instagram, LinkedIn, X, and YouTube.",
  },
  {
    number: "02",
    title: "Content Production",
    description:
      "Reels, carousels, graphics, and copy that stop the scroll.",
  },
  {
    number: "03",
    title: "Brand Strategy",
    description:
      "Positioning, tone of voice, visual identity — we build the playbook.",
  },
  {
    number: "04",
    title: "Influencer Campaigns",
    description:
      "We connect brands with the right voices for campaigns that feel real.",
  },
  {
    number: "05",
    title: "Paid Social Advertising",
    description:
      "Meta, Google, and LinkedIn ads managed for maximum ROAS.",
  },
  {
    number: "06",
    title: "Analytics & Growth",
    description:
      "Monthly audits, benchmarking, and strategy calls to keep you ahead.",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      gsap.fromTo(
        ".service-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-grid",
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
      className="py-32 px-6 max-w-6xl mx-auto"
    >
      <div className="services-header mb-16">
        <p className="text-xs tracking-[0.2em] text-gold uppercase mb-4 font-body">
          What We Do
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">
          Everything Your Brand Needs to Own the Feed
        </h2>
      </div>

      <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.number}
            className="service-card group relative bg-surface border border-white/5 rounded-xl p-8 hover:-translate-y-2 transition-all duration-300"
          >
            {/* Gold border on hover */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />

            <p className="text-xs text-white/20 mb-4 font-body">
              {service.number}
            </p>
            <h3 className="font-display text-xl mb-3">{service.title}</h3>
            <p className="font-body text-sm text-white/50 leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
