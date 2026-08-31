import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";

export const metadata: Metadata = {
  // Deliberately doesn't repeat "The SocialHood" — the root layout's title
  // template ("%s | The SocialHood") already appends it; a page-level title
  // that includes it too rendered as a redundant double suffix well past
  // Google's ~70-char display guideline (caught by a live SEO audit,
  // 2026-07-29 — see agents/seo_agent/audit.py).
  title: "What We Build: Voice, Messaging, Automation & Software",
  description: "The four practices of an AI Systems Studio — voice agents, WhatsApp agents, automation, and the software underneath — and the systems they assemble into across furniture retail, real estate, clinics and interiors.",
  alternates: {
    canonical: "https://thesocialhood.in/services",
  },
  openGraph: {
    title: "What We Build | The SocialHood — AI Systems Studio",
    description: "Voice, Messaging, Automation and Software — four practices, assembled into systems that run.",
    url: "https://thesocialhood.in/services",
    images: ["/opengraph-image"],
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
