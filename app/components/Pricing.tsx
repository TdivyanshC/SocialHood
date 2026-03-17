"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const plans = [
  {
    name: "Starter",
    price: "₹35,000",
    period: "/month",
    tagline: "Perfect for small businesses",
    description: "Everything you need to get started with digital growth.",
    features: [
      "Premium Web Development",
      "Basic Business Automation",
      "Google & Meta Ads Setup",
      "Basic Analytics Dashboard",
      "Monthly Strategy Call",
      "Email Support",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Growth",
    price: "₹75,000",
    period: "/month",
    tagline: "For businesses ready to scale",
    description: "Accelerate your growth with our most popular package.",
    features: [
      "Advanced Web Development",
      "Complete Business Automation",
      "Full PPC Campaign Management",
      "Guaranteed Lead Generation",
      "Real-time Analytics Dashboard",
      "Bi-weekly Strategy Calls",
      "Priority Support",
    ],
    cta: "Start Growing",
    featured: true,
  },
  {
    name: "Enterprise",
    price: "₹1,50,000",
    period: "/month",
    tagline: "Full-service growth solution",
    description: "Comprehensive solutions for large-scale enterprises.",
    features: [
      "Enterprise-grade Web Platform",
      "Custom Automation Solutions",
      "Multi-channel Ad Campaigns",
      "Guaranteed 3x Lead Increase",
      "Dedicated Account Manager",
      "Weekly Strategy Calls",
      "24/7 Priority Support",
      "Custom Integrations",
    ],
    cta: "Go Enterprise",
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
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
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
      className="py-32 px-6 bg-black relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-l from-[#00ff41]/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#00ff41]/3 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="pricing-header text-center mb-20">
          <p className="text-xs tracking-[0.3em] text-[#00ff41] uppercase mb-6 font-body">
            Pricing Plans
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
            Investment That{' '}
            <span className="text-[#00ff41]">Pays For Itself</span>
          </h2>
          <p className="text-white/50 text-sm max-w-xl mx-auto font-body">
            Choose the plan that fits your business needs. All plans include a free consultation call.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="pricing-grid grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card relative group ${
                plan.featured
                  ? "bg-gradient-to-b from-[#00ff41]/10 to-transparent border-2 border-[#00ff41]"
                  : "bg-white/[0.02] border border-white/10 hover:border-[#00ff41]/30"
              } rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2`}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#00ff41] text-black text-xs font-bold px-6 py-2 rounded-full flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm2.5 3a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm6.207.293a1 1 0 00-1.414 0l-6 6a1 1 0 101.414 1.414l6-6a1 1 0 000-1.414zM12.5 10a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                  </svg>
                  Most Popular
                </div>
              )}

              {/* Plan name */}
              <div className="text-center mb-6">
                <p className="text-xs tracking-[0.2em] uppercase text-[#00ff41] mb-2 font-body">
                  {plan.name}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-display text-5xl md:text-6xl font-light text-white">
                    {plan.price}
                  </span>
                  <span className="text-sm text-white/40">{plan.period}</span>
                </div>
                <p className="text-white/60 text-sm mt-2 font-body">{plan.tagline}</p>
              </div>

              {/* Description */}
              <p className="text-white/40 text-xs text-center mb-6 font-body">
                {plan.description}
              </p>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-white/70">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      plan.featured ? "bg-[#00ff41]/20 text-[#00ff41]" : "bg-white/10 text-white/40"
                    }`}>
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-4 rounded-full text-sm font-medium tracking-wide transition-all duration-300 ${
                  plan.featured
                    ? "bg-[#00ff41] text-black hover:bg-[#00ff41]/80 hover:shadow-lg hover:shadow-[#00ff41]/30"
                    : "border border-white/20 text-white hover:bg-white hover:text-black"
                }`}
              >
                {plan.cta}
              </button>

              {/* Glow effect for featured */}
              {plan.featured && (
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-[#00ff41]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="text-center mt-16">
          <p className="text-white/30 text-sm font-body">
            All prices are exclusive of GST. Need a custom solution?{' '}
            <a href="/contact" className="text-[#00ff41] hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
