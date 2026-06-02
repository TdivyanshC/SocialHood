import dynamic from "next/dynamic";

const ClientPageClient = dynamic(() => import("./ClientPageClient"));

export default async function ClientPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name } = await params;
  return <ClientPageClient clientName={client_name} />;
}
