"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

export default function ClientsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Clients page error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-red-50 p-6 sm:p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6"
            >
              <AlertCircle className="h-8 w-8 text-red-600" />
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600">
              {error.message ||
                "An unexpected error occurred while loading clients."}
            </p>
          </div>

          <div className="px-6 py-4 sm:px-8 sm:py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={reset}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-medium transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <RotateCcw className="h-4 w-4" />
                Try again
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-medium border border-gray-200 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh page
              </motion.button>
            </div>

            <p className="mt-4 text-sm text-gray-500">
              If the problem persists, please contact support or try again
              later.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
