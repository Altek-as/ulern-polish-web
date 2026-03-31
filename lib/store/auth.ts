import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/lib/supabase'

export type User = {
  id: string
  email: string
  name: string
  createdAt?: string
}

export type AuthState = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (data: { name?: string; email?: string }) => Promise<{ success: boolean; error?: string }>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        set({ isLoading: false })

        if (error) return { success: false, error: error.message }
        if (!data.user) return { success: false, error: 'Login failed' }

        set({
          user: {
            id: data.user.id,
            email: data.user.email ?? email,
            name: data.user.user_metadata?.name || email.split('@')[0],
            createdAt: data.user.created_at,
          },
          isAuthenticated: true
        })
        return { success: true }
      },

      register: async (email, password, name) => {
        set({ isLoading: true })
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } }
        })
        set({ isLoading: false })

        if (error) return { success: false, error: error.message }
        if (!data.user) return { success: false, error: 'Registration failed' }

        set({
          user: {
            id: data.user.id,
            email: data.user.email ?? email,
            name,
            createdAt: data.user.created_at,
          },
          isAuthenticated: true
        })
        return { success: true }
      },

      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, isAuthenticated: false })
      },

      updateProfile: async (data) => {
        set({ isLoading: true })
        const updates: Record<string, string> = {}
        if (data.name) updates.name = data.name

        const { data: updatedUser, error } = await supabase.auth.updateUser({ data: updates })
        set({ isLoading: false })

        if (error) return { success: false, error: error.message }
        if (!updatedUser?.user) return { success: false, error: 'Profile update failed' }

        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                name: updatedUser.user.user_metadata?.name || state.user.name,
                email: updatedUser.user.email || state.user.email,
              }
            : null,
        }))
        return { success: true }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
