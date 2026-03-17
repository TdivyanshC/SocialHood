"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AboutPage() {
  const values = [
    {
      title: "Client Success First",
      description: "We measure our success by your growth. When you succeed, we succeed.",
      icon: "🎯",
    },
    {
      title: "Trust Over Transactions",
      description: "We believe in building lasting relationships. Trust is earned, not bought.",
      icon: "🤝",
    },
    {
      title: "Technology Excellence",
      description: "We use only the latest and most advanced technologies for optimal results.",
      icon: "💡",
    },
    {
      title: "Proven Strategies",
      description: "Our methods are tested and refined through years of successful implementations.",
      icon: "📊",
    },
  ];

  const team = [
    {
      name: "Your Name",
      role: "Founder & CEO",
      bio: "Visionary leader driving business transformation.",
    },
    {
      name: "Team Member",
      role: "Tech Lead",
      bio: "Expert in enterprise-grade web development.",
    },
    {
      name: "Team Member",
      role: "Growth Strategist",
      bio: "Specialist in scaling businesses through technology.",
    },
  ];

  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-gold uppercase mb-6 font-body">
            About Us
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            We Get Rich By Making Our <span style={{ color: '#00ff41' }}>Clients Richer</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-body">
            We are your partners in growth, committed to delivering real results through 
            cutting-edge technology and proven strategies.
          </p>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl mb-6">Our Story</h2>
              <p className="text-white/60 font-body leading-relaxed mb-6">
                The SocialHood Company was founded with a simple belief: businesses deserve access to the 
                same enterprise-grade tools and strategies that Fortune 500 companies use.
              </p>
              <p className="text-white/60 font-body leading-relaxed">
                Today, we help businesses of all sizes transform their operations, increase 
                leads, and scale faster using the latest technology and proven growth strategies.
              </p>
            </div>
            <div className="bg-surface border border-white/5 rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="font-display text-5xl text-gold">10x</p>
                  <p className="text-xs text-white/50 mt-2">Average ROI</p>
                </div>
                <div className="text-center">
                  <p className="font-display text-5xl text-gold">300%</p>
                  <p className="text-xs text-white/50 mt-2">Lead Growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl mb-4">Our Values</h2>
            <p className="text-white/50 font-body">The principles that guide everything we do</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-display text-xl mb-3">{value.title}</h3>
                <p className="text-white/50 text-sm font-body">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl mb-6">Our Philosophy</h2>
          <blockquote className="text-2xl md:text-3xl font-display text-white/80 leading-relaxed mb-8">
            "We believe in building trust and relationships with clients first. 
            Money is a byproduct of delivering exceptional value."
          </blockquote>
          <p className="text-gold text-sm tracking-widest uppercase">— The SocialHood Company Team</p>
        </div>
      </section>

      <section className="py-20 px-6 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl mb-4">Our Team</h2>
            <p className="text-white/50 font-body">Meet the experts behind your success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-black border border-white/5 rounded-xl p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-white/10 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl">👤</span>
                </div>
                <h3 className="font-display text-xl mb-2">{member.name}</h3>
                <p className="text-gold text-sm mb-4">{member.role}</p>
                <p className="text-white/50 text-sm font-body">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl mb-6">Let's Build Something Great</h2>
          <p className="text-white/50 mb-8 font-body">
            Ready to transform your business? We'd love to hear from you.
          </p>
          <a
            href="#contact"
            className="inline-block bg-gold text-black font-medium px-8 py-4 rounded-full text-sm tracking-widest hover:bg-gold/80 transition-all duration-300"
          >
            Get in Touch →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
