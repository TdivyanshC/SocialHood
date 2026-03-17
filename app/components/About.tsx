"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".about-content",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      gsap.fromTo(
        ".about-stat",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".about-stat",
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
      id="about"
      className="py-32 px-6 max-w-6xl mx-auto"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="about-content">
          <p className="text-xs tracking-[0.2em] text-gold uppercase mb-6 font-body">
            The Hood
          </p>
          <h2 className="font-display text-5xl font-light leading-tight mb-8">
            We're not an agency. We're your brand's street team.
          </h2>
          <p className="font-body text-white/60 leading-relaxed">
            The SocialHood Company was built for brands that want to be felt, not
            just seen. We combine cultural intelligence with data-driven
            strategy to build communities that convert. Based in India. Built
            for the world.
          </p>
        </div>

        {/* Stats */}
        <div className="about-stat flex flex-col items-start">
          <div className="text-[12rem] font-display font-light leading-none text-transparent -webkit-text-stroke-1 text-gold">
            150+
          </div>
          <p className="text-xs text-gold tracking-widest uppercase mt-2 mb-12 font-body">
            Brands Grown
          </p>

          <div className="text-6xl font-display font-light text-transparent -webkit-text-stroke-1 text-gold">
            4.2Cr+
          </div>
          <p className="text-xs text-gold tracking-widest uppercase mt-2 font-body">
            Organic Reach Delivered
          </p>
        </div>
      </div>
    </section>
  );
}
