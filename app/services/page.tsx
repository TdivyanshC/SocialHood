import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";

export const metadata: Metadata = {
  // Deliberately doesn't repeat "The SocialHood" — the root layout's title
  // template ("%s | The SocialHood") already appends it; a page-level title
  // that includes it too rendered as a redundant double suffix well past
  // Google's ~70-char display guideline (caught by a live SEO audit,
  // 2026-07-29 — see agents/seo_agent/audit.py).
  title: "Services: AI Voice Agents & Automation",
  description: "AI Voice Agents, WhatsApp AI Agents, custom automation, and CRM integrations for real estate, finance, e-commerce, and more across India.",
  alternates: {
    canonical: "https://thesocialhood.in/services",
  },
  openGraph: {
    title: "Services | AI Voice Agents, WhatsApp AI & Automation - The SocialHood",
    description: "AI Voice Agents, WhatsApp AI Agents, custom AI automation systems, custom software, and CRM integrations.",
    url: "https://thesocialhood.in/services",
    images: ["/og-image.jpg"],
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
