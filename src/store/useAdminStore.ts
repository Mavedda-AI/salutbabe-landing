import {create} from 'zustand';

export type LayoutMode = 'single' | 'double' | 'grid';

interface AdminState {
  pendingListingCount: number | null;
  setPendingListingCount: (count: number) => void;
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  pendingListingCount: null,
  setPendingListingCount: (count) => set({ pendingListingCount: count }),
  layoutMode: 'single',
  setLayoutMode: (mode) => set({ layoutMode: mode }),
}));
