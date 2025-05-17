import { SelectFieldProps } from "@/typings";
import { ChevronDown } from "lucide-react";
import { forwardRef } from "react";

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, name, error, disabled, options, ...props }, ref) => {
    return (
      <div className="space-y-2.5">
        {label && (
          <label
            htmlFor={name}
            className="block text-xs sm:text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={name}
            name={name}
            ref={ref}
            disabled={disabled}
            className={`w-full h-10 px-3 sm:px-4 py-2 pr-10 text-sm sm:text-base 
              border rounded-lg appearance-none outline-none 
              transition-all
              disabled:bg-gray-50 disabled:text-gray-500
              ${
                error
                  ? "border-red-300 focus:ring-1 focus:ring-red-200 focus:border-red-400"
                  : "border-gray-300 focus:ring-1 focus:ring-blue-200 focus:border-blue-400"
              }`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <ChevronDown
              className={`w-4 h-4 ${error ? "text-red-500" : "text-gray-500"}`}
            />
          </div>
        </div>
        {error && <p className="text-xs sm:text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

SelectField.displayName = "SelectField";

export default SelectField;
