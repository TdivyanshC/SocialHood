import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | Get a Free Consultation - The SocialHood India",
  description: "Ready to scale with AI and automation? Contact The SocialHood for a free consultation. Based in Delhi, serving clients across India. Call us at +91 9198310770.",
  alternates: {
    canonical: "https://thesocialhood.in/contact",
  },
  openGraph: {
    title: "Contact Us | Get a Free Consultation - The SocialHood India",
    description: "Ready to scale with AI and automation? Contact The SocialHood for a free consultation.",
    url: "https://thesocialhood.in/contact",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
