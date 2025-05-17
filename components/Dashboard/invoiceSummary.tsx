import React, { useMemo } from "react";
import { FileText, Calendar, Receipt } from "lucide-react";
import { motion } from "framer-motion";
import Table from "../ui/Table";

interface InvoiceItem {
  id: string | number;
  description: string;
  quantity: number;
  rate: number;
}

interface Client {
  id: string;
  name: string;
}

interface InvoiceFormData {
  title?: string;
  description?: string;
  invoiceDate?: string;
  dueDate?: string;
  currency?: string;
  clientId?: string;
  items?: InvoiceItem[];
}

interface InvoiceSummaryProps {
  invoiceData: InvoiceFormData;
  clients: Client[];
}

export function InvoiceSummary({ invoiceData, clients }: InvoiceSummaryProps) {
  const selectedClient = clients.find(
    (client) => client.id === invoiceData?.clientId
  );

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: invoiceData?.currency || "NGN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const grandTotal =
    invoiceData?.items?.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    ) || 0;

  // Transform items to ensure they have IDs
  const tableData: InvoiceItem[] = useMemo(() => {
    return (invoiceData?.items || []).map((item, index) => ({
      ...item,
      id: item.id || `item-${index}`,
    }));
  }, [invoiceData?.items]);

  const columns = useMemo(
    () => [
      {
        header: "Description",
        accessor: "description" as keyof InvoiceItem,
      },
      {
        header: "Quantity",
        accessor: (item: InvoiceItem) => item.quantity,
      },
      {
        header: "Rate",
        accessor: (item: InvoiceItem) => formatAmount(item.rate),
      },
      {
        header: "Total",
        accessor: (item: InvoiceItem) =>
          formatAmount(item.quantity * item.rate),
      },
    ],
    [invoiceData?.currency]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 sm:space-y-6"
    >
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-purple-100 p-2 sm:p-3 rounded-lg">
              <Receipt className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                {invoiceData?.title || "Untitled Invoice"}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {invoiceData?.description || "No description provided"}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Dates & Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-medium text-gray-500">
                Invoice Date
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm sm:text-base text-gray-900">
                  {invoiceData?.invoiceDate}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-medium text-gray-500">
                Due Date
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm sm:text-base text-gray-900">
                  {invoiceData?.dueDate}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-xs sm:text-sm font-medium text-gray-500">
                Client
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-sm sm:text-base text-gray-900">
                  {selectedClient?.name || "No client selected"}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mt-4 sm:mt-6">
            <div className="text-xs sm:text-sm font-medium text-gray-500 mb-3">
              Invoice Items
            </div>
            <Table data={tableData} columns={columns} isAnimated={false} />
            <div className="mt-4 flex justify-end">
              <div className="bg-gray-50 px-4 py-2 sm:px-6 sm:py-3 rounded-lg">
                <span className="text-sm sm:text-base font-medium text-gray-500 mr-4">
                  Grand Total:
                </span>
                <span className="text-sm sm:text-base font-bold text-gray-900">
                  {formatAmount(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
