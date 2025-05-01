import {create} from 'zustand'
import {getMyInfo} from '@/services/auth'

// 백엔드에서 반환하는 사용자 정보 구조 정의
interface Profile {
  name: string
  email: string
  phoneNumber: string
  companyName: string
  position: string
  profileImageUrl?: string // ✅ 프로필 이미지 URL 추가
}

// Zustand로 관리할 상태 인터페이스
interface ProfileStore {
  profile: Profile | null // 사용자 정보 상태
  fetchProfile: () => Promise<void> // 사용자 정보 가져오기
  clearProfile: () => void // 로그아웃 시 상태 초기화
}

// Zustand 상태 저장소 생성
export const useProfileStore = create<ProfileStore>(set => ({
  profile: null,

  fetchProfile: async () => {
    try {
      const data = await getMyInfo()
      set({profile: data})
    } catch (e) {
      console.error('사용자 정보 불러오기 실패:', e)
      set({profile: null})
    }
  },

  clearProfile: () => set({profile: null})
}))
