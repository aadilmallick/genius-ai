import { create } from "zustand";

interface useProModalStore {
  isOpen: boolean;
  closeModal: () => void;
  openModal: () => void;
}

export const useProModalStore = create<useProModalStore>((set) => ({
  isOpen: false,
  closeModal: () => set({ isOpen: false }),
  openModal: () => set({ isOpen: true }),
}));
