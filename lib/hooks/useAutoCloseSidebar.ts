import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useAutoCloseSidebar(setIsOpen: (val: boolean) => void) {
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);
}
