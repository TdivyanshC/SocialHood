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
    service: "",
    budget: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-gold uppercase mb-6 font-body">
            Contact Us
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Let's <span style={{ color: '#00ff41' }}>Transform</span> Your Business
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
                      className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors"
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
                      className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors"
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
                      className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors"
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
                      className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:border-gold focus:outline-none transition-colors"
                    >
                      <option value="" className="bg-black">Select Service *</option>
                      <option value="web-development" className="bg-black">Premium Web Development</option>
                      <option value="automation" className="bg-black">Business Automation</option>
                      <option value="lead-generation" className="bg-black">Lead Generation</option>
                      <option value="ppc" className="bg-black">PPC Campaign Management</option>
                      <option value="growth-strategy" className="bg-black">Growth Strategy</option>
                      <option value="full-package" className="bg-black">Full Growth Package</option>
                    </select>
                  </div>
                  <div>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm text-white focus:border-gold focus:outline-none transition-colors"
                    >
                      <option value="" className="bg-black">Monthly Budget</option>
                      <option value="starter" className="bg-black">₹35,000 - ₹50,000</option>
                      <option value="growth" className="bg-black">₹50,000 - ₹1,00,000</option>
                      <option value="enterprise" className="bg-black">₹1,00,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <textarea
                    name="message"
                    placeholder="Tell us about your business and goals..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 rounded-lg py-3 px-4 text-sm text-white placeholder:text-white/30 focus:border-gold focus:outline-none transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gold text-black font-medium py-4 rounded-lg text-sm tracking-widest hover:bg-gold/80 transition-all duration-300"
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
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <span className="text-gold">📧</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Email</p>
                      <p className="text-white">hello@socialhood.in</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <span className="text-gold">📱</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Phone</p>
                      <p className="text-white">+91 XXXXXXXXXX</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                      <span className="text-gold">📍</span>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-wider">Location</p>
                      <p className="text-white">India</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-surface border border-white/5 rounded-xl p-8">
                <h3 className="font-display text-xl mb-4">Business Hours</h3>
                <div className="space-y-2 text-white/60 font-body">
                  <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
                  <p>Saturday: 10:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>

              <div className="bg-surface border border-white/5 rounded-xl p-8">
                <h3 className="font-display text-xl mb-4">Quick Response</h3>
                <p className="text-white/50 font-body mb-4">
                  We typically respond within 24 hours. For urgent inquiries, WhatsApp us.
                </p>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold hover:underline"
                >
                  <span>💬</span> WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
