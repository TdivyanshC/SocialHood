import dynamic from "next/dynamic";
import { createClient } from "@supabase/supabase-js";

const ClientPageClient = dynamic(() => import("./ClientPageClient"));

export async function generateStaticParams() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return [];

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("client_credentials")
    .select("client_name");

  if (error || !data) return [];
  return data.map((row) => ({ client_name: row.client_name }));
}

export default async function ClientPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name } = await params;
  return <ClientPageClient clientName={client_name} />;
}
