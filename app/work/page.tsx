import type { Metadata } from "next";
import WorkPageClient from "./WorkPageClient";

export const metadata: Metadata = {
  title: "Our Work: The Systems, Opened Up", // see services/page.tsx comment re: title-template doubling
  description: "Systems opened up in full — the voice and WhatsApp system in production at Krishna Furniture, plus the site-visit, front-desk and quote-desk systems we build for real estate developers, clinics and interior firms.",
  alternates: {
    canonical: "https://thesocialhood.in/work",
  },
  openGraph: {
    title: "Our Work | The Systems, Opened Up - The SocialHood",
    description: "Systems in production and the systems we build — what leaks, what they take over, and what the owner sees.",
    url: "https://thesocialhood.in/work",
    images: ["/opengraph-image"],
  },
};

export default function WorkPage() {
  return <WorkPageClient />;
}
