import Button from "@/components/ui/Button";
import { useCreateInvoiceModal } from "@/lib/stores/useCreateInvoiceModal";
import { motion } from "framer-motion";
import { FilePlus, FileText, Plus } from "lucide-react";

export function EmptyState() {
  const { open: openInvoiceModal } = useCreateInvoiceModal();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mx-auto w-24 h-24 mb-8"
      >
        <div className="absolute inset-0 bg-purple-100 rounded-full" />
        <FileText className="absolute inset-0 m-auto h-12 w-12 text-purple-600" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Invoices Yet
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Get started by creating your first invoice. <br />
        Click the button below to create a new invoice record.
      </p>
      <Button
        fullWidth={false}
        className="mx-auto bg-purple-600 hover:bg-purple-700"
        onClick={openInvoiceModal}
      >
        <FilePlus className="w-4 h-4 mr-1.5 sm:mr-2" />
        Create New Invoice
      </Button>
    </motion.div>
  );
}
