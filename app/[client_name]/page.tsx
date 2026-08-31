import type { Metadata } from "next";
import dynamic from "next/dynamic";

const ClientPageClient = dynamic(() => import("./ClientPageClient"));

// This is a catch-all single-segment route: /anything renders a client
// dashboard shell and returns 200, so without this every crawled junk URL
// becomes a soft-404 in the index. robots.txt can't enumerate client slugs,
// and a Disallow would also stop Google seeing the noindex — so noindex here.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ClientPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name } = await params;
  return <ClientPageClient clientName={client_name} />;
}
