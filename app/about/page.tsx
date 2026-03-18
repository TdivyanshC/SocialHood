"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const sectionRef = useRef<HTMLElement>(null);

  const values = [
    {
      title: "Client Success First",
      description: "We measure our success by your growth. When you succeed, we succeed.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: "Trust Over Transactions",
      description: "We believe in building lasting relationships. Trust is earned, not bought.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      title: "Technology Excellence",
      description: "We use only the latest and most advanced technologies for optimal results.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      title: "Proven Strategies",
      description: "Our methods are tested and refined through years of successful implementations.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-header",
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
        ".about-content",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-content-section",
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".value-card",
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".values-grid",
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
          <p className="about-header text-xs tracking-[0.3em] text-[#00ff41] uppercase mb-6 font-body">
            About Us
          </p>
          <h1 className="about-header font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            We Get Rich By Making Our{' '}
            <span className="text-[#00ff41]">Clients Richer</span>
          </h1>
          <p className="about-header text-white/50 text-lg max-w-2xl mx-auto font-body">
            We are your partners in growth, committed to delivering real results through 
            cutting-edge technology and proven strategies.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6">
        <div className="about-content-section max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="about-content">
              <h2 className="font-display text-4xl mb-6">
                Our <span className="text-[#00ff41]">Story</span>
              </h2>
              <p className="text-white/60 font-body leading-relaxed mb-6">
                The SocialHood Company was founded with a simple belief: businesses deserve access to the 
                same enterprise-grade tools and strategies that Fortune 500 companies use.
              </p>
              <p className="text-white/60 font-body leading-relaxed">
                Today, we help businesses of all sizes transform their operations, increase 
                leads, and scale faster using the latest technology and proven growth strategies.
              </p>
            </div>

            {/* Stats */}
            <div className="about-content">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 text-center hover:border-[#00ff41]/30 transition-colors">
                  <p className="font-display text-5xl text-[#00ff41] mb-2">10x</p>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Average ROI</p>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 text-center hover:border-[#00ff41]/30 transition-colors">
                  <p className="font-display text-5xl text-[#00ff41] mb-2">300%</p>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Lead Growth</p>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 text-center hover:border-[#00ff41]/30 transition-colors">
                  <p className="font-display text-5xl text-[#00ff41] mb-2">80%</p>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Cost Reduction</p>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8 text-center hover:border-[#00ff41]/30 transition-colors">
                  <p className="font-display text-5xl text-[#00ff41] mb-2">24/7</p>
                  <p className="text-xs text-white/40 uppercase tracking-wider">Support</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-black relative">
        {/* Background accent */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#00ff41]/5 to-transparent pointer-events-none -translate-y-1/2" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl mb-4">
              Our <span className="text-[#00ff41]">Values</span>
            </h2>
            <p className="text-white/50 font-body">The principles that guide everything we do</p>
          </div>
          
          <div className="values-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="value-card group bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-[#00ff41]/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-[#00ff41]/10 flex items-center justify-center text-[#00ff41] mb-4 group-hover:bg-[#00ff41] group-hover:text-black transition-all duration-300">
                  {value.icon}
                </div>
                <h3 className="font-display text-lg mb-2">{value.title}</h3>
                <p className="text-white/50 text-sm font-body">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl mb-8">
            Our <span className="text-[#00ff41]">Philosophy</span>
          </h2>
          <blockquote className="text-2xl md:text-3xl font-display text-white/80 leading-relaxed mb-8">
            "We believe in building trust and relationships with clients first. 
            Money is a byproduct of delivering exceptional value."
          </blockquote>
          <p className="text-[#00ff41] text-sm tracking-widest uppercase">
            — The SocialHood Company Team
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00ff41]/5 via-[#00ff41]/10 to-[#00ff41]/5 rounded-3xl" />
          
          <div className="relative z-10 bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-12 md:p-16">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              Let's Build Something <span className="text-[#00ff41]">Great</span>
            </h2>
            <p className="text-white/50 mb-8 font-body">
              Ready to transform your business? We'd love to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#00ff41] text-black font-medium px-10 py-4 rounded-full text-sm tracking-wide hover:bg-[#00ff41]/80 hover:shadow-lg hover:shadow-[#00ff41]/30 transition-all duration-300"
            >
              Get in Touch →
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
