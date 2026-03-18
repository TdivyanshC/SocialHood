"use client";

import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Services from "./components/Services";

// Lazy load heavy components for better performance
const Studio = dynamic(() => import("./components/Studio"), {
  loading: () => <div className="h-screen bg-black" />,
});

const OurWork = dynamic(() => import("./components/OurWork"), {
  loading: () => <div className="h-[400px] bg-black" />,
});

const Process = dynamic(() => import("./components/Process"), {
  loading: () => <div className="h-[400px] bg-black" />,
});

const Results = dynamic(() => import("./components/Results"), {
  loading: () => <div className="h-[400px] bg-black" />,
});

const Pricing = dynamic(() => import("./components/Pricing"), {
  loading: () => <div className="h-[400px] bg-black" />,
});

const FAQ = dynamic(() => import("./components/FAQ"), {
  loading: () => <div className="h-[400px] bg-black" />,
});

const Contact = dynamic(() => import("./components/Contact"), {
  loading: () => <div className="h-[400px] bg-black" />,
});

const Footer = dynamic(() => import("./components/Footer"), {
  loading: () => <div className="h-[200px] bg-black" />,
});

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Studio />
      <OurWork />
      <Process />
      <Results />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
