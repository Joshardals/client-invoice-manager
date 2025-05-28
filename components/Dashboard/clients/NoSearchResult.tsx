import { SearchX } from "lucide-react";
import { motion } from "framer-motion";

interface NoSearchResultsProps {
  searchTerm: string;
  onReset: () => void;
}

export function NoSearchResults({ searchTerm, onReset }: NoSearchResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-16 flex flex-col items-center justify-center text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative mx-auto w-24 h-24 mb-8"
      >
        <div className="absolute inset-0 bg-gray-100 rounded-full" />
        <SearchX className="absolute inset-0 m-auto h-12 w-12 text-gray-600" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Results Found
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        No clients found matching "
        <span className="font-medium">{searchTerm}</span>"
        <br />
        Try adjusting your search terms or clear the search.
      </p>
      <button
        onClick={onReset}
        className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors cursor-pointer"
      >
        Clear Search
      </button>
    </motion.div>
  );
}
