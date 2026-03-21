"use client";

import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

// Lazy load components with SSR disabled for faster initial page load
const About = dynamic(() => import("./components/About"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-black" />,
});

const Services = dynamic(() => import("./components/Services"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-black" />,
});

const Studio = dynamic(() => import("./components/Studio"), {
  ssr: false,
  loading: () => <div className="h-screen bg-black" />,
});

const OurWork = dynamic(() => import("./components/OurWork"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-black" />,
});

const Process = dynamic(() => import("./components/Process"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-black" />,
});

const Results = dynamic(() => import("./components/Results"), {
  ssr: false,
  loading: () => <div className="h-[400px] bg-black" />,
});

const Footer = dynamic(() => import("./components/Footer"), {
  ssr: false,
  loading: () => <div className="h-[200px] bg-black" />,
});

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Studio />
      <OurWork />
      <Process />
      <Results />
      <Footer />
    </main>
  );
}

