"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";

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
    name: "Trust Acres",
    website: "https://trustacres.com",
    image: "/images/trust.jpg",
    description: "Real Estate & Property",
  },
  {
    id: 3,
    name: "PaisaPriest",
    website: "https://paisapriest.com",
    image: "/images/paisa.jpg",
    description: "Financial Services",
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
    name: "Elecment Design Fab",
    website: "https://elecmentdesignfab.com",
    image: "/images/elecment.jpg",
    description: "Interior Design & Architecture",
  },
  {
    id: 6,
    name: "Coursary",
    website: "https://crackcuet.co.in",
    image: "/images/coursary.jpeg",
    description: "Education & Learning Platform",
  },
  {
    id: 7,
    name: "SRLD Enterprises",
    website: "https://yourlaptop.in",
    image: "/images/SRLD.jpg",
    description: "Tech Solutions & Services",
  },
  {
    id: 8,
    name: "Fitness Store",
    website: "https://thelionsgym.vercel.app",
    image: "/images/fitness.jpg",
    description: "Fitness & Wellness",
  },
];

export default function WorkPage() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-xs tracking-[0.2em] text-[#00ff41] uppercase mb-6 font-body">
            Our Work
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
            Client <span style={{ color: '#00ff41' }}>Portfolio</span>
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
              <CardContainer key={client.id} className="inter-var">
                <CardBody className="bg-gray-50 relative group/card dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl border p-0 overflow-hidden">
                  {/* Image with translateZ for floating effect */}
                  <CardItem translateZ="100" className="w-full mt-0">
                    <div className="relative aspect-video w-full overflow-hidden rounded-t-xl">
                      <Image
                        src={client.image}
                        alt={client.name}
                        fill
                        className="object-cover transition-all duration-300 group-hover/card:shadow-2xl"
                      />
                    </div>
                  </CardItem>

                  {/* Content */}
                  <div className="p-6">
                    <CardItem
                      translateZ="50"
                      className="text-xl font-bold text-neutral-600 dark:text-white"
                    >
                      {client.name}
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                    >
                      {client.description}
                    </CardItem>
                    
                    <div className="flex justify-between items-center mt-6">
                      <CardItem
                        translateZ={20}
                        as="a"
                        href={client.website}
                        target="__blank"
                        className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white text-gray-600 hover:text-[#00ff41] transition-colors cursor-pointer"
                      >
                        Visit Site →
                      </CardItem>
                      <CardItem
                        translateZ={20}
                        className="text-xs text-gray-400 dark:text-gray-500"
                      >
                        {client.website.replace('https://', '')}
                      </CardItem>
                    </div>
                  </div>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="font-display text-5xl text-[#00ff41]">50+</p>
              <p className="text-white/50 text-sm mt-2">Projects Completed</p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-[#00ff41]">10x</p>
              <p className="text-white/50 text-sm mt-2">Avg ROI</p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-[#00ff41]">300%</p>
              <p className="text-white/50 text-sm mt-2">Avg Growth</p>
            </div>
            <div className="text-center">
              <p className="font-display text-5xl text-[#00ff41]">98%</p>
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
            className="inline-block bg-[#00ff41] text-black font-medium px-8 py-4 rounded-full text-sm tracking-widest hover:bg-[#00ff41]/80 transition-all duration-300"
          >
            Start Your Project →
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
