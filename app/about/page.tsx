import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About: An AI Systems Studio", // see services/page.tsx comment re: title-template doubling
  description: "A small studio that designs, builds and then operates the systems doing a business's repeated work — voice, WhatsApp, automation, and the software underneath. How we work, and the one rule that costs us deals.",
  alternates: {
    canonical: "https://thesocialhood.in/about",
  },
  openGraph: {
    title: "About | The SocialHood — An AI Systems Studio",
    description: "A studio that designs, builds and then operates the systems doing a business's repeated work.",
    url: "https://thesocialhood.in/about",
    images: ["/opengraph-image"],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
