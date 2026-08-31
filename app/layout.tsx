import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// GA4 — mirrors the exact pattern already proven live on sonikiupsc's
// app/layout.jsx. Safe to ship inactive: renders nothing until
// NEXT_PUBLIC_GA_MEASUREMENT_ID is set (see docs/socialhood_seo_setup.md).
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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

// Next 15 reads viewport from its own export; leaving it inside `metadata`
// is deprecated and warns at build time.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://thesocialhood.in"),
  title: {
    default: "The SocialHood | AI Systems Studio",
    template: "%s | The SocialHood",
  },
  description: "An AI Systems Studio. We build and run voice agents that answer and call, WhatsApp agents that follow up, and the automation and software underneath — for businesses where a slow callback costs the sale.",
  keywords: [
    "AI systems studio India",
    "AI voice agent for business",
    "AI voice agent India",
    "WhatsApp AI agent India",
    "speed to lead system",
    "lead response automation",
    "inbound call answering AI",
    "outbound calling AI agent",
    "AI automation for furniture retail",
    "AI automation for real estate",
    "AI automation for clinics",
    "CRM integration company India",
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
    // Real value comes from GSC_VERIFICATION_TOKEN once the SocialHood
    // property is added in Search Console (docs/socialhood_seo_setup.md)
    // — omitting the tag entirely (rather than shipping a placeholder
    // string) until then, since a fake value would just fail silently.
    ...(process.env.GSC_VERIFICATION_TOKEN ? { google: process.env.GSC_VERIFICATION_TOKEN } : {}),
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://thesocialhood.in",
    siteName: "The SocialHood",
    title: "The SocialHood | AI Systems Studio",
    description: "Voice agents that answer and call. WhatsApp agents that follow up. The automation and software underneath.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The SocialHood | AI Systems Studio",
    description: "Voice agents that answer and call. WhatsApp agents that follow up. The automation and software underneath.",
    creator: "@thesocialhood",
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
              "logo": "https://thesocialhood.in/android-chrome-512x512.png",
              "description": "AI Systems Studio — we build and run AI voice agents, WhatsApp AI agents, custom automation, and the software underneath them.",
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91-8799712556",
                "email": "team@thesocialhood.in",
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi"]
              },
              "sameAs": [
                "https://instagram.com/thesocialhood",
                "https://linkedin.com/company/thesocialhood",
                "https://twitter.com/thesocialhood"
              ],
              "serviceType": [
                "AI Voice Agents",
                "WhatsApp AI Agents",
                "Custom AI Automation Systems",
                "Custom Software & Dashboards"
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
      </head>
      <body className={`${playfair.variable} ${cormorant.variable} ${dmSans.variable}`}>
        <ClientLayout>
          {children}
        </ClientLayout>
        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaMeasurementId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
