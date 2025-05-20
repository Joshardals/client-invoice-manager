import { Calendar, Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";
import type { InputFieldProps } from "@/typings";

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      name,
      type = "text",
      error,
      disabled,
      hintText,
      currencySymbol,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const isDate = type === "date";
    const isCurrency = currencySymbol != null;
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-2.5">
        <label
          htmlFor={name}
          className="block text-xs xs:text-sm font-medium text-gray-700"
        >
          {label}
        </label>
        <div className="relative">
          <input
            id={name}
            name={name}
            type={inputType}
            ref={ref}
            disabled={disabled}
            className={`w-full px-3 sm:px-4 py-2 ${
              isPassword || isDate ? "pr-10" : "pr-3"
            } ${
              isCurrency ? "pl-7 sm:pl-8" : ""
            } text-sm xs:text-base border rounded-lg outline-none focus:ring-1 transition-all ${
              error
                ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
            } ${
              isDate &&
              [
                "cursor-pointer",
                "[&::-webkit-calendar-picker-indicator]:opacity-0",
                "[&::-webkit-calendar-picker-indicator]:absolute",
                "[&::-webkit-calendar-picker-indicator]:right-0",
                "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
              ].join(" ")
            }`}
            {...props}
          />
          {isCurrency && (
            <div className="absolute left-3 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none select-none">
              {currencySymbol}
            </div>
          )}
          {isPassword && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-2 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
          {isDate && (
            <Calendar
              size={16}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          )}
        </div>
        {error && <p className="text-xs xs:text-sm text-red-600">{error}</p>}
        {hintText && isPassword && !error && (
          <p className="text-xs text-gray-500">{hintText}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
