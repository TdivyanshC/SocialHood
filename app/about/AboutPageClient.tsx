"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    title: "Show, Don't Claim",
    description:
      "Every number on this site belongs to a named engagement. If we cannot say where a figure came from, it does not go up.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Scope Before Build",
    description:
      "What the system will do and what it will not is written down and agreed before anyone opens an editor. Surprises belong in the scoping call, not the invoice.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
  },
  {
    title: "We Run What We Build",
    description:
      "A system handed over and forgotten drifts within a month. We read the transcripts, tune the scripts, and stay on the hook for what happens after launch.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  {
    title: "The Honest No",
    description:
      "If a system will not pay for itself at your lead volume, we say so on the first call. Selling one anyway costs us the case study we actually need.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
    ),
  },
];

export default function AboutPageClient() {
  const sectionRef = useRef<HTMLElement>(null);

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
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-[#00B98E]/10 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-t from-[#00B98E]/5 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <p className="about-header text-xs tracking-[0.3em] text-white uppercase mb-6 font-body">
            About Us
          </p>
          <h1 className="about-header font-display text-5xl md:text-6xl font-light leading-tight mb-6 text-white">
            An AI Systems Studio
          </h1>
          <p className="about-header text-white/50 text-lg max-w-2xl mx-auto font-body leading-relaxed">
            A small team that designs, builds, and then operates the systems doing a
            business&apos;s repeated work. We keep the number of clients low on purpose —
            running a system properly is not the same as shipping one.
          </p>
        </div>
      </section>

      {/* Story Section — deliberately no stat tiles. Every number that belonged
          here was either invented or trivia, and trivia is not credibility. */}
      <section className="py-20 px-6">
        <div className="about-content-section max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="about-content lg:col-span-4">
              <h2 className="font-display text-3xl md:text-4xl font-light text-white leading-tight">
                How we
                <br />
                got here
              </h2>
            </div>

            <div className="about-content lg:col-span-8 space-y-7">
              <p className="text-white/70 font-body text-lg md:text-xl leading-relaxed">
                We started out building websites and running ad campaigns. The same thing kept
                happening on every account: the marketing worked, the leads arrived, and then
                they sat. Nobody reached them fast enough, and nothing followed up.
              </p>
              <p className="text-white/50 font-body leading-relaxed">
                Fixing the campaign never fixed that. The gap was not in the demand — it was in
                everything that had to happen after it, and all of that was running on people
                remembering to do it between other work.
              </p>
              <p className="text-white/50 font-body leading-relaxed">
                So we started building the missing half: agents that answer and call, agents
                that follow up, automation for the work behind them, and a portal so an owner
                could finally see what happened to every lead they had paid for.
              </p>
              <p className="text-white/50 font-body leading-relaxed">
                That is the whole studio now. The websites and platforms are still something we
                build — they are just no longer the point.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 bg-black relative">
        {/* Background accent */}
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#00B98E]/5 to-transparent pointer-events-none -translate-y-1/2" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl mb-4 text-white">
              How we work
            </h2>
            <p className="text-white/50 font-body">Four rules we hold to, including the expensive one</p>
          </div>
          
          <div className="values-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div 
                key={index} 
                className="value-card group bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-[#00B98E]/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-[#00B98E]/10 flex items-center justify-center text-[#00B98E] mb-4 group-hover:bg-[#00B98E] group-hover:text-black transition-all duration-300">
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
          <h2 className="font-display text-4xl mb-8 text-white">
            What we believe
          </h2>
          <blockquote className="text-2xl md:text-3xl font-display text-white/80 leading-relaxed mb-8">
            &ldquo;A system you have to remember to use is not a system. The work should
            happen whether anyone is watching or not.&rdquo;
          </blockquote>
          <p className="text-white text-sm tracking-widest uppercase">
            — The SocialHood
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00B98E]/5 via-[#00B98E]/10 to-[#00B98E]/5 rounded-3xl" />
          
          <div className="relative z-10 bg-black/50 backdrop-blur-sm border border-white/10 rounded-3xl p-12 md:p-16">
            <h2 className="font-display text-3xl md:text-4xl mb-4 text-white">
              See what we actually run
            </h2>
            <p className="text-white/50 mb-8 font-body leading-relaxed">
              Three systems in production, opened up — what each one does, how it runs, and
              what it changed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/work"
                className="inline-block bg-[#00B98E] text-black font-medium px-10 py-4 rounded-full text-sm tracking-wide hover:bg-[#00B98E]/80 hover:shadow-lg hover:shadow-[#00B98E]/30 transition-all duration-300"
              >
                See the work &rarr;
              </Link>
              <Link
                href="/contact"
                className="inline-block px-8 py-4 rounded-full text-sm tracking-wide text-white/60 border border-white/10 hover:border-white/25 hover:text-white transition-colors duration-300"
              >
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
