"use client";
import React, { useCallback, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  DollarSign,
  CheckCircle,
  PlusCircle,
  FilePlus,
  FileSearch,
  Bell,
  LucideIcon,
} from "lucide-react";
import Table from "../ui/Table";
import { today } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { AddClientModal } from "./AddClientModal";
import { toast } from "react-toastify";
import { ClientFormData } from "@/lib/form/validation";
import Button from "../ui/Button";
import { CreateInvoiceModal } from "./CreateInvoiceModal";
import { InvoiceData } from "@/typings";

interface Invoice {
  id: number;
  client: string;
  amount: string;
  status: "Paid" | "Unpaid";
  date: string;
}

interface StatCard {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export function Dashboard() {
  const router = useRouter();
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isCreateInvoiceModalOpen, setIsCreateInvoiceModalOpen] =
    useState(false);

  const stats: StatCard[] = useMemo(
    () => [
      {
        title: "Total Clients",
        value: "24",
        icon: Users,
        color: "bg-blue-500",
      },
      {
        title: "Total Invoices",
        value: "156",
        icon: FileText,
        color: "bg-purple-500",
      },
      {
        title: "Pending Payments",
        value: "₦450,000",
        icon: DollarSign,
        color: "bg-yellow-500",
      },
      {
        title: "Paid Invoices",
        value: "₦1,250,000",
        icon: CheckCircle,
        color: "bg-green-500",
      },
    ],
    []
  );

  const recentInvoices: Invoice[] = useMemo(
    () => [
      {
        id: 1,
        client: "Apex Solutions",
        amount: "₦150,000",
        status: "Paid",
        date: "2025-05-10",
      },
      {
        id: 2,
        client: "Global Tech",
        amount: "₦80,000",
        status: "Unpaid",
        date: "2025-05-08",
      },
      {
        id: 3,
        client: "Metro Systems",
        amount: "₦200,000",
        status: "Paid",
        date: "2025-05-05",
      },
      {
        id: 4,
        client: "Delta Corp",
        amount: "₦120,000",
        status: "Unpaid",
        date: "2025-05-03",
      },
      {
        id: 5,
        client: "Echo Industries",
        amount: "₦90,000",
        status: "Paid",
        date: "2025-05-01",
      },
    ],
    []
  );

  const columns = useMemo(
    () => [
      { header: "Client", accessor: "client" as keyof Invoice },
      { header: "Amount", accessor: "amount" as keyof Invoice },
      {
        header: "Status",
        accessor: (invoice: Invoice) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              invoice.status === "Paid"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {invoice.status}
          </span>
        ),
      },
      { header: "Date", accessor: "date" as keyof Invoice },
    ],
    []
  );

  const handleStatsClick = useCallback(
    (title: string) => {
      if (title === "Total Clients") {
        router.push("/dashboard/clients");
      }
    },
    [router]
  );

  const handleAddClientSuccess = useCallback((clientData: ClientFormData) => {
    toast.success("Client added successfully");
    console.log(clientData);
  }, []);

  const handleCreateInvoiceSuccess = useCallback((data: InvoiceData) => {
    toast.success("Invoice created successfully");
    console.log(data);
    setIsCreateInvoiceModalOpen(false);
  }, []);

  // Add mock clients data (replace with your actual clients data)
  const clients = useMemo(
    () => [
      { id: "1", name: "Apex Solutions" },
      { id: "2", name: "Global Tech" },
      { id: "3", name: "Metro Systems" },
    ],
    []
  );

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl xs:text-2xl lg:text-3xl font-bold text-gray-900">
              Welcome back, Joshua
            </h1>

            <p className="mt-1 text-xs xs:text-sm text-gray-600">{today}</p>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 sm:gap-3">
            <Button
              onClick={() => setIsAddClientModalOpen(true)}
              fullWidth={false}
            >
              <PlusCircle className="w-4 h-4 mr-1.5 sm:mr-2" />
              Add Client
            </Button>

            <Button
              onClick={() => setIsCreateInvoiceModalOpen(true)}
              fullWidth={false}
            >
              <FilePlus className="w-4 h-4 mr-1.5 sm:mr-2" />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              onClick={() => handleStatsClick(stat.title)}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5 xs:w-6 xs:h-6 text-white" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs xs:text-sm text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-lg xs:text-xl lg:text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Invoices */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg xs:text-xl lg:text-2xl font-semibold text-gray-900">
              Recent Invoices
            </h2>
            <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm xs:text-base">
              <FileSearch className="w-4 h-4 mr-1.5 sm:mr-2" />
              View All
            </button>
          </div>
          <Table data={recentInvoices} columns={columns} />
        </div>

        {/* Notifications */}
        <div className="fixed  bottom-4 right-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200"
          >
            <div className="flex items-center text-yellow-600">
              <Bell className="size-5 xs:sizee-5 mr-1.5 sm:mr-2" />
              <p className="text-xs xs:text-sm">
                Invoice to Global Tech is overdue
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={() => setIsAddClientModalOpen(false)}
        onSuccess={handleAddClientSuccess}
      />

      <CreateInvoiceModal
        isOpen={isCreateInvoiceModalOpen}
        onClose={() => setIsCreateInvoiceModalOpen(false)}
        onSubmit={handleCreateInvoiceSuccess}
        clients={clients}
      />
    </>
  );
}
