"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: "web-development",
    title: "Premium Website Development",
    description: "Custom websites built with enterprise-grade tech stacks. Not basic WordPress—platforms that Fortune 500 companies use. Lightning fast, SEO optimized, and scalable.",
    features: [
      "Custom Next.js & React Development",
      "Enterprise-grade security",
      "Lightning-fast performance",
      "SEO optimized architecture",
      "Scalable cloud infrastructure",
      "Mobile-first design",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "app-development",
    title: "App Development",
    description: "Native and cross-platform mobile applications that deliver seamless user experiences. From iOS to Android, we build apps that engage your customers.",
    features: [
      "iOS & Android Development",
      "Cross-platform React Native",
      "API Integration",
      "App Store Optimization",
      "Real-time features",
      "Push notifications",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "ai-video",
    title: "AI Video Production",
    description: "Cutting-edge AI-powered video content that captures attention and drives engagement. Create stunning visuals with the power of artificial intelligence.",
    features: [
      "AI-powered video editing",
      "Motion graphics",
      "3D animations",
      "Social media reels",
      "Product videos",
      "Brand storytelling",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "automation",
    title: "Business Automation",
    description: "Reduce manual work and employee costs with intelligent automation. Streamline operations, eliminate repetitive tasks, and get more done with fewer resources.",
    features: [
      "Workflow automation",
      "CRM integration",
      "Lead management",
      "Email automation",
      "Report generation",
      "Team collaboration",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    id: "ads",
    title: "Google & Meta Ads Campaign",
    description: "Google Ads and Meta Ads campaigns designed for maximum ROI. We optimize every campaign to convert clicks into customers.",
    features: [
      "Campaign strategy",
      "Ad copywriting",
      "Audience targeting",
      "A/B testing",
      "Performance tracking",
      "ROI optimization",
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
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
            Complete Business{' '}
            <span className="text-white">Growth</span> Solutions
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-body">
            From premium web development to business automation and lead generation—we provide 
            end-to-end digital solutions that help your business scale.
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
