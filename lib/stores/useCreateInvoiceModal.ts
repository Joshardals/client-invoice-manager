import { create } from "zustand";

interface CreateInvoiceModalState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCreateInvoiceModal = create<CreateInvoiceModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
