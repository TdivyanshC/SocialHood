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
    default: "The SocialHood | Web Development & AI Automation Agency India",
    template: "%s | The SocialHood",
  },
  description: "Premier web development and AI automation agency in India. We build high-converting websites, mobile apps, and AI solutions for businesses across Delhi, Mumbai, Bangalore, and all of India.",
  keywords: [
    "web development agency India",
    "AI automation services India",
    "digital marketing agency India",
    "premium website development",
    "mobile app development India",
    "business automation India",
    "AI video production",
    "Google Ads management",
    "Meta Ads management",
    "social media agency Delhi",
    "best web development company India",
    "AI solutions for business",
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
    google: "google-site-verification-code",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://thesocialhood.in",
    siteName: "The SocialHood",
    title: "The SocialHood | Web Development & AI Automation Agency India",
    description: "Premier web development and AI automation agency in India. We build high-converting websites, mobile apps, and AI solutions for businesses.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The SocialHood - Web Development & AI Agency India",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The SocialHood | Web Development & AI Automation Agency India",
    description: "Premier web development and AI automation agency in India.",
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
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "The SocialHood",
              "url": "https://thesocialhood.in",
              "logo": "https://thesocialhood.in/logo.png",
              "description": "Premier web development and AI automation agency in India.",
              "foundingDate": "2020",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Delhi",
                "addressRegion": "Delhi",
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-88829-88829",
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
                "Web Development",
                "Mobile App Development",
                "AI Automation",
                "Digital Marketing",
                "Google Ads",
                "Meta Ads"
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
              "url": "https://thesocialhood.in",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://thesocialhood.in/search?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
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
              "telephone": "+91-88829-88829",
              "email": "hello@thesocialhood.in",
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
