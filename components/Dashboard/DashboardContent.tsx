"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { useAddClientModal } from "@/lib/stores/useAddClientModal";
import { useCreateInvoiceModal } from "@/lib/stores/useCreateInvoiceModal";
import { AddClientModal } from "./AddClientModal";
import { CreateInvoiceModal } from "./CreateInvoiceModal";
import { getClients } from "@/app/actions/client.action";

interface Client {
  id: string;
  name: string;
}

export function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isOpen: sidebarOpen, hasHydrated } = useSidebarStore();
  const { isOpen: isClientModalOpen, close: closeClientModal } =
    useAddClientModal();
  const { isOpen: isInvoiceModalOpen, close: closeInvoiceModal } =
    useCreateInvoiceModal();

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    try {
      const result = await getClients();
      if (result.success && result.clients) {
        const formattedClients = result.clients.map(({ id, name }) => ({
          id,
          name,
        }));
        setClients(formattedClients);
      } else {
        toast.error(result.error || "Failed to fetch clients");
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to load clients");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const handleAddClientSuccess = useCallback(async () => {
    toast.success("Client added successfully");
    await fetchClients();
  }, [fetchClients]);

  // const handleCreateInvoiceSuccess = useCallback((invoiceData: InvoiceData) => {
  //   toast.success("Invoice created successfully");
  //   console.log(invoiceData);
  // }, []);

  if (!hasHydrated) {
    return null;
  }

  return (
    <main
      className={`flex-1 transition-all duration-300 p-4 sm:p-6 lg:p-8 ${
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      }`}
    >
      <div className="pt-16 lg:pt-0">{children}</div>

      <AddClientModal
        isOpen={isClientModalOpen}
        onClose={closeClientModal}
        onSuccess={handleAddClientSuccess}
      />

      <CreateInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={closeInvoiceModal}
        // onSubmit={handleCreateInvoiceSuccess}
        clients={clients}
        loadingClients={isLoading}
      />
    </main>
  );
}
