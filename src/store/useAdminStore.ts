import { create } from 'zustand';

interface AdminState {
  pendingListingCount: number | null;
  setPendingListingCount: (count: number) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  pendingListingCount: null,
  setPendingListingCount: (count) => set({ pendingListingCount: count }),
}));
