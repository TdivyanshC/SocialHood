"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function WorkPage() {
  const projects = [
    {
      id: 1,
      client: "Client Name 1",
      category: "Web Development",
      description: "Custom enterprise website with advanced automation.",
      image: "project-1",
    },
    {
      id: 2,
      client: "Client Name 2",
      category: "Lead Generation",
      description: "Full-funnel lead generation system with 5x growth.",
      image: "project-2",
    },
    {
      id: 3,
      client: "Client Name 3",
      category: "PPC Campaign",
      description: "Google & Meta ads with 300% ROI increase.",
      image: "project-3",
    },
    {
      id: 4,
      client: "Client Name 4",
      category: "Business Automation",
      description: "Complete workflow automation saving 80% time.",
      image: "project-4",
    },
    {
      id: 5,
      client: "Client Name 5",
      category: "Web Development",
      description: "E-commerce platform with AI integration.",
      image: "project-5",
    },
    {
      id: 6,
      client: "Client Name 6",
      category: "Growth Strategy",
      description: "Complete business transformation roadmap.",
      image: "project-6",
    },
  ];

  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-gold uppercase mb-6 font-body">
            Our Work
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Case Studies & <span style={{ color: '#00ff41' }}>Projects</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-body">
            Real results for real businesses. Here are some of the projects we've worked on 
            and the transformations we've delivered.
          </p>
        </div>
      </section>

      {/* Projects Grid - Placeholder */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-surface border border-white/5 rounded-xl overflow-hidden group hover:border-gold/50 transition-all duration-300"
              >
                {/* Image Placeholder */}
                <div className="aspect-video bg-black flex items-center justify-center relative overflow-hidden">
                  <div 
                    className="absolute inset-0 opacity-20"
                    style={{
                      background: 'radial-gradient(circle at center, #00ff41 0%, transparent 70%)',
                    }}
                  />
                  <div className="text-center relative z-10">
                    <p className="text-white/30 text-sm">{project.image}.jpg</p>
                    <p className="text-white/20 text-xs mt-1">(Upload your project image)</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-xs text-gold tracking-wider uppercase mb-2">
                    {project.category}
                  </p>
                  <h3 className="font-display text-xl mb-2">{project.client}</h3>
                  <p className="text-white/50 text-sm font-body">
                    {project.description}
                  </p>
                </div>

                {/* Hover effect */}
                <div className="h-0.5 bg-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl mb-6">Want to Be Our Next Success Story?</h2>
          <p className="text-white/50 mb-8 font-body">
            Let's discuss how we can transform your business just like we've done for hundreds of others.
          </p>
          <a
            href="/contact"
            className="inline-block bg-gold text-black font-medium px-8 py-4 rounded-full text-sm tracking-widest hover:bg-gold/80 transition-all duration-300"
          >
            Start Your Project →
          </a>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="font-display text-5xl text-gold">10x</p>
              <p className="text-white/50 text-sm mt-2">Avg ROI</p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-gold">300%</p>
              <p className="text-white/50 text-sm mt-2">Avg Growth</p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-gold">80%</p>
              <p className="text-white/50 text-sm mt-2">Cost Reduction</p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-gold">98%</p>
              <p className="text-white/50 text-sm mt-2">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
