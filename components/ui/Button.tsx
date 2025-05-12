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
    "flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

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
