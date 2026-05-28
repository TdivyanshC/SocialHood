import dynamic from "next/dynamic";

const ClientPageClient = dynamic(() => import("./ClientPageClient"));

export default function ClientPage(props: any) {
  return <ClientPageClient clientName={props.params?.client_name} />;
}
