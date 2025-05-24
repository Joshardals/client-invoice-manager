"use client";
import React, { useCallback, useState } from "react";
import { Eye, Edit2, Trash2, Search, FileText } from "lucide-react";
import Table from "@/components/ui/Table";

interface Invoice {
  id: number;
  invoiceNumber: string;
  clientName: string;
  amount: string;
  status: "Paid" | "Unpaid" | "Overdue";
  dateCreated: string;
}

interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

export function AllInvoices() {
  const initialInvoices: Invoice[] = [
    {
      id: 1,
      invoiceNumber: "INV-2025-001",
      clientName: "Apex Solutions",
      amount: "₦150,000",
      status: "Paid",
      dateCreated: "2025-05-10",
    },
    {
      id: 2,
      invoiceNumber: "INV-2025-002",
      clientName: "Global Tech",
      amount: "₦80,000",
      status: "Unpaid",
      dateCreated: "2025-05-08",
    },
    {
      id: 3,
      invoiceNumber: "INV-2025-003",
      clientName: "Metro Systems",
      amount: "₦200,000",
      status: "Overdue",
      dateCreated: "2025-04-15",
    },
    {
      id: 4,
      invoiceNumber: "INV-2025-004",
      clientName: "Delta Corp",
      amount: "₦120,000",
      status: "Paid",
      dateCreated: "2025-05-03",
    },
    {
      id: 5,
      invoiceNumber: "INV-2025-005",
      clientName: "Echo Industries",
      amount: "₦90,000",
      status: "Unpaid",
      dateCreated: "2025-05-01",
    },
  ];

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);

  const filteredInvoices = useCallback(
    () =>
      invoices.filter(
        (invoice) =>
          invoice.invoiceNumber
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [invoices, searchTerm]
  );

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleView = useCallback((id: number) => {
    console.log("View invoice:", id);
  }, []);

  const handleEdit = useCallback((id: number) => {
    console.log("Edit invoice:", id);
  }, []);

  const handleDelete = useCallback((id: number) => {
    setInvoices((prevInvoices) =>
      prevInvoices.filter((invoice) => invoice.id !== id)
    );
  }, []);

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Unpaid":
        return "bg-yellow-100 text-yellow-800";
      case "Overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns: TableColumn<Invoice>[] = [
    { header: "Invoice #", accessor: "invoiceNumber" as keyof Invoice },
    { header: "Client Name", accessor: "clientName" as keyof Invoice },
    { header: "Amount", accessor: "amount" as keyof Invoice },
    {
      header: "Status",
      accessor: (invoice: Invoice) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            invoice.status
          )}`}
        >
          {invoice.status}
        </span>
      ),
    },
    { header: "Date Created", accessor: "dateCreated" as keyof Invoice },
  ];

  const actionButtons = (invoice: Invoice) => (
    <div className="flex space-x-1 xs:space-x-2">
      <button
        onClick={() => handleView(invoice.id)}
        className="text-blue-600 hover:text-blue-800"
      >
        <Eye className="size-4 xs:size-5" />
      </button>
      <button
        onClick={() => handleEdit(invoice.id)}
        className="text-yellow-600 hover:text-yellow-800"
      >
        <Edit2 className="size-4 xs:size-5" />
      </button>
      <button
        onClick={() => handleDelete(invoice.id)}
        className="text-red-600 hover:text-red-800"
      >
        <Trash2 className="size-4 xs:size-5" />
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 sm:h-5 w-4 sm:w-5" />
        <input
          type="text"
          placeholder="Search by invoice number or client name..."
          className="w-full pl-10 pr-4 py-2 text-sm xs:text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Invoices Table */}
      <Table
        data={filteredInvoices()}
        columns={columns}
        actions={actionButtons}
      />
    </div>
  );
}
