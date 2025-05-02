import axios from 'axios'
import {useAuthStore} from '@/stores/authStore'

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SPRING_API_URL // 예: http://localhost:8080
})

// 요청 인터셉터 설정
api.interceptors.request.use(
  config => {
    const getAuthHeader = useAuthStore.getState().getAuthorizationHeader
    const token = getAuthHeader?.()

    if (token) {
      config.headers.Authorization = token
    }

    // ✅ 전체 헤더 출력
    console.log('📦 요청 헤더:', config.headers) // <-- 여기에 Authorization 들어가는지 확인 가능

    return config
  },
  error => Promise.reject(error)
)

export default api
