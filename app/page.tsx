import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "AI Systems Studio: Voice & WhatsApp Agents | The SocialHood",
  description: "An AI Systems Studio. Voice agents that answer every call, WhatsApp agents that follow up, and the automation and software underneath. Running today at Krishna Furniture.",
  alternates: {
    canonical: "https://thesocialhood.in/",
  },
  openGraph: {
    title: "AI Systems Studio: Voice & WhatsApp Agents | The SocialHood",
    description: "Voice agents that answer every call. WhatsApp agents that follow up. The automation and software underneath.",
    url: "https://thesocialhood.in",
    siteName: "The SocialHood",
    images: ["/opengraph-image"],
  },
};

export default function Home() {
  return <HomeClient />;
}
