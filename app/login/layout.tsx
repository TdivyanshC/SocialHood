import type { Metadata } from "next";

// app/login/page.tsx is a Client Component and can't export metadata itself.
// robots.txt already Disallows /login, but a Disallow doesn't deindex a URL
// that gets linked from elsewhere — the noindex has to be served on the page.
export const metadata: Metadata = {
  title: "Client Login",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
