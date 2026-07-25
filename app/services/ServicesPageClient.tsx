"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Industries from "../components/Industries";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: "ai-voice-agents",
    title: "AI Voice Agents",
    description: "Inbound and outbound calling, lead qualification, appointment booking, customer support, and follow-ups — handled by AI, around the clock.",
    features: [
      "Inbound & outbound calling",
      "Lead qualification",
      "Appointment booking",
      "Customer support",
      "Automated follow-ups",
      "CRM logging",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    id: "whatsapp-ai-agents",
    title: "WhatsApp AI Agents",
    description: "Built on the Meta Cloud API — automated conversations, lead nurturing, support, and CRM workflows running directly inside WhatsApp.",
    features: [
      "Meta Cloud API integration",
      "Automated conversations",
      "Lead nurturing",
      "Customer support",
      "CRM workflow triggers",
      "Broadcast & follow-up flows",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    id: "ai-automation",
    title: "Custom AI Automation Systems",
    description: "Replace repetitive employee tasks — research, scraping, reporting, emailing, CRM updates, workflow automation — with systems that just run.",
    features: [
      "Research & data scraping",
      "Automated reporting",
      "Email automation",
      "CRM updates",
      "Workflow orchestration",
      "Task handoffs to humans when needed",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    id: "custom-software",
    title: "Custom Software Development",
    description: "Web apps, dashboards, SaaS platforms, CRMs, and internal tools built for how your business actually operates.",
    features: [
      "Web apps & dashboards",
      "SaaS platforms",
      "Custom CRMs",
      "Internal tools",
      "API development",
      "Cloud infrastructure",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
      </svg>
    ),
  },
  {
    id: "website-product-development",
    title: "Website & Product Development",
    description: "Modern, fast, scalable builds on Next.js, React, Node.js, MongoDB, and Supabase — not templated WordPress.",
    features: [
      "Next.js & React development",
      "Node.js backends",
      "MongoDB & Supabase",
      "Enterprise-grade security",
      "Lightning-fast performance",
      "Mobile-first design",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "seo-organic-growth",
    title: "SEO & Organic Growth",
    description: "Systems built for long-term organic traffic, not just a rankings report — content, technical SEO, and measurable growth.",
    features: [
      "Technical SEO audits",
      "Content systems",
      "Keyword strategy",
      "On-page optimization",
      "Organic traffic growth",
      "Search Console reporting",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 18L9 11.25l4.306 4.306a11.95 11.95 0 015.814-5.518l2.74-1.22m0 0l-5.94-2.281m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    id: "landing-pages-funnels",
    title: "Landing Pages & Sales Funnels",
    description: "Conversion-focused landing pages and complete funnels designed to turn traffic into pipeline, not just impressions.",
    features: [
      "Conversion-focused design",
      "A/B testing",
      "Funnel strategy",
      "Copywriting",
      "Analytics tracking",
      "CRM handoff",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
      </svg>
    ),
  },
  {
    id: "crm-integrations",
    title: "CRM Integrations",
    description: "Odoo, custom CRMs, WhatsApp, and third-party APIs — connected so leads and data flow automatically, not manually.",
    features: [
      "Odoo integrations",
      "Custom CRM builds",
      "WhatsApp & API sync",
      "Lead routing",
      "Data pipelines",
      "Automated handoffs",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
  {
    id: "startup-consulting",
    title: "Startup Consulting",
    description: "Product strategy, automation roadmaps, and scalable architecture for founders building something new.",
    features: [
      "Product strategy",
      "Automation roadmaps",
      "Scalable architecture",
      "Tech stack guidance",
      "Go-to-market support",
      "Ongoing advisory",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
];

export default function ServicesPageClient() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".service-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".services-container",
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="min-h-screen bg-black pt-32 pb-20">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-6 font-body">
            What We Offer
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            AI Systems Built{' '}
            <span className="text-white">For Growth</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-body">
            We help businesses scale using AI, automation, and custom software instead of just
            delivering websites or marketing campaigns.
          </p>
        </div>

        <div className="services-container space-y-8">
          {services.map((service, index) => (
            <div
              key={service.id}
              className="service-card group relative bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 hover:border-[#00B98E]/30 transition-all duration-500"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#00B98E]/0 via-[#00B98E]/5 to-[#00B98E]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-3">
                  <div className="w-20 h-20 rounded-2xl bg-[#00B98E]/10 flex items-center justify-center text-[#00B98E] group-hover:bg-[#00B98E]/20 transition-colors">
                    {service.icon}
                  </div>
                </div>
                
                <div className="md:col-span-6">
                  <h2 className="font-display text-3xl mb-4 text-white group-hover:text-[#00B98E] transition-colors">
                    {service.title}
                  </h2>
                  <p className="font-body text-white/60 leading-relaxed mb-4">
                    {service.description}
                  </p>
                  <ul className="grid grid-cols-2 gap-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-white/50 text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00B98E]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="md:col-span-3 flex md:justify-end">
                  <Link 
                    href="/contact"
                    className="group/btn relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium overflow-hidden transition-all duration-300"
                    style={{ background: 'transparent', border: '1px solid #00B98E' }}
                  >
                    <span className="absolute inset-0 w-full h-full bg-[#00B98E] transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out" />
                    <span className="relative z-10 text-[#00B98E] group-hover/btn:text-black transition-colors duration-300">Get Started</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-white/50 mb-6">Ready to transform your business?</p>
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#00B98E] text-black font-medium hover:bg-[#00D9A6] transition-colors"
          >
            Discuss Your Project
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
      <Footer />
    </section>
  );
}
