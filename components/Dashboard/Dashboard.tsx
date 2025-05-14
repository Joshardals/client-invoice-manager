"use client";
import React from "react";
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
} from "lucide-react";

export function Dashboard() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const stats = [
    { title: "Total Clients", value: "24", icon: Users, color: "bg-blue-500" },
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
  ];

  const recentInvoices = [
    {
      client: "Apex Solutions",
      amount: "₦150,000",
      status: "Paid",
      date: "2025-05-10",
    },
    {
      client: "Global Tech",
      amount: "₦80,000",
      status: "Unpaid",
      date: "2025-05-08",
    },
    {
      client: "Metro Systems",
      amount: "₦200,000",
      status: "Paid",
      date: "2025-05-05",
    },
    {
      client: "Delta Corp",
      amount: "₦120,000",
      status: "Unpaid",
      date: "2025-05-03",
    },
    {
      client: "Echo Industries",
      amount: "₦90,000",
      status: "Paid",
      date: "2025-05-01",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              Welcome back, Joshua
            </h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600">{today}</p>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 sm:gap-3">
            <button className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
              <PlusCircle className="w-4 h-4 mr-1.5 sm:mr-2" />
              Add Client
            </button>
            <button className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
              <FilePlus className="w-4 h-4 mr-1.5 sm:mr-2" />
              Create Invoice
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">
                Recent Invoices
              </h2>
              <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm sm:text-base">
                <FileSearch className="w-4 h-4 mr-1.5 sm:mr-2" />
                View All
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentInvoices.map((invoice, index) => (
                  <tr key={index}>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {invoice.client}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {invoice.amount}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                      {invoice.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Notifications */}
        <div className="fixed bottom-4 right-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200"
          >
            <div className="flex items-center text-yellow-600">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              <p className="text-xs sm:text-sm">
                Invoice to Global Tech is overdue
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
