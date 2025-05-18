import React from "react";

interface MobileLogoProps {
  label?: string;
  className?: string;
}

export function MobileLogo({
  label = "InvoiceApp",
  className = "",
}: MobileLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
        <span className="text-xl font-bold text-white select-none">I</span>
      </div>
      <span className="ml-3 font-semibold text-lg text-white select-none">
        {label}
      </span>
    </div>
  );
}
