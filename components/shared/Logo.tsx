import React from "react";
import { motion } from "framer-motion";

interface LogoProps {
  isOpen: boolean;
  size?: number;
  label?: string;
  className?: string;
}

export function Logo({
  isOpen,
  size = 40,
  label = "Invoxa",
  className = "",
}: LogoProps) {
  return (
    <div
      className={`flex items-center ${className}`}
      style={{ minHeight: size, minWidth: isOpen ? "auto" : size }}
    >
      <motion.div
        initial={false}
        animate={{ scale: isOpen ? 1 : 0.9 }}
        className={`flex items-center justify-center rounded-xl bg-blue-500`}
        style={{ width: size, height: size }}
      >
        <span className="text-xl font-bold text-white select-none">I</span>
      </motion.div>
      {isOpen && (
        <span className="ml-3 font-semibold text-lg text-white select-none">
          {label}
        </span>
      )}
    </div>
  );
}
