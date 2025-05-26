import React, { useState } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  X,
  Phone,
  Mail,
  Building2,
  MapPin,
  FileText,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  onDelete?: (clientId: string) => void;
  onEdit?: (clientId: string) => void;
}

export function ActionButtons({
  client,
  onDelete,
  onEdit,
}: ActionButtonsProps) {
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(client.id);
      setDeleteDialogOpen(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(client.id);
    }
  };

  return (
    <>
      <div className="flex space-x-2">
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

      {/* View Modal */}
      <AnimatePresence>
        {viewModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setViewModalOpen(false)}
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
                    onClick={() => setViewModalOpen(false)}
                    className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="size-5 text-gray-500" />
                  </button>
                  <div className="text-center mb-6">
                    <div className="size-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
                      <User className="size-8 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {client.name}
                    </h2>
                    <p className="text-gray-500 mt-1">{client.email}</p>
                  </div>
                </div>

                <div className="px-6 pb-6 flex-1 overflow-y-auto">
                  <div className="grid grid-cols-1 gap-4">
                    {/* Phone Number */}
                    {client.phone && (
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="p-2 bg-green-50 rounded-lg">
                            <Phone className="h-5 w-5 text-green-600" />
                          </span>
                          <p className="text-sm font-medium text-gray-600">
                            Phone Number
                          </p>
                        </div>
                        <p className="text-gray-900 pl-11">{client.phone}</p>
                      </div>
                    )}

                    {/* Company */}
                    {client.company && (
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="p-2 bg-purple-50 rounded-lg">
                            <Building2 className="h-5 w-5 text-purple-600" />
                          </span>
                          <p className="text-sm font-medium text-gray-600">
                            Company
                          </p>
                        </div>
                        <p className="text-gray-900 pl-11">{client.company}</p>
                      </div>
                    )}

                    {/* Address */}
                    {client.address && (
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="p-2 bg-yellow-50 rounded-lg">
                            <MapPin className="h-5 w-5 text-yellow-600" />
                          </span>
                          <p className="text-sm font-medium text-gray-600">
                            Address
                          </p>
                        </div>
                        <p className="text-gray-900 pl-11">{client.address}</p>
                      </div>
                    )}

                    {/* Notes */}
                    {client.notes && (
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="p-2 bg-gray-50 rounded-lg">
                            <FileText className="h-5 w-5 text-gray-600" />
                          </span>
                          <p className="text-sm font-medium text-gray-600">
                            Notes
                          </p>
                        </div>
                        <p className="text-gray-900 pl-11 whitespace-pre-wrap">
                          {client.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {deleteDialogOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setDeleteDialogOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
                    <Trash2 className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Delete Client
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-gray-900">
                      {client.name}
                    </span>
                    ? This action cannot be undone.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setDeleteDialogOpen(false)}
                      className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 px-4 py-2.5 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
