"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const clients = [
   {
    id: 1,
    name: "PaisaPriest",
    website: "https://paisapriest.com",
    image: "/images/paisa.jpg",
    description: "Financial Services",
  },
  {
    id: 2,
    name: "KleoniVerse",
    website: "https://kleoniverse.com",
    image: "/images/kleoni.jpg",
    description: "Fashion & Lifestyle Brand",
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
    name: "Elecment Design Fab",
    website: "https://elecmentdesignfab.com",
    image: "/images/elecment.jpg",
    description: "Interior Design & Architecture",
  },
  {
    id: 7,
    name: "Fitness Store",
    website: "https://thelionsgym.vercel.app",
    image: "/images/fitness.jpg",
    description: "Fitness & Wellness",
  },
  {
    id: 8,
    name: "Trust Acres",
    website: "https://trustacres.com",
    image: "/images/trust.jpg",
    description: "Real Estate & Property",
  },
];

export default function OurWork() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 450;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#00B98E] uppercase mb-4 font-body">
              Our Work
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light">
              Featured <span className="text-white">Projects</span>
            </h2>
          </div>
          <Link 
            href="/contact"
            className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium overflow-hidden transition-all duration-300"
            style={{ background: 'transparent', border: '1px solid #00B98E' }}
          >
            <span className="absolute inset-0 w-full h-full bg-[#00B98E] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 text-[#00B98E] group-hover:text-black transition-colors duration-300">View Our Work</span>
            <span className="relative z-10 flex items-center text-[#00B98E] group-hover:text-black transition-colors duration-300">
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>

        {/* Carousel Navigation */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border ${
              canScrollLeft
                ? "border-[#00B98E] text-[#00B98E] hover:bg-[#00B98E] hover:text-black"
                : "border-white/10 text-white/30 cursor-not-allowed"
            }`}
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border ${
              canScrollRight
                ? "border-[#00B98E] text-[#00B98E] hover:bg-[#00B98E] hover:text-black"
                : "border-white/10 text-white/30 cursor-not-allowed"
            }`}
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          {/* Carousel Container */}
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide pb-8 pt-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {clients.map((client) => (
              <a
                key={client.id}
                href={client.website}
                target="__blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-[85vw] md:w-[350px] block group"
              >
                <div className="bg-black border border-white/10 w-full h-auto rounded-2xl overflow-hidden transition-all duration-300 group-hover:border-[#00B98E] group-hover:shadow-[0_0_30px_rgba(0,185,142,0.15)]">
                    <div className="w-full">
                      <div className="relative aspect-[16/10] w-full overflow-hidden">
                        <Image
                          src={client.image}
                          alt={client.name}
                          fill
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, 350px"
                          className="object-cover transition-all duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="text-lg font-bold text-white group-hover:text-[#00B98E] transition-colors">
                        {client.name}
                      </div>
                      <p className="text-white/60 text-sm mt-1">
                        {client.description}
                      </p>
                    </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

