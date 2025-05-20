import React from "react";
import { motion } from "framer-motion";

interface TableColumn<T> {
  header: string | (() => React.ReactNode);
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  isAnimated?: boolean;
}

export default function Table<T extends { id?: number | string }>({
  data,
  columns,
  actions,
  onRowClick,
  isAnimated = true,
}: TableProps<T>) {
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
                  className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {typeof column.header === "function"
                    ? column.header()
                    : column.header}
                </th>
              ))}
              {actions && (
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((item, rowIndex) => (
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
                    {typeof column.accessor === "function"
                      ? column.accessor(item)
                      : (item[column.accessor] as React.ReactNode)}
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
