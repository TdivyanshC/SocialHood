import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";

export const metadata: Metadata = {
  title: "Services | Web Development, App Development & AI Solutions India",
  description: "Explore our premium services: Website Development, Mobile App Development, AI Video Production, Business Automation, and Google & Meta Ads. Serving clients across Delhi, Mumbai, Bangalore, and all of India.",
  alternates: {
    canonical: "https://thesocialhood.in/services",
  },
  openGraph: {
    title: "Services | Web Development & AI Solutions India - The SocialHood",
    description: "Premium web development, app development, AI automation, and digital marketing services in India.",
    url: "https://thesocialhood.in/services",
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
