import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us | The SocialHood - AI Systems & Automation Company",
  description: "The SocialHood is an AI-first business growth partner — AI voice agents, WhatsApp AI agents, and custom automation systems for businesses across India.",
  alternates: {
    canonical: "https://thesocialhood.in/about",
  },
  openGraph: {
    title: "About Us | The SocialHood - AI Systems & Automation Company",
    description: "The SocialHood is an AI-first business growth partner — AI voice agents, WhatsApp AI agents, and custom automation systems.",
    url: "https://thesocialhood.in/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
