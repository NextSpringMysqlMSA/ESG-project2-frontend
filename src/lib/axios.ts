import axios from 'axios'
import {useAuthStore} from '@/stores/authStore'

// API URL 동적 결정 함수
const getApiBaseUrl = () => {
  // 환경변수 확인
  const configuredUrl = process.env.NEXT_PUBLIC_SPRING_API_URL

  // 환경변수가 없거나 ${GATEWAY_URL}와 같은 미치환 변수가 있는 경우
  if (!configuredUrl || configuredUrl.includes('${') || configuredUrl === 'undefined') {
    // 브라우저 환경인 경우 현재 호스트 기반으로 URL 생성
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const protocol = window.location.protocol
      // API 경로는 제거하고 기본 URL만 설정 (게이트웨이 서비스가 경로 처리)
      return `${protocol}//${hostname}`
    }
    // 서버사이드 렌더링 환경 - Kubernetes 내부 서비스 이름 사용
    return 'http://gateway-service'
  }

  return configuredUrl
}

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true // 쿠키 사용할 경우 필요
})

// 요청 인터셉터
api.interceptors.request.use(
  config => {
    // 매 요청마다 baseURL 재확인 (SPA에서 필요할 경우)
    if (typeof window !== 'undefined') {
      config.baseURL = getApiBaseUrl()
    }

    const getAuthHeader = useAuthStore.getState().getAuthorizationHeader
    const token = getAuthHeader?.()

    if (token) {
      config.headers.Authorization = token
    }

    console.log('📦 요청 헤더:', config.headers)
    console.log('🔗 API URL:', config.baseURL)

    return config
  },
  error => Promise.reject(error)
)

// 응답 인터셉터는 그대로 유지
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401 || error.response?.status === 403) {
//       if (typeof window !== 'undefined') {
//         useAuthStore.getState().logout()
//         window.location.href = '/login?error=unauthorized'
//       }
//     }
//     return Promise.reject(error)
//   }
// )

export default api
