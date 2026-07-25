import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thesocialhood.in"),
  title: {
    default: "The SocialHood | AI Systems & Automation Company India",
    template: "%s | The SocialHood",
  },
  description: "We help businesses scale using AI, automation, and custom software — not just websites or marketing campaigns. AI voice agents, WhatsApp AI agents, and custom automation systems for real estate, financial services, e-commerce, education, and manufacturing across India.",
  keywords: [
    "AI automation company India",
    "AI voice agent for business",
    "WhatsApp AI agent India",
    "business process automation India",
    "custom AI automation systems",
    "AI systems company India",
    "custom software development company India",
    "SaaS product development agency",
    "AI automation for real estate",
    "AI automation for financial services",
    "CRM integration company India",
    "startup automation consulting",
  ],
  authors: [{ name: "The SocialHood Company" }],
  creator: "The SocialHood",
  publisher: "The SocialHood",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // TODO: replace with the real Search Console verification string — this was
    // still the literal placeholder before this refresh, so verification was
    // never actually active via this method.
    google: "google-site-verification-code",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://thesocialhood.in",
    siteName: "The SocialHood",
    title: "The SocialHood | AI Systems & Automation Company India",
    description: "We help businesses scale using AI, automation, and custom software — not just websites or marketing campaigns.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The SocialHood - AI Systems & Automation Company India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The SocialHood | AI Systems & Automation Company India",
    description: "We help businesses scale using AI, automation, and custom software — not just websites or marketing campaigns.",
    images: ["/og-image.jpg"],
    creator: "@thesocialhood",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
    other: [
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

import ClientLayout from "./components/ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){function isChunkErr(m){return /ChunkLoadError|Loading chunk [\\w\\d]+ failed|Failed to fetch dynamically imported module/i.test(m||'');}function fix(){try{if(sessionStorage.getItem('__chunkReloaded'))return;sessionStorage.setItem('__chunkReloaded','1');location.reload();}catch(e){location.reload();}}window.addEventListener('error',function(e){var m=(e.error&&e.error.message)||e.message||'';if(isChunkErr(m))fix();},true);window.addEventListener('unhandledrejection',function(e){var r=e.reason;var m=(r&&(r.message||String(r)))||'';if(isChunkErr(m))fix();});})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "The SocialHood",
              "url": "https://thesocialhood.in",
              "logo": "https://thesocialhood.in/logo.png",
              "description": "AI-first business growth partner — AI voice agents, WhatsApp AI agents, custom automation, and software development.",
              "foundingDate": "2020",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Delhi",
                "addressRegion": "Delhi",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-9198310770",
                "email": "team@thesocialhood.in",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"]
              },
              "sameAs": [
                "https://instagram.com/thesocialhood",
                "https://linkedin.com/company/thesocialhood",
                "https://twitter.com/thesocialhood"
              ],
              "areaServed": {
                "@type": "Country",
                "name": "India"
              },
              "serviceType": [
                "AI Voice Agents",
                "WhatsApp AI Agents",
                "Custom AI Automation Systems",
                "Custom Software Development",
                "Website & Product Development",
                "SEO & Organic Growth",
                "CRM Integrations",
                "Startup Consulting"
              ]
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "The SocialHood",
              "url": "https://thesocialhood.in"
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "The SocialHood",
              "image": "https://thesocialhood.in/logo.png",
              "url": "https://thesocialhood.in",
              "telephone": "+91-9198310770",
              "email": "team@thesocialhood.in",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Delhi, India",
                "addressLocality": "Delhi",
                "addressRegion": "Delhi",
                "postalCode": "110001",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "28.6139",
                "longitude": "77.2090"
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "09:00",
                "closes": "18:00"
              },
              "priceRange": "$$"
            }),
          }}
        />
      </head>
      <body className={`${playfair.variable} ${cormorant.variable} ${dmSans.variable}`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
