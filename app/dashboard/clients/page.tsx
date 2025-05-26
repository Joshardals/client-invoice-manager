import { Suspense } from "react";
import { getClients } from "@/app/actions/client.action";
import { AllClients } from "@/components/Dashboard/clients/AllClients";
import { ClientsSkeleton } from "@/components/Dashboard/clients/ClientSkeleton";

export default async function ClientsPage() {
  return (
    <Suspense fallback={<ClientsSkeleton />}>
      <ClientsContent />
    </Suspense>
  );
}

async function ClientsContent() {
  const clients = await getClients();

  if (!clients.success) {
    throw new Error(clients.error || "Failed to load clients");
  }

  return <AllClients allClients={clients} />;
}
