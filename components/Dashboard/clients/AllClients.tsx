"use client";
import React, { useCallback, useState } from "react";
import { Eye, Edit2, Trash2, Search } from "lucide-react";
import Table from "@/components/ui/Table";
import { ActionButtons } from "./ActionButtons";
import { Client } from "@/typings";

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

export function AllClients({ allClients }: AllClientsProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const clients: Client[] = allClients.clients || [];

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

  const handleEdit = useCallback((clientId: string) => {
    console.log("Edit client:", clientId);
  }, []);

  const handleDelete = useCallback((clientId: string) => {
    console.log("Delete client:", clientId);
  }, []);

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
        />
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl xs:text-2xl lg:text-3xl font-bold text-gray-900">
            All Clients
          </h1>
          <p className="mt-1 text-xs xs:text-sm text-gray-600">
            Showing {filteredClients().length} Clients
          </p>
        </div>
      </div>

      {/* Search Bar */}
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

      {/* Clients Table */}
      <Table data={filteredClients()} columns={columns} />
    </div>
  );
}
