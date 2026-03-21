"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";

const clients = [
  {
    id: 1,
    name: "KleoniVerse",
    website: "https://kleoniverse.com",
    image: "/images/kleoni.jpg",
    description: "Fashion & Lifestyle Brand",
  },
   {
    id: 2,
    name: "PaisaPriest",
    website: "https://paisapriest.com",
    image: "/images/paisa.jpg",
    description: "Financial Services",
  },
  {
    id: 3,
    name: "SRLD Enterprises",
    website: "https://yourlaptop.in",
    image: "/images/SRLD.jpg",
    description: "Tech Solutions & Services",
  },
  {
    id: 4,
    name: "Swadeshi Hind Party",
    website: "https://swadeshihindparty.in",
    image: "/images/swadeshi.jpg",
    description: "Political Organization",
  },
  {
    id: 5,
    name: "Coursary",
    website: "https://crackcuet.co.in",
    image: "/images/coursary.jpeg",
    description: "Education & Learning Platform",
  },
  {
    id: 6,
    name: "Fitness Store",
    website: "https://thelionsgym.vercel.app",
    image: "/images/fitness.jpg",
    description: "Fitness & Wellness",
  },
  {
    id: 7,
    name: "Trust Acres",
    website: "https://trustacres.com",
    image: "/images/trust.jpg",
    description: "Real Estate & Property",
  },
  {
    id: 8,
    name: "Elecment Design Fab",
    website: "https://elecmentdesignfab.com",
    image: "/images/elecment.jpg",
    description: "Interior Design & Architecture",
  },
];

export default function WorkPage() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-white uppercase mb-6 font-body">
            Our Work
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Client <span style={{ color: '#00B98E' }}>Portfolio</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-body">
            Real results for real businesses. Here are some of the projects we've worked on 
            and the transformations we've delivered.
          </p>
        </div>
      </section>

      {/* Clients Grid - 3D Cards */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {clients.map((client) => (
              <a
                key={client.id}
                href={client.website}
                target="__blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <div className="bg-black border border-white/10 w-full h-auto rounded-xl overflow-hidden transition-all duration-300 group-hover:border-[#00B98E] group-hover:shadow-[0_0_30px_rgba(0,185,142,0.15)]">
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={client.image}
                      alt={client.name}
                      fill
                      className="object-cover transition-all duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#00B98E] transition-colors">
                      {client.name}
                    </h3>
                    <p className="text-white/60 text-sm mt-2">
                      {client.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="font-display text-5xl text-white">50+</p>
              <p className="text-white/50 text-sm mt-2">Projects Completed</p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-white">10x</p>
              <p className="text-white/50 text-sm mt-2">Avg ROI</p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-white">300%</p>
              <p className="text-white/50 text-sm mt-2">Avg Growth</p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-white">98%</p>
              <p className="text-white/50 text-sm mt-2">Client Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-zinc-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-4xl mb-6">Want to Be Our Next Success Story?</h2>
          <p className="text-white/50 mb-8 font-body">
            Let's discuss how we can transform your business just like we've done for hundreds of others.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-[#00B98E] text-black font-medium px-8 py-4 rounded-full text-sm tracking-widest hover:bg-[#00B98E]/80 transition-all duration-300"
          >
            Start Your Project →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

