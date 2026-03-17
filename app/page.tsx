"use client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Services from "./components/Services";
import Studio from "./components/Studio";
import Process from "./components/Process";
import Results from "./components/Results";
import Pricing from "./components/Pricing";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Studio />
      <Process />
      <Results />
      <Pricing />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
