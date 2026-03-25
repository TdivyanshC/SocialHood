import type { Metadata } from "next";
import WorkPageClient from "./WorkPageClient";

export const metadata: Metadata = {
  title: "Our Work | Portfolio - Website Development Projects India",
  description: "View our portfolio of successful projects. We've helped businesses across Delhi, Mumbai, Bangalore, and all of India with premium web development, app development, and digital marketing.",
  alternates: {
    canonical: "https://thesocialhood.in/work",
  },
  openGraph: {
    title: "Our Work | Portfolio - Website Development Projects India",
    description: "View our portfolio of successful web development and digital marketing projects in India.",
    url: "https://thesocialhood.in/work",
  },
};

export default function WorkPage() {
  return <WorkPageClient />;
}
