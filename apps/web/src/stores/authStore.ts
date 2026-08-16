import { create } from 'zustand';

interface User {
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
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'demo-user-1',
    email: 'david.miller@sda-matrimony.test',
    role: 'VERIFIED_MEMBER',
    firstName: 'David',
    lastName: 'Miller',
    isEmailVerified: true,
  },
  token: 'demo-jwt-token-david-miller',
  isAuthenticated: true,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sda_access_token', token);
      localStorage.setItem('sda_user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sda_access_token');
      localStorage.removeItem('sda_user');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
