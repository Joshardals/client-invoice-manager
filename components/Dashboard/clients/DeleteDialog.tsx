import { Client } from "@/typings";
import { Loader2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface DeleteDialogProps {
  client: Client;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export default function DeleteDialog({
  client,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteDialogProps) {
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
        className="fixed flex items-center justify-center inset-0 z-50 p-4"
      >
        <div className="bg-white rounded-xl shadow-xl max-w-md p-6 break-words whitespace-pre-wrap">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
              <Trash2 className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Delete Client
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">{client.name}</span>?
              This action cannot be undone.
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
  );
}
