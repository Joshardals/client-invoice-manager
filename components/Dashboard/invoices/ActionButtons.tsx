import React, { useState, useCallback, memo } from "react";
import { Eye, Edit2, Trash2, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import { Invoice } from "@/typings";

interface ActionButtonsProps {
  invoice: Invoice;
  onDelete: (invoiceId: string) => Promise<void>;
}

// Memoized delete dialog component
const DeleteDialog = memo(
  ({
    invoice,
    onClose,
    onConfirm,
    isDeleting,
  }: {
    invoice: Invoice;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
  }) => (
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
        className="fixed flex items-center justify-center inset-0 z-50 p-4"
      >
        <div className="bg-white rounded-xl shadow-xl max-w-md p-6 break-words whitespace-pre-wrap">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Delete Invoice
            </h3>
            <p className="text-gray-500 mb-2">
              Are you sure you want to delete invoice{" "}
              <span className="font-medium text-gray-900">{invoice.title}</span>
              ?
            </p>
            <p className="text-gray-500 mb-6">
              Amount:{" "}
              <span className="font-medium text-gray-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: invoice.currency,
                }).format(invoice.amount)}
              </span>
            </p>
            <div className="flex space-x-3 *:cursor-pointer">
              <button
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isDeleting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
);

DeleteDialog.displayName = "DeleteDialog";

export function ActionButtons({ invoice, onDelete }: ActionButtonsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useLockBodyScroll(deleteDialogOpen);

  const handleDelete = useCallback(async () => {
    if (onDelete) {
      try {
        setIsDeleting(true);
        await onDelete(invoice.id);
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error("Failed to delete invoice:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  }, [invoice.id, onDelete]);

  const closeDeleteDialog = useCallback(() => setDeleteDialogOpen(false), []);

  return (
    <>
      <div className="flex space-x-2 *:cursor-pointer">
        <button className="text-blue-600 hover:text-blue-800">
          <Eye className="h-4 w-4 xs:h-5 xs:w-5" />
        </button>
        <button className="text-yellow-600 hover:text-yellow-800">
          <Edit2 className="h-4 w-4 xs:h-5 xs:w-5" />
        </button>
        <button
          onClick={() => setDeleteDialogOpen(true)}
          className="text-red-600 hover:text-red-800"
        >
          <Trash2 className="h-4 w-4 xs:h-5 xs:w-5" />
        </button>
      </div>

      <AnimatePresence>
        {deleteDialogOpen && (
          <DeleteDialog
            invoice={invoice}
            onClose={closeDeleteDialog}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
    </>
  );
}
