import {create} from 'zustand';

export interface BabyProfile {
  id: string;
  name: string;
  birthDate: string;
  gender: 'boy' | 'girl' | 'unisex';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  babies: BabyProfile[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  addBaby: (baby: BabyProfile) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  addBaby: (baby) => set((state) => ({
    user: state.user ? { ...state.user, babies: [...state.user.babies, baby] } : null
  })),
}));
