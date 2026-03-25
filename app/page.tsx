import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "The SocialHood | Web Development & AI Automation Agency India",
  description: "Premier web development and AI automation agency in India. We build high-converting websites, mobile apps, AI video production, and business automation solutions for businesses across Delhi, Mumbai, Bangalore, and all of India.",
  alternates: {
    canonical: "https://thesocialhood.in",
  },
  openGraph: {
    title: "The SocialHood | Web Development & AI Automation Agency India",
    description: "Premier web development and AI automation agency in India. We build high-converting websites, mobile apps, and AI solutions.",
    url: "https://thesocialhood.in",
    siteName: "The SocialHood",
  },
};

export default function Home() {
  return <HomeClient />;
}
