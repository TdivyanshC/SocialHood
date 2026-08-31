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
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-white/3 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Content */}
        <div className="text-center mb-20">
          <p className="about-eyebrow text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-6 font-body">
            What We Mean By A System
          </p>
          <h2 className="about-heading font-display text-4xl md:text-6xl font-light leading-[1.08] mb-8 text-white max-w-4xl mx-auto">
            A tool waits to be opened.
            <br />
            <span className="text-white/45">A system does the work.</span>
          </h2>
          <p className="about-text font-body text-white/50 leading-relaxed max-w-2xl mx-auto text-lg">
            Most of what a company runs on cannot be bought off a shelf. It is the specific way
            this business answers, qualifies, follows up, records and reports — and today most of
            that runs on somebody remembering to do it. We build that layer as software, shaped
            around how you already operate, and then we run it.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="feature-card p-8 border border-white/10 rounded-2xl bg-white/[0.03] backdrop-blur-sm hover:border-[#00B98E]/30 transition-colors duration-300">
            <p className="font-display text-3xl text-white/15 mb-6">01</p>
            <h3 className="font-display text-xl text-white mb-3">Shaped around your process</h3>
            <p className="font-body text-white/45 text-sm leading-relaxed">
              We do not install a product and ask your team to change to fit it. The system is
              built around the way this business already sells, books and records — including
              the parts that only make sense here.
            </p>
          </div>

          <div className="feature-card p-8 border border-white/10 rounded-2xl bg-white/[0.03] backdrop-blur-sm hover:border-[#00B98E]/30 transition-colors duration-300">
            <p className="font-display text-3xl text-white/15 mb-6">02</p>
            <h3 className="font-display text-xl text-white mb-3">It runs unattended</h3>
            <p className="font-body text-white/45 text-sm leading-relaxed">
              No queue to work down, no dashboard anyone has to remember to open. The system does
              the work and then tells you what it did — at 2am, on a Sunday, on the four-hundredth
              conversation of the month.
            </p>
          </div>

          <div className="feature-card p-8 border border-white/10 rounded-2xl bg-white/[0.03] backdrop-blur-sm hover:border-[#00B98E]/30 transition-colors duration-300">
            <p className="font-display text-3xl text-white/15 mb-6">03</p>
            <h3 className="font-display text-xl text-white mb-3">We stay on it after launch</h3>
            <p className="font-body text-white/45 text-sm leading-relaxed">
              A system handed over and forgotten drifts within a month. We read what it produced,
              tune it against real conversations, and remain accountable for what it does — not
              only for shipping it.
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="mt-20 text-center">
          <p className="font-display text-3xl md:text-4xl font-light text-white/30">
            Not a project that ends. A system that <span className="text-white">keeps running</span>.
          </p>
        </div>
      </div>
    </section>
  );
}

