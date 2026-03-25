"use client";

import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";

// Lazy load components for better performance
const About = dynamic(() => import("./components/About"), {
  loading: () => <div className="h-[400px] bg-black" />,
});

const Services = dynamic(() => import("./components/Services"), {
  loading: () => <div className="h-[400px] bg-black" />,
});

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

const Footer = dynamic(() => import("./components/Footer"), {
  loading: () => <div className="h-[200px] bg-black" />,
});

export default function HomeClient() {
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
