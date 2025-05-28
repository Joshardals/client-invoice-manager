import Button from "@/components/ui/Button";
import { useAddClientModal } from "@/lib/stores/useAddClientModal";
import { motion } from "framer-motion";
import { UserPlus, Users } from "lucide-react";

export function EmptyState() {
  const { open } = useAddClientModal();
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
        <div className="absolute inset-0 bg-blue-100 rounded-full" />
        <Users className="absolute inset-0 m-auto h-12 w-12 text-blue-600" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Clients Yet
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        Get started by adding your first client. <br />
        Click the button below to create a new client record.
      </p>
      <Button fullWidth={false} className="mx-auto" onClick={open}>
        <UserPlus className="w-4 h-4 mr-1.5 sm:mr-2" />
        Add New Client
      </Button>
    </motion.div>
  );
}
