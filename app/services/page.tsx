"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
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
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "app-development",
      title: "App Development",
      description: "Native and cross-platform mobile applications that deliver seamless user experiences. From iOS to Android, we build apps that engage your customers.",
      features: [
        "iOS App Development",
        "Android App Development",
        "Cross-platform (React Native)",
        "App Store Optimization",
        "UI/UX Design",
        "API Integration",
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: "from-purple-500 to-pink-500",
    },
    {
      id: "ai-video",
      title: "AI Video Production",
      description: "Cutting-edge AI-powered video content that captures attention and drives engagement. Create stunning visuals with the power of artificial intelligence.",
      features: [
        "AI-generated video content",
        "Video editing & post-production",
        "Motion graphics",
        "Animation services",
        "Social media video clips",
        "Brand video storytelling",
      ],
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "automation",
      title: "Business Automation",
      description: "Reduce manual work and employee costs with intelligent automation. Streamline operations, eliminate repetitive tasks, and get more done with fewer resources.",
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
      id: "ads",
      title: "Google & Meta Ads Campaign",
      description: "Google Ads and Meta Ads campaigns designed for maximum ROI. We optimize every campaign to convert clicks into customers.",
      features: [
        "Google Ads management",
        "Meta (Facebook/Instagram) ads",
        "Campaign optimization",
        "A/B testing",
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
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-[#00B98E]/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-t from-[#00B98E]/5 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <p className="services-header text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-6 font-body">
            What We Offer
          </p>
          <h1 className="services-header font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Complete Business{' '}
            <span className="text-white">Growth</span> Solutions
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
                className="service-card group relative bg-white/[0.02] border border-white/5 rounded-2xl p-8 hover:border-[#00B98E]/30 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                {/* Icon */}
                <div className={`relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h2 className="font-display text-xl mb-3 text-white group-hover:text-[#00B98E] transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-white/50 font-body text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/40">
                        <div className="w-5 h-5 rounded-full bg-[#00B98E]/10 flex items-center justify-center shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-[#00B98E]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom border */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#00B98E]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00B98E]/5 via-[#00B98E]/10 to-[#00B98E]/5 rounded-3xl" />
          
          <div className="relative z-10 bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-12 md:p-16">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Ready to <span className="text-[#00B98E]">Transform</span> Your Business?
            </h2>
            <p className="text-white/50 mb-8 font-body max-w-lg mx-auto">
              Let's discuss how we can help you achieve your business goals with our proven growth strategies.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#00B98E] text-black font-medium px-10 py-4 rounded-full text-sm tracking-wide hover:bg-[#00B98E]/80 hover:shadow-lg hover:shadow-[#00B98E]/30 transition-all duration-300"
            >
              Book a Free Consultation →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

