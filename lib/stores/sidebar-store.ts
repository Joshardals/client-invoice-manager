import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  hasHydrated: boolean;
  toggle: () => void;
  setOpen: (value: boolean) => void;
  setHasHydrated: (state: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: true,
      hasHydrated: false,
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),
      setOpen: (value) => set({ isOpen: value }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "sidebar-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
