"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`New Contact Form Submission from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nCompany: ${formData.company}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:team@thesocialhood.in?subject=${subject}&body=${body}`;
  };

  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-[#00B98E] uppercase mb-6 font-body">
            Contact Us
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Let's <span style={{ color: '#FFFFFF' }}>Transform</span> Your Business
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-body">
            Ready to scale your business with cutting-edge technology and proven strategies? 
            Get in touch and let's discuss your growth roadmap.
          </p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="bg-surface border border-white/5 rounded-xl p-8">
              <h2 className="font-display text-2xl mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-white/30 focus:border-[#00B98E] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="company"
                      placeholder="Company Name"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-white/30 focus:border-[#00B98E] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-white/30 focus:border-[#00B98E] focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-white/30 focus:border-[#00B98E] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Tell us about your business and goals..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-white/30 focus:border-[#00B98E] focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#00B98E] text-black font-medium py-4 rounded-lg text-sm tracking-widest hover:bg-[#00B98E]/80 transition-all duration-300"
                >
                  Send Message →
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-surface border border-white/5 rounded-xl p-8">
                <h3 className="font-display text-xl mb-4">Get in Touch</h3>
                <p className="text-white/50 font-body mb-6">
                  Have questions? We'd love to hear from you. Fill out the form or reach out directly.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#00B98E]/10 flex items-center justify-center">
                      <span className="text-[#00B98E]">📧</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Email</p>
                      <p className="text-white">team@thesocialhood.in</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#00B98E]/10 flex items-center justify-center">
                      <span className="text-[#00B98E]">📱</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Phone</p>
                      <p className="text-white">+91 9198310770</p>
                      <p className="text-white">+91 8799712556</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#00B98E]/10 flex items-center justify-center">
                      <span className="text-[#00B98E]">📍</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Location</p>
                      <p className="text-white">Delhi, India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-white/5 rounded-xl p-8">
                <h3 className="font-display text-xl mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a
                    href="https://instagram.com/thesocialhood"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-[#00B98E]/10 flex items-center justify-center text-[#00B98E] hover:bg-[#00B98E] hover:text-black transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/company/thesocialhood"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-full bg-[#00B98E]/10 flex items-center justify-center text-[#00B98E] hover:bg-[#00B98E] hover:text-black transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>

              <div className="bg-surface border border-white/5 rounded-xl p-8">
                <h3 className="font-display text-xl mb-4">Book a Meeting</h3>
                <p className="text-white/50 font-body mb-4">
                  Schedule a free consultation call with us.
                </p>
                <div 
                  className="calendly-inline-widget" 
                  data-url="https://calendly.com/thesocialhood08/new-meeting"
                  style={{ minWidth: '320px', height: '400px' }}
                ></div>
                <script 
                  type="text/javascript" 
                  src="https://assets.calendly.com/assets/external/widget.js" 
                  async 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

