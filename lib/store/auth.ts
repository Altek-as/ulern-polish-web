import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
};

const API_BASE = typeof window !== 'undefined' ? `http://localhost:5000` : '';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const res = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          const data = await res.json();
          if (data.success) {
            set({ user: data.user, isAuthenticated: true });
            return { success: true };
          } else {
            return { success: false, error: data.error || 'Login failed' };
          }
        } catch (err) {
          return { success: false, error: 'Network error — is the server running?' };
        }
      },

      register: async (email, password, name) => {
        try {
          const res = await fetch(`${API_BASE}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name }),
          });
          const data = await res.json();
          if (data.success) {
            set({ user: data.user, isAuthenticated: true });
            return { success: true };
          } else {
            return { success: false, error: data.error || 'Registration failed' };
          }
        } catch (err) {
          return { success: false, error: 'Network error — is the server running?' };
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      updateProfile: (updates) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null
        }));
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
