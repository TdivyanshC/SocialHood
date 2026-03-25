import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact Us | Get a Free Consultation - The SocialHood India",
  description: "Ready to transform your business? Contact The SocialHood for a free consultation. Based in Delhi, serving clients across India. Call us at +91-88829-88829.",
  alternates: {
    canonical: "https://thesocialhood.in/contact",
  },
  openGraph: {
    title: "Contact Us | Get a Free Consultation - The SocialHood India",
    description: "Ready to transform your business? Contact The SocialHood for a free consultation.",
    url: "https://thesocialhood.in/contact",
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
