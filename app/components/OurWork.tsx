"use client";

import { useState, useRef, useEffect } from "react";
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
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-24 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-xs tracking-[0.2em] text-[#00ff41] uppercase mb-4 font-body">
              Our Work
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light">
              Featured <span style={{ color: "#00ff41" }}>Projects</span>
            </h2>
          </div>
          <a
            href="/work"
            className="text-sm text-white/60 hover:text-[#00ff41] transition-colors flex items-center gap-2"
          >
            View All Work →
          </a>
        </div>

        {/* Carousel Navigation */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              canScrollLeft
                ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                : "bg-zinc-900/50 text-zinc-600 cursor-not-allowed"
            }`}
            aria-label="Scroll left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
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
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              canScrollRight
                ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                : "bg-zinc-900/50 text-zinc-600 cursor-not-allowed"
            }`}
            aria-label="Scroll right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
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
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 px-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {clients.map((client) => (
              <div key={client.id} className="flex-shrink-0 w-[350px]">
                <CardContainer className="inter-var">
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
                    <div className="p-5">
                      <CardItem
                        translateZ="50"
                        className="text-lg font-bold text-neutral-600 dark:text-white"
                      >
                        {client.name}
                      </CardItem>
                      <CardItem
                        as="p"
                        translateZ="60"
                        className="text-neutral-500 text-sm max-w-sm mt-1 dark:text-neutral-300"
                      >
                        {client.description}
                      </CardItem>

                      <div className="flex justify-between items-center mt-4">
                        <CardItem
                          translateZ={20}
                          as="a"
                          href={client.website}
                          target="__blank"
                          className="px-3 py-1.5 rounded-lg text-xs font-normal dark:text-white text-gray-600 hover:text-[#00ff41] transition-colors cursor-pointer"
                        >
                          Visit Site →
                        </CardItem>
                        <CardItem
                          translateZ={20}
                          className="text-xs text-gray-400 dark:text-gray-500"
                        >
                          {client.website.replace("https://", "")}
                        </CardItem>
                      </div>
                    </div>
                  </CardBody>
                </CardContainer>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
