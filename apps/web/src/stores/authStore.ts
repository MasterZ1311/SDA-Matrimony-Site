import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  isEmailVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sda_access_token', token);
        localStorage.setItem('sda_user', JSON.stringify(user));
      } catch (err) {
        console.error('Failed to write auth to localStorage', err);
      }
    }
    set({ user, token, isAuthenticated: true, isHydrated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('sda_access_token');
        localStorage.removeItem('sda_user');
      } catch (err) {
        console.error('Failed to remove auth from localStorage', err);
      }
    }
    set({ user: null, token: null, isAuthenticated: false, isHydrated: true });
  },

  initAuth: () => {
    if (typeof window !== 'undefined') {
      try {
        const storedToken = localStorage.getItem('sda_access_token');
        const storedUser = localStorage.getItem('sda_user');
        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          set({ user: parsedUser, token: storedToken, isAuthenticated: true, isHydrated: true });
          return;
        }
      } catch (err) {
        console.error('Failed to load auth from localStorage', err);
      }
    }
    set({ isHydrated: true });
  },
}));
