import {create} from 'zustand'
import {persist} from 'zustand/middleware'

// 인증 관련 상태를 정의하는 인터페이스
interface AuthState {
  accessToken: string | null // JWT 토큰
  setAuth: (token: string) => void // 로그인 후 토큰 저장
  logout: () => void // 로그아웃 시 토큰 제거
  getAuthorizationHeader: () => string | null // 요청 헤더에 사용할 Authorization 문자열 반환
}
//------------------------------------------------------------------------------

// Zustand 상태 저장소 생성 및 로컬 스토리지에 영속(persist)
export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      accessToken: null,

      // 로그인 시 accessToken 저장
      setAuth: token => set({accessToken: token}),

      // 로그아웃 시 accessToken 제거
      logout: () => set({accessToken: null}),

      // 요청 시 Authorization 헤더 포맷 생성 (Bearer 자동 처리)
      getAuthorizationHeader: () => {
        const token = get().accessToken
        return token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : null
      }
    }),
    {
      name: 'auth-storage' // 로컬스토리지 키 이름
    }
  )
)
//------------------------------------------------------------------------------
