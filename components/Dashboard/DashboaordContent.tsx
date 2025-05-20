"use client";
import { useSidebarStore } from "@/lib/stores/sidebar-store";

export function DashboardContent({ children }: { children: React.ReactNode }) {
  const sidebarOpen = useSidebarStore((state) => state.isOpen);
  const hasHydrated = useSidebarStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return null; // Or skeleton
  }

  return (
    <main
      className={`flex-1 ${sidebarOpen ? "lg:ml-64" : "lg:ml-20"} transition-all duration-300 p-4 sm:p-6 lg:p-8`}
    >
      <div className="pt-16 lg:pt-0">{children}</div>
    </main>
  );
}
