import React, { memo } from "react";
import { motion } from "framer-motion";
import {
  X,
  User,
  Calendar,
  Clock,
  Building2,
  Phone,
  MapPin,
  FileText,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock4,
  Receipt,
  LucideIcon,
  DollarSign,
} from "lucide-react";
import { Invoice, InvoiceItem } from "@/typings";

interface ViewModalProps {
  invoice: Invoice;
  onClose: () => void;
}

const InfoCard = memo(
  ({
    icon: Icon,
    title,
    value,
    bgColor = "bg-gray-50",
    textColor = "text-gray-600",
  }: {
    icon: LucideIcon;
    title: string;
    value: string;
    bgColor?: string;
    textColor?: string;
  }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
      <div className="flex items-center gap-3 mb-2">
        <span className={`p-2 ${bgColor} rounded-lg`}>
          <Icon className={`h-5 w-5 ${textColor}`} />
        </span>
        <p className="text-sm font-medium text-gray-600">{title}</p>
      </div>
      <p className="text-gray-900 pl-11 whitespace-pre-wrap">{value}</p>
    </div>
  )
);

InfoCard.displayName = "InfoCard";

const ItemsTable = memo(
  ({ items, currency }: { items: InvoiceItem[]; currency: string }) => (
    <div className="bg-white border border-gray-100 rounded-xl overflow-auto">
      <table className="w-full">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-6 py-3 text-left">Description</th>
            <th className="px-6 py-3 text-right">Quantity</th>
            <th className="px-6 py-3 text-right">Rate</th>
            <th className="px-6 py-3 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item, index) => (
            <tr key={index} className="text-sm">
              <td className="px-6 py-4 text-gray-900">{item.description}</td>
              <td className="px-6 py-4 text-right text-gray-900">
                {item.quantity}
              </td>
              <td className="px-6 py-4 text-right text-gray-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency,
                }).format(item.rate)}
              </td>
              <td className="px-6 py-4 text-right text-gray-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency,
                }).format(item.total)}
              </td>
            </tr>
          ))}
          <tr className="bg-gray-50 font-medium">
            <td colSpan={3} className="px-6 py-4 text-right text-gray-900">
              Total Amount:
            </td>
            <td className="px-6 py-4 text-right text-gray-900">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency,
              }).format(items.reduce((sum, item) => sum + item.total, 0))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
);

ItemsTable.displayName = "ItemsTable";

export function ViewModal({ invoice, onClose }: ViewModalProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return { bg: "bg-green-50", text: "text-green-600" };
      case "overdue":
        return { bg: "bg-red-50", text: "text-red-600" };
      default:
        return { bg: "bg-yellow-50", text: "text-yellow-600" };
    }
  };

  const statusColors = getStatusColor(invoice.status);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      >
        <div className="bg-white max-h-[80vh] sm:max-h-[90vh] rounded-lg xs:rounded-xl shadow-2xl w-full max-w-4xl flex flex-col">
          <div className="relative px-6 pt-6">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="size-5 text-gray-500" />
            </button>
            <div className="text-center mb-6">
              <div className="size-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <Receipt className="size-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {invoice.title}
              </h2>
              <p className="text-gray-500 mt-1">
                {invoice.description || "No description provided"}
              </p>
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${statusColors.bg} ${statusColors.text} mt-3`}
              >
                <span className="font-medium">
                  {invoice.status.charAt(0).toUpperCase() +
                    invoice.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6 flex-1 overflow-y-auto">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard
                  icon={Calendar}
                  title="Invoice Date"
                  value={invoice.invoiceDate.toLocaleDateString()}
                  bgColor="bg-purple-50"
                  textColor="text-purple-600"
                />
                <InfoCard
                  icon={Clock}
                  title="Due Date"
                  value={invoice.dueDate.toLocaleDateString()}
                  bgColor="bg-blue-50"
                  textColor="text-blue-600"
                />
                <InfoCard
                  icon={DollarSign}
                  title="Total Amount"
                  value={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: invoice.currency,
                  }).format(invoice.amount)}
                  bgColor="bg-green-50"
                  textColor="text-green-600"
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Client Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard
                    icon={User}
                    title="Name"
                    value={invoice.client.name}
                    bgColor="bg-orange-50"
                    textColor="text-orange-600"
                  />
                  <InfoCard
                    icon={Mail}
                    title="Email"
                    value={invoice.client.email}
                    bgColor="bg-yellow-50"
                    textColor="text-yellow-600"
                  />
                  {invoice.client.company && (
                    <InfoCard
                      icon={Building2}
                      title="Company"
                      value={invoice.client.company}
                      bgColor="bg-indigo-50"
                      textColor="text-indigo-600"
                    />
                  )}
                  {invoice.client.phone && (
                    <InfoCard
                      icon={Phone}
                      title="Phone"
                      value={invoice.client.phone}
                      bgColor="bg-pink-50"
                      textColor="text-pink-600"
                    />
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Invoice Items
                </h3>
                <ItemsTable items={invoice.items} currency={invoice.currency} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
