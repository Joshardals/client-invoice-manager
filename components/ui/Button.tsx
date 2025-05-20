import React from "react";
import { Loader2 } from "lucide-react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = ({
  type = "button",
  loading = false,
  disabled = false,
  fullWidth = true,
  className,
  children,
  ...props
}: ButtonProps) => {
  const baseStyles =
    "flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none cursor-pointer select-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm min-[320px]:text-base";

  const widthStyles = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      type={type}
      disabled={loading || disabled}
      className={twMerge(baseStyles, widthStyles, className)}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : children}
    </button>
  );
};

export default Button;
