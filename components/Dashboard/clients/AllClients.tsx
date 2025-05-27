"use client";
import React, { useCallback, useState } from "react";
import { Search, Users, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import Table from "@/components/ui/Table";
import { ActionButtons } from "./ActionButtons";
import { Client } from "@/typings";
import { deleteClient, updateClient } from "@/app/actions/client.action";
import { ClientFormData } from "@/lib/form/validation";
import { EditModal } from "./EditModal";
import Button from "@/components/ui/Button";

interface AllClientsProps {
  allClients: {
    success: boolean;
    clients?: Client[];
    error?: string;
  };
}

interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="absolute inset-0 flex flex-col items-center justify-center text-center min-h-screen"
  >
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2 }}
      className="relative mx-auto w-24 h-24 mb-8"
    >
      <div className="absolute inset-0 bg-blue-100 rounded-full" />
      <Users className="absolute inset-0 m-auto h-12 w-12 text-blue-600" />
    </motion.div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Clients Yet</h3>
    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
      Get started by adding your first client. Click the button below to create
      a new client record.
    </p>
    <Button fullWidth={false} className="mx-auto">
      <UserPlus className="w-4 h-4 mr-1.5 sm:mr-2" />
      Add New Client
    </Button>
  </motion.div>
);

export function AllClients({ allClients }: AllClientsProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [clients, setClients] = useState<Client[]>(allClients.clients || []);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const filteredClients = useCallback(
    () =>
      clients.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (client.company?.toLowerCase() || "").includes(
            searchTerm.toLowerCase()
          )
      ),
    [clients, searchTerm]
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleEdit = useCallback(
    (clientId: string) => {
      const client = clients.find((c) => c.id === clientId);
      if (client) {
        setSelectedClient(client);
        setIsEditModalOpen(true);
      }
    },
    [clients]
  );

  const handleDelete = useCallback(async (clientId: string) => {
    const result = await deleteClient(clientId);
    if (result.success) {
      setClients((prev) => prev.filter((client) => client.id !== clientId));
      window.alert("Client deleted successfully");
    } else {
      window.alert(result.error || "Failed to delete client");
    }
  }, []);

  const handleUpdate = useCallback(
    async (clientId: string, data: ClientFormData) => {
      const result = await updateClient(clientId, data);
      if (result.success) {
        setClients((prev) =>
          prev.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  name: data.fullName,
                  email: data.email,
                  phone: data.phone || null,
                  company: data.company || null,
                  address: data.address || null,
                  notes: data.notes || null,
                }
              : client
          )
        );
      }
    },
    []
  );

  const columns: TableColumn<Client>[] = [
    { header: "Full Name", accessor: "name" as keyof Client },
    { header: "Email", accessor: "email" as keyof Client },
    { header: "Phone", accessor: "phone" as keyof Client },
    { header: "Company", accessor: "company" as keyof Client },
    {
      header: "Actions",
      accessor: (client: Client) => (
        <ActionButtons
          client={client}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onUpdate={handleUpdate}
        />
      ),
    },
  ];

  if (!clients.length) {
    return <EmptyState />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl xs:text-2xl lg:text-3xl font-bold text-gray-900">
            All Clients
          </h1>
          <p className="mt-1 text-xs xs:text-sm text-gray-600">
            Showing {filteredClients().length}{" "}
            {filteredClients().length === 1 ? "client" : "clients"}
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 sm:h-5 w-4 sm:w-5" />
        <input
          type="text"
          placeholder="Search by name or company..."
          className="w-full pl-10 pr-4 py-2 text-sm xs:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <Table data={filteredClients()} columns={columns} />

      {selectedClient && (
        <EditModal
          client={selectedClient}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedClient(null);
          }}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
