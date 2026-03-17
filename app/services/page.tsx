"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesPage() {
  const sectionRef = useRef<HTMLElement>(null);

  const services = [
    {
      id: "web-development",
      title: "Premium Web Development",
      description: "Custom websites built with enterprise-grade tech stacks. Not basic WordPress—platforms that Fortune 500 companies use.",
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
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "automation",
      title: "Business Automation",
      description: "Reduce manual work and employee costs with intelligent automation. Streamline operations and get more done with fewer resources.",
      features: [
        "Workflow automation",
        "Customer relationship management",
        "Automated lead nurturing",
        "Inventory management",
        "Financial automation",
        "Integration with existing tools",
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "lead-generation",
      title: "Guaranteed Lead Generation",
      description: "We guarantee a minimum increase in your daily queries. Our data-driven approach ensures consistent lead flow.",
      features: [
        "Multi-channel lead capture",
        "Landing page optimization",
        "Lead scoring & qualification",
        "Automated follow-ups",
        "CRM integration",
        "Real-time analytics",
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "ppc",
      title: "PPC & Ad Campaign Management",
      description: "Google Ads, Meta Ads, and LinkedIn campaigns designed for maximum ROI. We optimize every campaign to convert.",
      features: [
        "Google Ads management",
        "Meta (Facebook/Instagram) ads",
        "LinkedIn advertising",
        "A/B testing & optimization",
        "Conversion tracking",
        "Detailed performance reports",
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      ),
      color: "from-orange-500 to-red-500",
    },
    {
      id: "growth-strategy",
      title: "Growth Strategy & Roadmap",
      description: "Proven strategies and roadmaps from successful companies. We build your customized growth plan.",
      features: [
        "Market analysis",
        "Competitor research",
        "Growth roadmap creation",
        "KPI definition",
        "Monthly strategy sessions",
        "Execution guidance",
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      color: "from-indigo-500 to-violet-500",
    },
    {
      id: "technology",
      title: "Latest Technology Integration",
      description: "We implement the newest technologies to give you the best competitive advantage and customer experience.",
      features: [
        "AI integration",
        "Chatbot implementation",
        "Analytics setup",
        "API development",
        "Third-party integrations",
        "Technology consulting",
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: "from-yellow-500 to-amber-500",
    },
  ];

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
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
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
    <main className="bg-black min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-[#00ff41]/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-t from-[#00ff41]/5 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <p className="services-header text-xs tracking-[0.3em] text-[#00ff41] uppercase mb-6 font-body">
            Our Services
          </p>
          <h1 className="services-header font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Complete Business{' '}
            <span className="text-[#00ff41]">Growth</span> Solutions
          </h1>
          <p className="services-header text-white/50 text-lg max-w-2xl mx-auto font-body">
            From premium web development to business automation and lead generation—we provide 
            everything you need to scale your business with cutting-edge technology.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section ref={sectionRef} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="service-card group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:border-[#00ff41]/30 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                {/* Icon */}
                <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h2 className="font-display text-xl mb-3 text-white group-hover:text-[#00ff41] transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-white/50 font-body text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/40">
                        <div className="w-5 h-5 rounded-full bg-[#00ff41]/10 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-[#00ff41]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom border */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#00ff41]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00ff41]/5 via-[#00ff41]/10 to-[#00ff41]/5 rounded-3xl" />
          
          <div className="relative z-10 bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-12 md:p-16">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Ready to <span className="text-[#00ff41]">Transform</span> Your Business?
            </h2>
            <p className="text-white/50 mb-8 font-body max-w-lg mx-auto">
              Let's discuss how we can help you achieve your business goals with our proven growth strategies.
            </p>
            <a
              href="/contact"
              className="inline-block bg-[#00ff41] text-black font-medium px-10 py-4 rounded-full text-sm tracking-wide hover:bg-[#00ff41]/80 hover:shadow-lg hover:shadow-[#00ff41]/30 transition-all duration-300"
            >
              Book a Free Consultation →
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
