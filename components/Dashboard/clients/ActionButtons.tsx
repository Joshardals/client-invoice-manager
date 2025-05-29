"use client";
import React, { useState, useCallback } from "react";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import { EditModal } from "./EditModal";
import { ClientFormData } from "@/lib/form/validation";
import { Client } from "@/typings";
import { ViewModal } from "./ViewModal";
import DeleteDialog from "./DeleteDialog";

interface ActionButtonsProps {
  client: Client;
  onDelete: (clientId: string) => void;
  onEdit: (clientId: string) => void;
  onUpdate: (clientId: string, data: ClientFormData) => Promise<void>;
}

export function ActionButtons({
  client,
  onDelete,
  onEdit,
  onUpdate,
}: ActionButtonsProps) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useLockBodyScroll(viewModalOpen || deleteDialogOpen || editModalOpen);

  const handleDelete = useCallback(async () => {
    if (onDelete) {
      try {
        setIsDeleting(true);
        await onDelete(client.id);
        setDeleteDialogOpen(false);
      } catch (error) {
        console.error("Failed to delete client:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  }, [client.id, onDelete]);

  const handleEdit = useCallback(() => {
    if (onEdit) {
      onEdit(client.id);
    }
  }, [client.id, onEdit]);

  const closeViewModal = useCallback(() => setViewModalOpen(false), []);
  const closeDeleteDialog = useCallback(() => setDeleteDialogOpen(false), []);
  const closeEditModal = useCallback(() => setEditModalOpen(false), []);

  return (
    <>
      <div className="flex space-x-2 *:cursor-pointer">
        <button
          onClick={() => setViewModalOpen(true)}
          className="text-blue-600 hover:text-blue-800"
        >
          <Eye className="h-4 w-4 xs:h-5 xs:w-5" />
        </button>
        <button
          onClick={handleEdit}
          className="text-yellow-600 hover:text-yellow-800"
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
          <ViewModal client={client} onClose={closeViewModal} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editModalOpen && (
          <EditModal
            client={client}
            isOpen={editModalOpen}
            onClose={closeEditModal}
            onUpdate={onUpdate}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteDialogOpen && (
          <DeleteDialog
            client={client}
            onClose={closeDeleteDialog}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
    </>
  );
}
