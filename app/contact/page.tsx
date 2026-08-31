import type { Metadata } from "next";
import ContactPageClient from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact: Start With The Audit", // see services/page.tsx comment re: title-template doubling
  description: "We fill in your own enquiry form, time the reply, and show you the response gap in your own data. One call, before anyone talks about building anything.",
  alternates: {
    canonical: "https://thesocialhood.in/contact",
  },
  openGraph: {
    title: "Contact | Start With The Audit - The SocialHood",
    description: "We fill in your own enquiry form, time the reply, and show you the gap in your own data.",
    url: "https://thesocialhood.in/contact",
    images: ["/opengraph-image"],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
