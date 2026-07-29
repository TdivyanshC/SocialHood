import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | Free Consultation", // see services/page.tsx comment re: title-template doubling
  description: "Ready to scale with AI and automation? Contact The SocialHood for a free consultation. Based in Delhi NCR, serving clients across India.",
  alternates: {
    canonical: "https://thesocialhood.in/contact",
  },
  openGraph: {
    title: "Contact Us | Get a Free Consultation - The SocialHood India",
    description: "Ready to scale with AI and automation? Contact The SocialHood for a free consultation.",
    url: "https://thesocialhood.in/contact",
    images: ["/og-image.jpg"],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
