import React from "react";
import { Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = ({ type = "button", loading = false, disabled = false, className, children, ...props }: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={`
        w-full px-6 py-3.5 text-base font-medium
        rounded-xl bg-blue-600 text-white
        transition-all duration-200
        ${loading || disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg hover:-translate-y-0.5'
        }
        focus:outline-none focus:ring-4 focus:ring-blue-100
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin mx-auto" size={24} />
      ) : (
        children
      )}
    </button>
  );
};
export default Button;
