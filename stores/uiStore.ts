
import { create } from 'zustand';

interface UIState {
  isGlobalModalOpen: boolean;
  theme: 'light' | 'dark';
  openGlobalModal: () => void;
  closeGlobalModal: () => void;
  toggleTheme: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isGlobalModalOpen: false,
  theme: 'dark', // Default theme
  openGlobalModal: () => set({ isGlobalModalOpen: true }),
  closeGlobalModal: () => set({ isGlobalModalOpen: false }),
  toggleTheme: () => set((state) => ({
    theme: state.theme === 'light' ? 'dark' : 'light',
  })),
}));
