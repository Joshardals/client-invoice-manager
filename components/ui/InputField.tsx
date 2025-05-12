import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState } from "react";
import type { InputFieldProps } from "@/typings";

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    { label, name, type = "text", error, disabled, hintText, ...props },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="space-y-2">
        <label
          htmlFor={name}
          className="block text-base font-medium text-gray-700 mb-1"
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
            className={`
            w-full px-4 py-3.5 border-2 rounded-xl text-base
            outline-none transition-all duration-200
            ${disabled ? "bg-gray-50" : "bg-white"}
            ${
              error
                ? "border-red-300 focus:ring-4 focus:ring-red-100 focus:border-red-400"
                : "border-gray-200 focus:ring-4 focus:ring-blue-50 focus:border-blue-400"
            }
          `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 
              hover:text-gray-700 active:text-gray-900 transition-colors
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              rounded-lg touch-manipulation"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-600 mt-1.5 ml-1">{error}</p>}
        {hintText && isPassword && !error && (
          <p className="text-sm text-gray-500 mt-1.5 ml-1">{hintText}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
