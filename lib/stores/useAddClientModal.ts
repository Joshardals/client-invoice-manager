import { create } from "zustand";

interface AddClientModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useAddClientModal = create<AddClientModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
