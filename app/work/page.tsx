import type { Metadata } from "next";
import WorkPageClient from "./WorkPageClient";

export const metadata: Metadata = {
  title: "Our Work | Client Portfolio", // see services/page.tsx comment re: title-template doubling
  description: "Real estate, fintech, e-commerce, and enterprise businesses we've built AI systems, automation, and software for across India.",
  alternates: {
    canonical: "https://thesocialhood.in/work",
  },
  openGraph: {
    title: "Our Work | Client Portfolio - The SocialHood",
    description: "Real estate, fintech, e-commerce, and enterprise businesses we've built AI systems and automation for.",
    url: "https://thesocialhood.in/work",
    images: ["/og-image.jpg"],
  },
};

export default function WorkPage() {
  return <WorkPageClient />;
}
