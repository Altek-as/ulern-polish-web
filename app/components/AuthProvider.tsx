'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/auth'
import { supabase } from '@/lib/supabase'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Restore session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        useAuthStore.setState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split('@')[0]
          },
          isAuthenticated: true
        })
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        useAuthStore.setState({
          user: {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name || session.user.email!.split('@')[0]
          },
          isAuthenticated: true
        })
      } else {
        useAuthStore.setState({ user: null, isAuthenticated: false })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return <>{children}</>
}
