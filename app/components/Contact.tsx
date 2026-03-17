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
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-content",
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
    console.log("Form submitted:", formData);
    // Add form submission logic here
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-32 px-6 relative"
    >
      {/* Noise overlay */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      <div className="contact-content relative z-10 max-w-2xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
          Ready to Build Something the Feed Won't Forget?
        </h2>
        <p className="text-white/50 text-sm mb-12 font-body">
          Let's create something extraordinary together.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <input
                type="text"
                name="brandName"
                placeholder="Brand Name"
                value={formData.brandName}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <input
                type="tel"
                name="whatsapp"
                placeholder="WhatsApp Number"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <select
              name="service"
              value={formData.service}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/20 py-3 text-sm text-white focus:border-gold focus:outline-none transition-colors"
              required
            >
              <option value="" className="bg-black">
                What do you need help with?
              </option>
              <option value="social-media" className="bg-black">
                Social Media Management
              </option>
              <option value="content" className="bg-black">
                Content Creation
              </option>
              <option value="strategy" className="bg-black">
                Brand Strategy
              </option>
              <option value="ads" className="bg-black">
                Paid Ads
              </option>
              <option value="full-package" className="bg-black">
                Full Package
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-gold text-black font-medium px-10 py-4 rounded-full text-sm tracking-widest hover:bg-gold/80 transition-all duration-300"
          >
            Book a Free Strategy Call →
          </button>
        </form>

        <div className="flex justify-center gap-8 mt-12">
          <a
            href="mailto:hello@thesocialhood.in"
            className="text-xs text-white/50 hover:text-gold transition-colors"
          >
            hello@thesocialhood.in
          </a>
          <a
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/50 hover:text-gold transition-colors"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  );
}
