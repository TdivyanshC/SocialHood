"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ServicesPage() {
  const services = [
    {
      id: "web-development",
      title: "Premium Web Development",
      description: "Custom websites built with enterprise-grade tech stacks. Not basic WordPress—platforms that Fortune 500 companies use.",
      features: [
        "Custom Next.js & React Development",
        "Enterprise-grade security",
        "Lightning-fast performance",
        "SEO optimized architecture",
        "Scalable cloud infrastructure",
        "Mobile-first design",
      ],
      icon: "🌐",
    },
    {
      id: "automation",
      title: "Business Automation",
      description: "Reduce manual work and employee costs with intelligent automation. Streamline operations and get more done with fewer resources.",
      features: [
        "Workflow automation",
        "Customer relationship management",
        "Automated lead nurturing",
        "Inventory management",
        "Financial automation",
        "Integration with existing tools",
      ],
      icon: "⚙️",
    },
    {
      id: "lead-generation",
      title: "Guaranteed Lead Generation",
      description: "We guarantee a minimum increase in your daily queries. Our data-driven approach ensures consistent lead flow.",
      features: [
        "Multi-channel lead capture",
        "Landing page optimization",
        "Lead scoring & qualification",
        "Automated follow-ups",
        "CRM integration",
        "Real-time analytics",
      ],
      icon: "📈",
    },
    {
      id: "ppc",
      title: "PPC & Ad Campaign Management",
      description: "Google Ads, Meta Ads, and LinkedIn campaigns designed for maximum ROI. We optimize every campaign to convert.",
      features: [
        "Google Ads management",
        "Meta (Facebook/Instagram) ads",
        "LinkedIn advertising",
        "A/B testing & optimization",
        "Conversion tracking",
        "Detailed performance reports",
      ],
      icon: "📢",
    },
    {
      id: "growth-strategy",
      title: "Growth Strategy & Roadmap",
      description: "Proven strategies and roadmaps from successful companies. We build your customized growth plan.",
      features: [
        "Market analysis",
        "Competitor research",
        "Growth roadmap creation",
        "KPI definition",
        "Monthly strategy sessions",
        "Execution guidance",
      ],
      icon: "🗺️",
    },
    {
      id: "technology",
      title: "Latest Technology Integration",
      description: "We implement the newest technologies to give you the best competitive advantage and customer experience.",
      features: [
        "AI integration",
        "Chatbot implementation",
        "Analytics setup",
        "API development",
        "Third-party integrations",
        "Technology consulting",
      ],
      icon: "🚀",
    },
  ];

  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-gold uppercase mb-6 font-body">
            Our Services
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Complete Business <span style={{ color: '#00ff41' }}>Growth</span> Solutions
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-body">
            From premium web development to business automation and lead generation—we provide 
            everything you need to scale your business with cutting-edge technology.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="bg-surface border border-white/5 rounded-xl p-8 hover:border-gold/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{service.icon}</div>
                <h2 className="font-display text-2xl mb-4">{service.title}</h2>
                <p className="text-white/60 font-body mb-6">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex gap-2 text-sm text-white/50">
                      <span className="text-gold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-surface border border-white/5 rounded-xl p-12">
          <h2 className="font-display text-3xl mb-4">Ready to Get Started?</h2>
          <p className="text-white/50 mb-8 font-body">
            Let's discuss how we can help transform your business.
          </p>
          <a
            href="#contact"
            className="inline-block bg-gold text-black font-medium px-8 py-4 rounded-full text-sm tracking-widest hover:bg-gold/80 transition-all duration-300"
          >
            Book a Free Consultation →
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
