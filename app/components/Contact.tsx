"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    brandName: "",
    email: "",
    whatsapp: "",
    service: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-header",
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
        ".contact-form",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Thank you! We'll be in touch soon.");
    }, 1500);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-32 px-6 bg-black relative overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-b from-[#00ff41]/10 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gradient-to-t from-[#00ff41]/5 to-transparent pointer-events-none" />

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="contact-content relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="contact-header text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-[#00ff41] uppercase mb-6 font-body">
            Get Started
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-4">
            Ready to{' '}
            <span className="text-[#00ff41]">Transform</span> Your Business?
          </h2>
          <p className="text-white/50 text-sm font-body">
            Let's build your growth roadmap together.
          </p>
        </div>

        {/* Form */}
        <div className="contact-form">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Brand Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-5 text-sm text-white placeholder:text-white/30 focus:border-[#00ff41] focus:outline-none focus:bg-[#00ff41]/5 transition-all"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="brandName"
                  placeholder="Brand Name *"
                  value={formData.brandName}
                  onChange={handleChange}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-5 text-sm text-white placeholder:text-white/30 focus:border-[#00ff41] focus:outline-none focus:bg-[#00ff41]/5 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email & WhatsApp Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address *"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-5 text-sm text-white placeholder:text-white/30 focus:border-[#00ff41] focus:outline-none focus:bg-[#00ff41]/5 transition-all"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="tel"
                  name="whatsapp"
                  placeholder="WhatsApp Number *"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-5 text-sm text-white placeholder:text-white/30 focus:border-[#00ff41] focus:outline-none focus:bg-[#00ff41]/5 transition-all"
                  required
                />
              </div>
            </div>

            {/* Service Select */}
            <div className="relative">
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl py-4 px-5 text-sm text-white focus:border-[#00ff41] focus:outline-none focus:bg-[#00ff41]/5 transition-all appearance-none cursor-pointer"
                required
              >
                <option value="" className="bg-black text-white/50">
                  What do you need help with? *
                </option>
                <option value="web-development" className="bg-black text-white">
                  Premium Web Development
                </option>
                <option value="automation" className="bg-black text-white">
                  Business Automation
                </option>
                <option value="lead-generation" className="bg-black text-white">
                  Lead Generation
                </option>
                <option value="ppc" className="bg-black text-white">
                  PPC Campaign Management
                </option>
                <option value="full-package" className="bg-black text-white">
                  Full Growth Package
                </option>
              </select>
              {/* Custom arrow */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#00ff41] text-black font-medium py-5 rounded-xl text-sm tracking-wide hover:bg-[#00ff41]/90 hover:shadow-lg hover:shadow-[#00ff41]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Book a Free Growth Consultation
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Contact Info */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mt-10">
            <a
              href="mailto:hello@thesocialhood.in"
              className="flex items-center gap-3 text-white/40 hover:text-[#00ff41] transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00ff41]/10 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-sm font-body">hello@thesocialhood.in</span>
            </a>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-white/40 hover:text-[#00ff41] transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#00ff41]/10 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.218 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <span className="text-sm font-body">WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
