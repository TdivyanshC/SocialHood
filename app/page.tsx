import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "The SocialHood | AI Systems Studio — Voice & WhatsApp Agents, Automation | Delhi NCR",
  description: "AI Systems Studio in Delhi NCR. We build and run AI voice agents, WhatsApp agents, and custom automation that replace manual work.",
  alternates: {
    canonical: "https://thesocialhood.in",
  },
  openGraph: {
    title: "The SocialHood | AI Systems Studio — Voice & WhatsApp Agents, Automation | Delhi NCR",
    description: "AI Systems Studio in Delhi NCR. We build and run AI voice agents, WhatsApp agents, and custom automation that replace manual work.",
    url: "https://thesocialhood.in",
    siteName: "The SocialHood",
    images: ["/og-image.jpg"],
  },
};

export default function Home() {
  return <HomeClient />;
}
