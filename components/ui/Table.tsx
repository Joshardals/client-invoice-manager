import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface TableColumn<T> {
  header: string | (() => React.ReactNode);
  accessor: keyof T | ((item: T) => React.ReactNode);
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  isAnimated?: boolean;
}

type SortOrder = "asc" | "desc" | null;

export default function Table<T extends { id?: number | string }>({
  data,
  columns,
  actions,
  onRowClick,
  isAnimated = true,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    order: SortOrder;
  }>({
    key: null,
    order: null,
  });

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
  };

  const getSortedData = () => {
    if (!sortConfig.key || !sortConfig.order) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key!];
      const bValue = b[sortConfig.key!];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.order === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (aValue < bValue) return sortConfig.order === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.order === "asc" ? 1 : -1;
      return 0;
    });
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
    accessor: keyof T | ((item: T) => React.ReactNode)
  ) => {
    if (typeof accessor === "function") {
      return accessor(item);
    }

    const value = item[accessor];
    if (value === null || value === undefined || value === "") {
      return "-";
    }
    return value as React.ReactNode;
  };

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
                    typeof column.accessor !== "function"
                      ? "cursor-pointer hover:bg-gray-100"
                      : ""
                  }`}
                  onClick={() =>
                    typeof column.accessor !== "function" &&
                    handleSort(column.accessor)
                  }
                >
                  <span className="flex items-center">
                    {typeof column.header === "function"
                      ? column.header()
                      : column.header}
                    {typeof column.accessor !== "function" &&
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
          <tbody className="divide-y divide-gray-200">
            {getSortedData().map((item, rowIndex) => (
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
                    {renderCellContent(item, column.accessor)}
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
    </motion.div>
  );
}
