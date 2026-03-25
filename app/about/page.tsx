import type { Metadata } from "next";
import AboutPageClient from "./AboutPageClient";

export const metadata: Metadata = {
  title: "About Us | The SocialHood - Premier Digital Agency India",
  description: "Learn about The SocialHood, India's premier digital agency. We specialize in web development, AI automation, and digital marketing. Based in Delhi, serving clients across India.",
  alternates: {
    canonical: "https://thesocialhood.in/about",
  },
  openGraph: {
    title: "About Us | The SocialHood - Premier Digital Agency India",
    description: "Learn about The SocialHood, India's premier digital agency specializing in web development, AI automation, and digital marketing.",
    url: "https://thesocialhood.in/about",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
