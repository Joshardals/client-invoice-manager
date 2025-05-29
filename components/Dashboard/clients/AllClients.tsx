"use client";
import React, { useCallback, useState } from "react";
import Table, { TableColumn } from "@/components/ui/Table";
import { ActionButtons } from "./ActionButtons";
import { Client } from "@/typings";
import {
  deleteClient,
  forceDeleteClientWithInvoices,
  updateClient,
} from "@/app/actions/client.action";
import { ClientFormData } from "@/lib/form/validation";
import { EditModal } from "./EditModal";
import { EmptyState } from "./EmptyState";
import { NoSearchResults } from "./NoSearchResult";
import { SearchBar } from "./SearchBar";

interface AllClientsProps {
  allClients: {
    success: boolean;
    clients?: Client[];
    error?: string;
  };
}

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

  const handleSearchReset = useCallback(() => {
    setSearchTerm("");
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
    } else if (result.error === "HAS_INVOICES") {
      const confirmForceDelete = window.confirm(
        `This client has ${result.invoiceCount} invoice(s). Deleting this client will also delete all associated invoices. Are you sure you want to proceed?`
      );

      if (confirmForceDelete) {
        const forceResult = await forceDeleteClientWithInvoices(clientId);
        if (forceResult.success) {
          setClients((prev) => prev.filter((client) => client.id !== clientId));
          window.alert(
            "Client and all associated invoices deleted successfully"
          );
        } else {
          window.alert(forceResult.error || "Failed to delete client");
        }
      }
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
    {
      header: "Full Name",
      accessor: "name",
      sortable: true,
    },
    {
      header: "Email",
      accessor: "email",
      sortable: true,
    },
    {
      header: "Phone",
      accessor: "phone",
      sortable: true,
      render: (client) => client.phone || "-",
    },
    {
      header: "Company",
      accessor: "company",
      sortable: true,
      render: (client) => client.company || "-",
    },
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
      sortable: false,
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

      <SearchBar value={searchTerm} onChange={handleSearch} />

      {filteredClients().length === 0 ? (
        <NoSearchResults
          value="clients"
          searchTerm={searchTerm}
          onReset={handleSearchReset}
        />
      ) : (
        <Table data={filteredClients()} columns={columns} itemsPerPage={10} />
      )}

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
