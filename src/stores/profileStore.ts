import {create} from 'zustand'
import {getMyInfo} from '@/services/auth'

interface Profile {
  name: string
  email: string
  phoneNumber: string
  companyName: string
  position: string
}

interface ProfileStore {
  profile: Profile | null
  fetchProfile: () => Promise<void>
  clearProfile: () => void
}

export const useProfileStore = create<ProfileStore>(set => ({
  profile: null,
  fetchProfile: async () => {
    try {
      const data = await getMyInfo()
      set({profile: data})
    } catch (e) {
      console.error('사용자 정보 불러오기 실패:', e)
    }
  },
  clearProfile: () => set({profile: null})
}))
