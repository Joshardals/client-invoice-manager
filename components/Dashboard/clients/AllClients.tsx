// "use client";
// import React, { useCallback, useState } from "react";
// import Table from "@/components/ui/Table";
// import { ActionButtons } from "./ActionButtons";
// import { Client } from "@/typings";
// import { deleteClient, updateClient } from "@/app/actions/client.action";
// import { ClientFormData } from "@/lib/form/validation";
// import { EditModal } from "./EditModal";
// import { EmptyState } from "./EmptyState";
// import { NoSearchResults } from "./NoSearchResult";
// import { SearchBar } from "./SearchBar";

// interface AllClientsProps {
//   allClients: {
//     success: boolean;
//     clients?: Client[];
//     error?: string;
//   };
// }

// interface TableColumn<T> {
//   header: string;
//   accessor: keyof T | ((item: T) => React.ReactNode);
// }

// export function AllClients({ allClients }: AllClientsProps) {
//   const [searchTerm, setSearchTerm] = useState<string>("");
//   const [clients, setClients] = useState<Client[]>(allClients.clients || []);
//   const [selectedClient, setSelectedClient] = useState<Client | null>(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);

//   const filteredClients = useCallback(
//     () =>
//       clients.filter(
//         (client) =>
//           client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           (client.company?.toLowerCase() || "").includes(
//             searchTerm.toLowerCase()
//           )
//       ),
//     [clients, searchTerm]
//   );

//   const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(e.target.value);
//   }, []);

//   const handleSearchReset = useCallback(() => {
//     setSearchTerm("");
//   }, []);

//   const handleEdit = useCallback(
//     (clientId: string) => {
//       const client = clients.find((c) => c.id === clientId);
//       if (client) {
//         setSelectedClient(client);
//         setIsEditModalOpen(true);
//       }
//     },
//     [clients]
//   );

//   const handleDelete = useCallback(async (clientId: string) => {
//     const result = await deleteClient(clientId);
//     if (result.success) {
//       setClients((prev) => prev.filter((client) => client.id !== clientId));
//       window.alert("Client deleted successfully");
//     } else {
//       window.alert(result.error || "Failed to delete client");
//     }
//   }, []);

//   const handleUpdate = useCallback(
//     async (clientId: string, data: ClientFormData) => {
//       const result = await updateClient(clientId, data);
//       if (result.success) {
//         setClients((prev) =>
//           prev.map((client) =>
//             client.id === clientId
//               ? {
//                   ...client,
//                   name: data.fullName,
//                   email: data.email,
//                   phone: data.phone || null,
//                   company: data.company || null,
//                   address: data.address || null,
//                   notes: data.notes || null,
//                 }
//               : client
//           )
//         );
//       }
//     },
//     []
//   );

//   const columns: TableColumn<Client>[] = [
//     { header: "Full Name", accessor: "name" as keyof Client },
//     { header: "Email", accessor: "email" as keyof Client },
//     { header: "Phone", accessor: "phone" as keyof Client },
//     { header: "Company", accessor: "company" as keyof Client },
//     {
//       header: "Actions",
//       accessor: (client: Client) => (
//         <ActionButtons
//           client={client}
//           onDelete={handleDelete}
//           onEdit={handleEdit}
//           onUpdate={handleUpdate}
//         />
//       ),
//     },
//   ];

//   if (!clients.length) {
//     return <EmptyState />;
//   }

//   return (
//     <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <h1 className="text-xl xs:text-2xl lg:text-3xl font-bold text-gray-900">
//             All Clients
//           </h1>
//           <p className="mt-1 text-xs xs:text-sm text-gray-600">
//             Showing {filteredClients().length}{" "}
//             {filteredClients().length === 1 ? "client" : "clients"}
//           </p>
//         </div>
//       </div>

//       <SearchBar value={searchTerm} onChange={handleSearch} />

//       {filteredClients().length === 0 ? (
//         <NoSearchResults searchTerm={searchTerm} onReset={handleSearchReset} />
//       ) : (
//         <Table data={filteredClients()} columns={columns} itemsPerPage={10} />
//       )}

//       {selectedClient && (
//         <EditModal
//           client={selectedClient}
//           isOpen={isEditModalOpen}
//           onClose={() => {
//             setIsEditModalOpen(false);
//             setSelectedClient(null);
//           }}
//           onUpdate={handleUpdate}
//         />
//       )}
//     </div>
//   );
// }

"use client";
import React, { useCallback, useState } from "react";
import Table from "@/components/ui/Table";
import { ActionButtons } from "./ActionButtons";
import { Client } from "@/typings";
import { ClientFormData } from "@/lib/form/validation";
import { EditModal } from "./EditModal";
import { EmptyState } from "./EmptyState";
import { NoSearchResults } from "./NoSearchResult";
import { SearchBar } from "./SearchBar";

// Mock data generator
const generateMockClients = (count: number): Client[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${i + 1}`,
    name: `Client ${i + 1}`,
    email: `client${i + 1}@example.com`,
    phone: i % 3 === 0 ? null : `+1234567${i.toString().padStart(4, "0")}`,
    company: i % 2 === 0 ? `Company ${i + 1}` : null,
    address: i % 4 === 0 ? `${i + 1} Business Street` : null,
    notes: i % 5 === 0 ? `Some notes for client ${i + 1}` : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
};

// Mock data with 50 clients
const MOCK_CLIENTS = generateMockClients(50);

interface AllClientsProps {
  allClients: {
    success: boolean;
    clients?: Client[];
    error?: string;
  };
}

export function AllClients({ allClients }: AllClientsProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  // Use mock data instead of allClients.clients
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
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
    setClients((prev) => prev.filter((client) => client.id !== clientId));
    window.alert("Client deleted successfully");
  }, []);

  const handleUpdate = useCallback(
    async (clientId: string, data: ClientFormData) => {
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
    },
    []
  );

  const columns = [
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

      <SearchBar value={searchTerm} onChange={handleSearch} />

      {filteredClients().length === 0 ? (
        <NoSearchResults searchTerm={searchTerm} onReset={handleSearchReset} />
      ) : (
        <Table
          data={filteredClients()}
          columns={columns}
          itemsPerPage={10}
          isAnimated={true}
        />
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
