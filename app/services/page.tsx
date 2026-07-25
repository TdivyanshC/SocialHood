import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";

export const metadata: Metadata = {
  title: "Services | AI Voice Agents, WhatsApp AI & Automation - The SocialHood",
  description: "AI Voice Agents, WhatsApp AI Agents, custom AI automation systems, custom software, website development, SEO, and CRM integrations — for real estate, financial services, e-commerce, education, and manufacturing across India.",
  alternates: {
    canonical: "https://thesocialhood.in/services",
  },
  openGraph: {
    title: "Services | AI Voice Agents, WhatsApp AI & Automation - The SocialHood",
    description: "AI Voice Agents, WhatsApp AI Agents, custom AI automation systems, custom software, and CRM integrations.",
    url: "https://thesocialhood.in/services",
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
