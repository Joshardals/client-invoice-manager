import React, { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  value: string;
  label: string;
}

interface VirtualizedSelectProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  label: React.ReactNode;
  error?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function VirtualizedSelect({
  options,
  value,
  onChange,
  label,
  error,
  name,
  placeholder = "Select an option...",
  disabled = false,
}: VirtualizedSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const itemsPerPage = 50;

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const paginatedOptions = useMemo(() => {
    return filteredOptions.slice(0, (page + 1) * itemsPerPage);
  }, [filteredOptions, page]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const bottom =
      target.scrollHeight - target.scrollTop === target.clientHeight;
    if (bottom && paginatedOptions.length < filteredOptions.length) {
      setPage((prev) => prev + 1);
    }
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative space-y-2.5">
      <label className="block text-xs xs:text-sm font-medium text-gray-700">
        {label}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`
          w-full px-3 sm:px-4 py-2 text-sm xs:text-base
          bg-white border rounded-lg
          flex items-center justify-between
          transition-colors duration-200
          ${
            error
              ? "border-red-300 focus:ring-red-200 focus:border-red-400"
              : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
          }
          ${disabled ? "bg-gray-50 cursor-not-allowed" : "hover:border-gray-400"}
        `}
      >
        <span className="truncate text-left flex-1">
          {selectedOption?.label || placeholder}
        </span>
        <ChevronDown className="size-4 xs:size-5 text-gray-400 flex-shrink-0 ml-2" />
      </button>

      {error && <p className="text-xs xs:text-sm text-red-600">{error}</p>}

      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-9 pr-3 py-2 text-sm xs:text-base
                    border border-gray-200 rounded-lg
                    outline-none focus:ring-1 focus:ring-purple-200 focus:border-purple-400
                    transition-all duration-200"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(0);
                  }}
                />
              </div>
            </div>

            <div
              className="max-h-60 overflow-auto overscroll-contain scroll-smooth"
              onScroll={handleScroll}
            >
              {paginatedOptions.length === 0 ? (
                <div className="p-3 text-sm text-gray-500 text-center">
                  No options found
                </div>
              ) : (
                paginatedOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`
                      w-full px-3 sm:px-4 py-2 text-sm xs:text-base text-left
                      flex items-center capitalize
                      transition-colors duration-200 cursor-pointer
                      ${
                        option.value === value
                          ? "bg-purple-50 text-purple-700"
                          : "hover:bg-gray-50"
                      }
                    `}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
