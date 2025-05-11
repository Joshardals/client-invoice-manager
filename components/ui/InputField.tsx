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
      <div className="space-y-1">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="relative">
          <input
            id={name}
            name={name}
            type={inputType}
            ref={ref}
            disabled={disabled}
            className={`w-full px-4 py-2 pr-10 border rounded-lg outline-none focus:ring-2 focus:ring-offset-2 transition-all ${
              error
                ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
            }`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className="absolute bg-red-500 right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 z-10"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        {hintText && isPassword && !error && (
          <p className="text-xs text-gray-500">{hintText}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
