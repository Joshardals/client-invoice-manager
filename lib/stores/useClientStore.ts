import { Client } from "@/typings";
import { create } from "zustand";

interface ClientStore {
  clients: Client[];
  addClient: (client: Client) => void;
  setClients: (clients: Client[]) => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  clients: [],
  addClient: (client) =>
    set((state) => ({ clients: [...state.clients, client] })),
  setClients: (clients) => set({ clients }),
}));
