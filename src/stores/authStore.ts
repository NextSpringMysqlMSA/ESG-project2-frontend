// src/stores/authStore.ts
import {create} from 'zustand'
import {persist} from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  setAuth: (token: string) => void
  logout: () => void
}

export const useAuthStore = create(
  persist<AuthState>(
    set => ({
      accessToken: null,
      setAuth: token => set({accessToken: token}),
      logout: () => set({accessToken: null})
    }),
    {
      name: 'auth-storage' // localStorage 키 이름
    }
  )
)
