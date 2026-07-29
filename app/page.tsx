import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "The SocialHood | AI Automation & Business Growth Agency, Delhi NCR",
  description: "AI-first business growth partner in Delhi NCR — AI voice agents, WhatsApp AI agents, and custom automation systems for businesses across India.",
  alternates: {
    canonical: "https://thesocialhood.in",
  },
  openGraph: {
    title: "The SocialHood | AI Automation & Business Growth Agency, Delhi NCR",
    description: "AI-first business growth partner — AI voice agents, WhatsApp AI agents, and custom automation systems for businesses across India.",
    url: "https://thesocialhood.in",
    siteName: "The SocialHood",
    images: ["/og-image.jpg"],
  },
};

export default function Home() {
  return <HomeClient />;
}
