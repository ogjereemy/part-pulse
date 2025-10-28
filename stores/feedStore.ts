
import { create } from 'zustand';

interface FeedState {
  autoplayEnabled: boolean;
  dataSaverMode: boolean;
  toggleAutoplay: () => void;
  toggleDataSaverMode: () => void;
}

export const useFeedStore = create<FeedState>()((set) => ({
  autoplayEnabled: true,
  dataSaverMode: false,
  toggleAutoplay: () => set((state) => ({ autoplayEnabled: !state.autoplayEnabled })),
  toggleDataSaverMode: () => set((state) => ({ dataSaverMode: !state.dataSaverMode })),
}));
