import { Client } from "@/typings";
import { X, Phone, Building2, MapPin, FileText, User } from "lucide-react";
import { memo } from "react";
import { motion } from "framer-motion";

interface ViewModalProps {
  client: Client;
  onClose: () => void;
}
const ClientInfoCard = memo(
  ({
    icon: Icon,
    title,
    value,
    bgColor,
    textColor,
  }: {
    icon: typeof Phone;
    title: string;
    value: string;
    bgColor: string;
    textColor: string;
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

ClientInfoCard.displayName = "ClientInfoCard";

export function ViewModal({ client, onClose }: ViewModalProps) {
  const invoices = client.invoices || [];

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
              className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="size-5 text-gray-500" />
            </button>
            <div className="text-center mb-6">
              <div className="size-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
                <User className="size-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{client.name}</h2>
              <p className="text-gray-500 mt-1">{client.email}</p>
            </div>
          </div>

          <div className="px-6 pb-6 flex-1 overflow-y-auto">
            <div className="space-y-6">
              {/* Client Information Section */}
              <div className="grid grid-cols-1 gap-4">
                {client.phone && (
                  <ClientInfoCard
                    icon={Phone}
                    title="Phone Number"
                    value={client.phone}
                    bgColor="bg-green-50"
                    textColor="text-green-600"
                  />
                )}
                {client.company && (
                  <ClientInfoCard
                    icon={Building2}
                    title="Company"
                    value={client.company}
                    bgColor="bg-purple-50"
                    textColor="text-purple-600"
                  />
                )}
                {client.address && (
                  <ClientInfoCard
                    icon={MapPin}
                    title="Address"
                    value={client.address}
                    bgColor="bg-yellow-50"
                    textColor="text-yellow-600"
                  />
                )}
                {client.notes && (
                  <ClientInfoCard
                    icon={FileText}
                    title="Notes"
                    value={client.notes}
                    bgColor="bg-gray-50"
                    textColor="text-gray-600"
                  />
                )}
              </div>

              {/* Invoices Section */}
              {invoices.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Invoices ({invoices.length})
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                        <tr>
                          <th className="px-6 py-3 text-left">Title</th>
                          <th className="px-6 py-3 text-right">Amount</th>
                          <th className="px-6 py-3 text-center">Status</th>
                          <th className="px-6 py-3 text-right">Due Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {invoices.map((invoice) => {
                          const statusColors = getStatusColor(invoice.status);
                          return (
                            <tr key={invoice.id} className="text-sm">
                              <td className="px-6 py-4 text-gray-900">
                                {invoice.title}
                              </td>
                              <td className="px-6 py-4 text-right text-gray-900">
                                {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: invoice.currency,
                                }).format(invoice.amount)}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex justify-center">
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}
                                  >
                                    {invoice.status.charAt(0).toUpperCase() +
                                      invoice.status.slice(1)}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right text-gray-900">
                                {new Date(invoice.dueDate).toLocaleDateString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
