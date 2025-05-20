import React from "react";

interface MobileLogoProps {
  label?: string;
  className?: string;
}

export function MobileLogo({
  label = "Invoxa",
  className = "",
}: MobileLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="size-10 bg-blue-500 rounded-xl flex items-center justify-center">
        <span className="text-xl font-bold text-white select-none">I</span>
      </div>
      {/* text-xl sm:text-2xl */}
      <span className="text-2xl ml-3 font-semibold  text-white select-none">
        {label}
      </span>
    </div>
  );
}
