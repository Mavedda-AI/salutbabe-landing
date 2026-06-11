import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface BabyProfile {
  id: string;
  name: string;
  birthDate: string;
  gender: 'boy' | 'girl' | 'unisex';
}

export interface User {
  id?: string;
  name?: string;
  userName?: string;
  userSurname?: string;
  email?: string;
  userEmail?: string;
  avatar?: string;
  profilePhotoUrl?: string;
  userType?: string | string[];
  babies?: BabyProfile[];
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token?: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
  addBaby: (baby: BabyProfile) => void;
  hydrateStore: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (userData, token) => {
        set({ user: userData, isAuthenticated: true, ...(token ? { token } : {}) });
        if (token) {
          localStorage.setItem('auth_token', token);
          localStorage.setItem('token', token);
        }
        localStorage.setItem('user', JSON.stringify(userData));
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('salutbabe-auth-storage');
      },
      setToken: (token) => {
        set({ token, isAuthenticated: true });
        localStorage.setItem('auth_token', token);
        localStorage.setItem('token', token);
      },
      addBaby: (baby) => set((state) => ({
        user: state.user ? { ...state.user, babies: [...(state.user.babies || []), baby] } : null
      })),
      hydrateStore: () => {
        // Read from legacy/direct localStorage keys to ensure sync if login was done outside store
        const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('user');
        
        if (token) {
          let user = null;
          if (userStr) {
            try {
              user = JSON.parse(userStr);
            } catch (e) {}
          }
          set({ user, token, isAuthenticated: true });
        }
      }
    }),
    {
      name: 'salutbabe-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
