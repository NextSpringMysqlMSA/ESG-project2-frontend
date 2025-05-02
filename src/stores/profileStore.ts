import {create} from 'zustand'
import {getMyInfo, getProfileImageUrl} from '@/services/auth'

/**
 * 사용자 프로필 정보를 정의하는 인터페이스
 */
interface Profile {
  name: string
  email: string
  phoneNumber: string
  companyName: string
  position: string
  profileImageUrl?: string // 프로필 이미지 URL (선택적)
}
//------------------------------------------------------------------------------

/**
 * Zustand 상태 저장소의 구조 정의
 */
interface ProfileStore {
  profile: Profile | null // 현재 로그인한 사용자의 프로필 정보
  fetchProfile: () => Promise<void> // 전체 사용자 정보를 백엔드에서 가져오는 함수
  refreshProfileImage: () => Promise<void> // 프로필 이미지 URL만 따로 갱신하는 함수
  clearProfile: () => void // 로그아웃 시 프로필 정보를 초기화하는 함수
}

/**
 * Zustand 상태 저장소 구현
 */
export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: null, // 초기 상태는 null (로그인하지 않은 상태)

  /**
   * 전체 사용자 정보를 API로부터 받아와 상태에 저장
   * 예: name, email, phoneNumber, position 등
   */
  fetchProfile: async () => {
    try {
      const data = await getMyInfo() // /auth/me 호출
      set({profile: data})
    } catch (error) {
      console.error('전체 프로필 가져오기 실패:', error)
      set({profile: null}) // 실패 시 null로 초기화
    }
  },

  /**
   * 프로필 이미지 URL만 비동기적으로 갱신
   * (예: 이미지만 수정된 경우 전체 fetchProfile을 안 쓰고 이 함수 사용)
   */
  refreshProfileImage: async () => {
    try {
      const imageUrl = await getProfileImageUrl() // /auth/profile-image 호출
      const {profile} = get() // 기존 프로필 가져오기
      if (profile) {
        // 기존 프로필에 이미지 URL만 새로 갱신하여 상태 업데이트
        set({profile: {...profile, profileImageUrl: imageUrl}})
      }
    } catch (error) {
      console.error('프로필 이미지 갱신 실패:', error)
    }
  },

  /**
   * 로그아웃 시 사용자 정보를 초기화
   */
  clearProfile: () => set({profile: null})
}))
//------------------------------------------------------------------------------
