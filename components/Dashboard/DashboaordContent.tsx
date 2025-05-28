"use client";
import { useSidebarStore } from "@/lib/stores/sidebar-store";
import { useAddClientModal } from "@/lib/stores/useAddClientModal";
import { AddClientModal } from "./AddClientModal";
import { ClientFormData } from "@/lib/form/validation";
import { useCallback } from "react";
import { toast } from "react-toastify";

export function DashboardContent({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useSidebarStore((state) => state.isOpen);
  const hasHydrated = useSidebarStore((state) => state.hasHydrated);

  const { isOpen, close } = useAddClientModal();

  const handleAddClientSuccess = useCallback((clientData: ClientFormData) => {
    toast.success("Client added successfully");
    console.log(clientData);
  }, []);

  if (!hasHydrated) {
    return null; // Or skeleton
  }

  return (
    <main
      className={`flex-1 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"} transition-all duration-300 p-4 sm:p-6 lg:p-8`}
    >
      <div className="pt-16 lg:pt-0">{children}</div>

      <AddClientModal
        isOpen={isOpen}
        onClose={close}
        onSuccess={handleAddClientSuccess}
      />
    </main>
  );
}
