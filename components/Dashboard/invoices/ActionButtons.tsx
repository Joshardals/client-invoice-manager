import React, { useState, useCallback, memo } from "react";
import { Eye, Edit2, Trash2, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import { Invoice } from "@/typings";
import { ViewModal } from "./ViewModal";
import { DeleteDialog } from "./DeleteDialog";
import { EditModal } from "./EditModal";
``;
interface ActionButtonsProps {
  invoice: Invoice;
  clients: { id: string; name: string }[];
  onDelete: (invoiceId: string) => Promise<void>;
}

export function ActionButtons({
  invoice,
  clients,
  onDelete,
}: ActionButtonsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useLockBodyScroll(viewModalOpen || editModalOpen || deleteDialogOpen);

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

  const closeViewModal = useCallback(() => setViewModalOpen(false), []);
  const closeDeleteDialog = useCallback(() => setDeleteDialogOpen(false), []);
  const closeEditModal = useCallback(() => setEditModalOpen(false), []);

  return (
    <>
      <div className="flex space-x-2 *:cursor-pointer">
        <button
          className="text-blue-600 hover:text-blue-800"
          onClick={() => setViewModalOpen(true)}
        >
          <Eye className="h-4 w-4 xs:h-5 xs:w-5" />
        </button>
        <button
          className="text-yellow-600 hover:text-yellow-800"
          onClick={() => setEditModalOpen(true)}
        >
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
        {viewModalOpen && (
          <ViewModal invoice={invoice} onClose={closeViewModal} />
        )}
      </AnimatePresence>

      {editModalOpen && (
        <EditModal
          invoice={invoice}
          isOpen={editModalOpen}
          onClose={closeEditModal}
          clients={clients}
        />
      )}

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
