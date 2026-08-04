import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us | AI Systems & Automation Company", // see services/page.tsx comment re: title-template doubling
  description: "The SocialHood is an AI Systems Studio — we build and run AI voice agents, WhatsApp AI agents, and custom automation systems for businesses across India.",
  alternates: {
    canonical: "https://thesocialhood.in/about",
  },
  openGraph: {
    title: "About Us | The SocialHood - AI Systems & Automation Company",
    description: "The SocialHood is an AI Systems Studio — we build and run AI voice agents, WhatsApp AI agents, and custom automation systems.",
    url: "https://thesocialhood.in/about",
    images: ["/og-image.jpg"],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
