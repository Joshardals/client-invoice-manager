import React, { useState, useMemo } from "react";
import { ChevronDown, Search } from "lucide-react";

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
  placeholder = "Select a client...",
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
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>

      <button
        type="button"
        disabled={disabled}
        className={`w-full px-3 py-2 text-left bg-white border rounded-lg flex items-center justify-between ${
          error ? "border-red-500" : "border-gray-300"
        } ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className="truncate">{selectedOption?.label || placeholder}</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}

      {isOpen && !disabled && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
              />
            </div>
          </div>

          <div className="max-h-60 overflow-auto" onScroll={handleScroll}>
            {paginatedOptions.length === 0 ? (
              <div className="p-3 text-sm text-gray-500 text-center">
                No clients found
              </div>
            ) : (
              paginatedOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center ${
                    option.value === value ? "bg-purple-50 text-purple-700" : ""
                  }`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

