"use client";
import React, { useCallback, useState } from "react";
import { Search } from "lucide-react";
import Table, { TableColumn } from "@/components/ui/Table";
import { Client, Invoice } from "@/typings";
import { NoSearchResults } from "../clients/NoSearchResult";
import { deleteInvoice } from "@/app/actions/invoice.action";
import { ActionButtons } from "./ActionButtons";
import { EmptyState } from "./EmptyState";

interface AllInvoicesProps {
  allInvoices: {
    success: boolean;
    invoices?: Invoice[];
    error?: string;
  };
  allClients: {
    success: boolean;
    clients?: Client[];
    error?: string;
  };
}

export function AllInvoices({ allInvoices, allClients }: AllInvoicesProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [clients] = useState<Client[]>(allClients.clients || []);

  const [invoices, setInvoices] = useState<Invoice[]>(
    allInvoices.invoices || []
  );

  const filteredInvoices = useCallback(
    () =>
      invoices.filter(
        (invoice) =>
          invoice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [invoices, searchTerm]
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSearchReset = useCallback(() => {
    setSearchTerm("");
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = useCallback(async (invoiceId: string) => {
    const result = await deleteInvoice(invoiceId);
    if (result.success) {
      setInvoices((prev) => prev.filter((invoice) => invoice.id !== invoiceId));
      window.alert("Invoice deleted successfully");
    } else {
      window.alert(result.error || "Failed to delete invoice");
    }
  }, []);

  const columns: TableColumn<Invoice>[] = [
    {
      header: "Title",
      accessor: "title",
      sortable: true,
    },
    {
      header: "Client",
      accessor: "client",
      sortable: true,
      render: (invoice) => invoice.client.name,
    },
    {
      header: "Amount",
      accessor: "amount",
      sortable: true,
      render: (invoice) =>
        new Intl.NumberFormat("en-NG", {
          style: "currency",
          currency: invoice.currency,
        }).format(invoice.amount),
    },
    {
      header: "Status",
      accessor: "status",
      sortable: true,
      render: (invoice) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            invoice.status
          )}`}
        >
          {invoice.status}
        </span>
      ),
    },
    {
      header: "Due Date",
      accessor: "dueDate",
      sortable: true,
      render: (invoice) => new Date(invoice.dueDate).toLocaleDateString(),
    },
    {
      header: "Actions",
      accessor: (invoice) => (
        <ActionButtons
          invoice={invoice}
          clients={clients}
          onDelete={handleDelete}
        />
      ),
      sortable: false,
    },
  ];

  if (!invoices.length) {
    return <EmptyState />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl xs:text-2xl lg:text-3xl font-bold text-gray-900">
            All Invoices
          </h1>
          <p className="mt-1 text-xs xs:text-sm text-gray-600">
            Showing {filteredInvoices().length} Invoices
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 sm:h-5 w-4 sm:w-5" />
        <input
          type="text"
          placeholder="Search by invoice title or client name..."
          className="w-full pl-10 pr-4 py-2 text-sm xs:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {filteredInvoices().length === 0 ? (
        <NoSearchResults
          value="invoices"
          searchTerm={searchTerm}
          onReset={handleSearchReset}
        />
      ) : (
        <Table data={filteredInvoices()} columns={columns} itemsPerPage={10} />
      )}
    </div>
  );
}
