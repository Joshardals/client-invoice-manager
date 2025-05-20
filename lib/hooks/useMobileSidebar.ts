import { useState } from "react";

export function useMobileSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const open = () => setIsMobileOpen(true);
  const close = () => setIsMobileOpen(false);
  const toggle = () => setIsMobileOpen((prev) => !prev);

  return {
    isMobileOpen,
    open,
    close,
    toggle,
  };
}
