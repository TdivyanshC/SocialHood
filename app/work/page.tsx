import type { Metadata } from "next";
import WorkPageClient from "./WorkPageClient";

export const metadata: Metadata = {
  title: "Our Work | AI Systems & Product Builds", // see services/page.tsx comment re: title-template doubling
  description: "AI voice agents, automation pipelines, and products we've built and run — plus the websites and platforms we've built for clients across India.",
  alternates: {
    canonical: "https://thesocialhood.in/work",
  },
  openGraph: {
    title: "Our Work | AI Systems & Product Builds - The SocialHood",
    description: "AI voice agents, automation pipelines, and products we've built and run — plus the websites and platforms we've built for clients.",
    url: "https://thesocialhood.in/work",
    images: ["/og-image.jpg"],
  },
};

export default function WorkPage() {
  return <WorkPageClient />;
}
