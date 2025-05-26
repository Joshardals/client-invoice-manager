import { getClients } from "@/app/actions/client.action";
import { AllClients } from "@/components/Dashboard/clients/AllClients";

export default async function ClientsPage() {
  const clients = await getClients();

  return <AllClients allClients={clients} />;
}
