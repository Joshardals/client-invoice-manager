"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface TableColumn<T> {
  header: string | (() => React.ReactNode);
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  isAnimated?: boolean;
  itemsPerPage?: number;
}

type SortOrder = "asc" | "desc" | null;

const STATUS_PRIORITY: Record<string, number> = {
  PAID: 1,
  PENDING: 2,
  OVERDUE: 3,
};

export default function Table<T extends { id?: number | string }>({
  data,
  columns,
  actions,
  onRowClick,
  isAnimated = true,
  itemsPerPage = 10,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    order: SortOrder;
  }>({
    key: null,
    order: null,
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (accessor: keyof T | ((item: T) => React.ReactNode)) => {
    if (typeof accessor === "function") return;

    setSortConfig((prev) => ({
      key: accessor,
      order:
        prev.key === accessor
          ? prev.order === "asc"
            ? "desc"
            : prev.order === "desc"
              ? null
              : "asc"
          : "asc",
    }));
    setCurrentPage(1);
  };

  const getSortedData = () => {
    if (!sortConfig.key || !sortConfig.order) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      // Special handling for status sorting
      if (sortConfig.key === "status") {
        const statusA = String(aValue).toUpperCase();
        const statusB = String(bValue).toUpperCase();

        const priorityA = STATUS_PRIORITY[statusA] || 999;
        const priorityB = STATUS_PRIORITY[statusB] || 999;

        return sortConfig.order === "asc"
          ? priorityA - priorityB
          : priorityB - priorityA;
      }

      // Default string comparison for other fields
      const compareA = convertToString(aValue);
      const compareB = convertToString(bValue);

      return sortConfig.order === "asc"
        ? compareA.localeCompare(compareB)
        : compareB.localeCompare(compareA);
    });
  };
  const convertToString = <T extends unknown>(value: T): string => {
    if (value === null || value === undefined) {
      return "";
    }

    // Handle nested client object
    if (typeof value === "object" && value !== null && "name" in value) {
      return (value as { name: string }).name.toLowerCase();
    }

    // Handle Date objects
    if (value instanceof Date) {
      return value.toISOString();
    }

    // Handle all other cases
    return String(value).toLowerCase();
  };

  const getSortIcon = (accessor: keyof T | ((item: T) => React.ReactNode)) => {
    if (typeof accessor === "function") return null;

    if (sortConfig.key !== accessor) {
      return (
        <ArrowUpDown className="w-4 h-4 inline-block ml-1 text-gray-400" />
      );
    }

    if (sortConfig.order === "asc") {
      return <ArrowUp className="w-4 h-4 inline-block ml-1 text-blue-500" />;
    }

    if (sortConfig.order === "desc") {
      return <ArrowDown className="w-4 h-4 inline-block ml-1 text-blue-500" />;
    }

    return <ArrowUpDown className="w-4 h-4 inline-block ml-1 text-gray-400" />;
  };

  const renderCellContent = (
    item: T,
    column: TableColumn<T>
  ): React.ReactNode => {
    if (column.render) {
      return column.render(item);
    }

    if (typeof column.accessor === "function") {
      return column.accessor(item);
    }

    const value = item[column.accessor];
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    // Handle Date objects
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    // Handle nested objects (like client.name)
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }

    return String(value);
  };

  const totalItems = getSortedData().length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const getPaginatedData = () => {
    return getSortedData().slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-6 bg-white rounded-xl shadow-sm">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={isAnimated ? { opacity: 0, y: 20 } : false}
      animate={isAnimated ? { opacity: 1, y: 0 } : false}
      className="bg-white rounded-xl shadow-sm overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={`px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none whitespace-nowrap ${
                    column.sortable !== false &&
                    typeof column.accessor !== "function"
                      ? "cursor-pointer hover:bg-gray-100"
                      : ""
                  }`}
                  onClick={() =>
                    column.sortable !== false &&
                    typeof column.accessor !== "function" &&
                    handleSort(column.accessor)
                  }
                >
                  <span className="flex items-center">
                    {typeof column.header === "function"
                      ? column.header()
                      : column.header}
                    {column.sortable !== false &&
                      typeof column.accessor !== "function" &&
                      getSortIcon(column.accessor)}
                  </span>
                </th>
              ))}
              {actions && (
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 ">
            {getPaginatedData().map((item, rowIndex) => (
              <motion.tr
                key={item.id || rowIndex}
                initial={isAnimated ? { opacity: 0 } : false}
                animate={isAnimated ? { opacity: 1 } : false}
                transition={{ delay: rowIndex * 0.1 }}
                className={`${rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"} ${
                  onRowClick ? "cursor-pointer hover:bg-gray-50" : ""
                }`}
                onClick={() => onRowClick?.(item)}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs xs:text-sm text-gray-900"
                  >
                    {renderCellContent(item, column)}
                  </td>
                ))}
                {actions && (
                  <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
                    {actions(item)}
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="border-t border-gray-200">
          <div className="flex items-center justify-between gap-2 px-3 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span>{" "}
                  to <span className="font-medium">{endIndex}</span> of{" "}
                  <span className="font-medium">{totalItems}</span> results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>
                  {getPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      aria-current={
                        currentPage === pageNum ? "page" : undefined
                      }
                      className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
                        currentPage === pageNum
                          ? "z-10 bg-blue-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                          : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
