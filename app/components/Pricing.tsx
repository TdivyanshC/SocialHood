"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: "Starter",
    price: "₹25,000",
    tagline: "Perfect for growing brands",
    features: [
      "Social Media Management (2 platforms)",
      "12 Posts per month",
      "Basic Analytics",
      "Monthly Strategy Call",
      "Community Management",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Growth",
    price: "₹50,000",
    tagline: "For brands ready to scale",
    features: [
      "Social Media Management (4 platforms)",
      "24 Posts per month",
      "Reels & Shorts Creation",
      "Advanced Analytics",
      "Bi-weekly Strategy Calls",
      "Influencer Outreach",
      "Paid Ad Management",
    ],
    cta: "Most Popular",
    featured: true,
  },
  {
    name: "Pro",
    price: "₹1,00,000",
    tagline: "Full-service solution",
    features: [
      "All Platforms Covered",
      "Unlimited Posts",
      "Full Content Production",
      "Real-time Analytics Dashboard",
      "Weekly Strategy Calls",
      "Dedicated Account Manager",
      "Custom Campaign Creation",
      "Priority Support",
    ],
    cta: "Go Pro",
    featured: false,
  },
];

export default function Pricing() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pricing-header",
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
        ".pricing-card",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".pricing-grid",
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
      id="pricing"
      className="py-32 px-6 max-w-5xl mx-auto"
    >
      <div className="pricing-header text-center mb-16">
        <p className="text-xs tracking-[0.2em] text-gold uppercase mb-4 font-body">
          Pricing
        </p>
        <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">
          Transparent Pricing. No Surprises.
        </h2>
      </div>

      <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`pricing-card relative ${
              plan.featured
                ? "bg-transparent border-2 border-gold"
                : "bg-surface border border-white/5"
            } rounded-xl p-8`}
          >
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-black text-xs px-4 py-1 rounded-full">
                Most Popular
              </div>
            )}

            <p className="text-xs tracking-widest uppercase text-gold mb-2 font-body">
              {plan.name}
            </p>

            <div className="flex items-baseline gap-1 mb-2">
              <span className="font-display text-5xl font-light">
                {plan.price}
              </span>
              <span className="text-sm text-white/40">/mo</span>
            </div>

            <p className="text-xs text-white/50 mb-8 font-body">{plan.tagline}</p>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-white/60">
                  <span className="text-gold text-xs">✦</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button
              className={`w-full py-3 rounded-full text-sm tracking-widest transition-all duration-300 ${
                plan.featured
                  ? "bg-gold text-black hover:bg-gold/80"
                  : "border border-white/20 hover:bg-white hover:text-black"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
