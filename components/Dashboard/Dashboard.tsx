"use client";
import React, { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  DollarSign,
  CheckCircle,
  FilePlus,
  FileSearch,
  Bell,
  UserPlus,
} from "lucide-react";
import Table from "../ui/Table";
import { today } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";
import { useAddClientModal } from "@/lib/stores/useAddClientModal";
import { useCreateInvoiceModal } from "@/lib/stores/useCreateInvoiceModal";
import { Invoice } from "@/typings";
import { DashboardStats } from "@/app/dashboard/page";


interface DashboardProps {
  name: string;
  recentInvoices: Invoice[];
  stats: DashboardStats;
}

const formatCurrency = (amount: number, currency: string = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export function Dashboard({ name, recentInvoices, stats }: DashboardProps) {
  const router = useRouter();
  const { open: openClientModal } = useAddClientModal();
  const { open: openInvoiceModal } = useCreateInvoiceModal();

  const statCards = useMemo(
    () => [
      {
        title: "Total Clients",
        value: stats.totalClients.toString(),
        icon: Users,
        color: "bg-blue-500",
      },
      {
        title: "Total Invoices",
        value: stats.totalInvoices.toString(),
        icon: FileText,
        color: "bg-purple-500",
      },
      {
        title: "Pending Payments",
        value: formatCurrency(stats.pendingAmount),
        icon: DollarSign,
        color: "bg-yellow-500",
      },
      {
        title: "Paid Invoices",
        value: formatCurrency(stats.paidAmount),
        icon: CheckCircle,
        color: "bg-green-500",
      },
    ],
    [stats]
  );

  const columns = useMemo(
    () => [
      {
        header: "Client",
        accessor: (invoice: Invoice) => invoice.client.name,
      },
      {
        header: "Amount",
        accessor: (invoice: Invoice) =>
          new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: invoice.currency,
          }).format(invoice.amount),
      },
      {
        header: "Status",
        accessor: (invoice: Invoice) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              invoice.status === "PAID"
                ? "bg-green-100 text-green-800"
                : invoice.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {invoice.status}
          </span>
        ),
      },
      {
        header: "Date",
        accessor: (invoice: Invoice) =>
          new Date(invoice.createdAt).toLocaleDateString(),
      },
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

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl xs:text-2xl lg:text-3xl font-bold text-gray-900">
              Welcome back, {name}
            </h1>

            <p className="mt-1 text-xs xs:text-sm text-gray-600">{today}</p>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 sm:gap-3">
            <Button onClick={openClientModal} fullWidth={false}>
              <UserPlus className="w-4 h-4 mr-1.5 sm:mr-2" />
              Add Client
            </Button>

            <Button onClick={openInvoiceModal} fullWidth={false}>
              <FilePlus className="w-4 h-4 mr-1.5 sm:mr-2" />
              Create Invoice
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
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
        <div className="fixed hidden bottom-4 right-4">
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
    </>
  );
}
