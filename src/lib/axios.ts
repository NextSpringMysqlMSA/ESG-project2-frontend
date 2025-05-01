import axios from 'axios'
import {useAuthStore} from '@/stores/authStore'

// Axios 인스턴스 생성
// - baseURL은 환경 변수에서 설정 (ex. http://localhost:8080)
// - 모든 API 요청은 이 인스턴스를 통해 이루어짐
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SPRING_API_URL
})

// 요청 인터셉터 설정
// - 매 요청 전에 실행되어 Authorization 헤더를 자동으로 추가
api.interceptors.request.use(config => {
  // Zustand 스토어에서 Authorization 헤더 문자열 가져오기
  // getAuthorizationHeader()는 'Bearer {토큰}' 형식 문자열 반환
  const token = useAuthStore.getState().getAuthorizationHeader?.()

  // 토큰이 존재하면 Authorization 헤더에 설정
  if (token) {
    config.headers.Authorization = token
  }

  // 최종 config 반환 → Axios가 요청 실행
  return config
})

// api 인스턴스 내보내기
export default api
