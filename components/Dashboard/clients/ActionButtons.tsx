import React, { useState, useCallback, memo } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  X,
  Phone,
  Building2,
  MapPin,
  FileText,
  User,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import { EditModal } from "./EditModal";
import { ClientFormData } from "@/lib/form/validation";

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  address?: string | null;
  notes?: string | null;
}

interface ActionButtonsProps {
  client: Client;
  onDelete: (clientId: string) => void;
  onEdit: (clientId: string) => void;
  onUpdate: (clientId: string, data: ClientFormData) => Promise<void>;
}

// Memoized client info card component
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

// Memoized view modal component
const ViewModal = memo(
  ({ client, onClose }: { client: Client; onClose: () => void }) => (
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
        <div className="bg-white max-h-[80vh] sm:max-h-[90vh] rounded-lg xs:rounded-xl shadow-2xl w-full max-w-3xl flex flex-col">
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
          </div>
        </div>
      </motion.div>
    </>
  )
);

ViewModal.displayName = "ViewModal";

// Memoized delete dialog component
const DeleteDialog = memo(
  ({
    client,
    onClose,
    onConfirm,
    isDeleting,
  }: {
    client: Client;
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
  )
);
DeleteDialog.displayName = "DeleteDialog";

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
