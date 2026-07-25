import type { Metadata } from "next";
import WorkPageClient from "./WorkPageClient";

export const metadata: Metadata = {
  title: "Our Work | Client Portfolio - The SocialHood",
  description: "Real estate, fintech, e-commerce, and enterprise businesses we've built AI systems, automation, and software for — including Trust Acres and others across India.",
  alternates: {
    canonical: "https://thesocialhood.in/work",
  },
  openGraph: {
    title: "Our Work | Client Portfolio - The SocialHood",
    description: "Real estate, fintech, e-commerce, and enterprise businesses we've built AI systems and automation for.",
    url: "https://thesocialhood.in/work",
  },
};

export default function WorkPage() {
  return <WorkPageClient />;
}
