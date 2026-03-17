"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal for all elements
      gsap.fromTo(
        ".about-eyebrow",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        ".about-heading",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      gsap.fromTo(
        ".about-text",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      // Feature cards stagger
      gsap.fromTo(
        ".feature-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-32 px-6 bg-black relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#00ff41]/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#00ff41]/3 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Content */}
        <div className="text-center mb-20">
          <p className="about-eyebrow text-xs tracking-[0.3em] text-[#00ff41] uppercase mb-6 font-body">
            Our Philosophy
          </p>
          <h2 className="about-heading font-display text-5xl md:text-6xl font-light leading-tight mb-8 text-white max-w-4xl mx-auto">
            We Believe In Building{' '}
            <span className="text-[#00ff41]">Trust First.</span>
            <br />
            Money Second.
          </h2>
          <p className="about-text font-body text-white/50 leading-relaxed max-w-2xl mx-auto text-lg">
            At The SocialHood Company, we measure our success by{' '}
            <span className="text-[#00ff41]">your growth</span>. 
            Our strategy is simple: when our clients succeed, we succeed. We use cutting-edge 
            technology and proven growth strategies—the same tools used by Fortune 500 companies—
            tailored for businesses of all sizes.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="feature-card p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:border-[#00ff41]/30 transition-colors duration-300">
            <div className="w-12 h-12 rounded-full bg-[#00ff41]/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#00ff41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-display text-xl text-white mb-3">Trust-Based Approach</h3>
            <p className="font-body text-white/40 text-sm leading-relaxed">
              We build lasting relationships through transparency, honest communication, and delivering on our promises.
            </p>
          </div>

          <div className="feature-card p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:border-[#00ff41]/30 transition-colors duration-300">
            <div className="w-12 h-12 rounded-full bg-[#00ff41]/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#00ff41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="font-display text-xl text-white mb-3">Proven Growth</h3>
            <p className="font-body text-white/40 text-sm leading-relaxed">
              Data-driven strategies that actually work. We focus on metrics that matter—revenue, conversions, and ROI.
            </p>
          </div>

          <div className="feature-card p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm hover:border-[#00ff41]/30 transition-colors duration-300">
            <div className="w-12 h-12 rounded-full bg-[#00ff41]/10 flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#00ff41]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-display text-xl text-white mb-3">Partner Mindset</h3>
            <p className="font-body text-white/40 text-sm leading-relaxed">
              We don't just work for you—we work with you. Your success is our success, and we treat it that way.
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="mt-20 text-center">
          <p className="font-display text-3xl md:text-4xl font-light text-white/30">
            Your growth is our <span className="text-[#00ff41]">priority</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
