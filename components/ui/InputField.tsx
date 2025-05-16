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
      <div className="space-y-2.5">
        <label
          htmlFor={name}
          className="block text-xs sm:text-sm font-medium text-gray-700"
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
            className={`w-full px-3 sm:px-4 py-2 pr-8 text-sm sm:text-base border rounded-lg outline-none focus:ring-1 transition-all ${
              error
                ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                : "border-gray-300 focus:ring-blue-200 focus:border-blue-400"
            }`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className="absolute px-2 right-[0.04rem] h-full rounded-lg text-gray-500 hover:text-gray-700 cursor-pointer z-10"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <p className="text-xs sm:text-sm text-red-600">{error}</p>}
        {hintText && isPassword && !error && (
          <p className="text-xs text-gray-500">{hintText}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
