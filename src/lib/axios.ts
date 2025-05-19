import axios from 'axios'
import {useAuthStore} from '@/stores/authStore'

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SPRING_API_URL,
  withCredentials: true // 쿠키 사용할 경우 필요
})

// 요청 인터셉터
api.interceptors.request.use(
  config => {
    const getAuthHeader = useAuthStore.getState().getAuthorizationHeader
    const token = getAuthHeader?.()

    if (token) {
      config.headers.Authorization = token
    }

    console.log('📦 요청 헤더:', config.headers)

    return config
  },
  error => Promise.reject(error)
)

// 응답 인터셉터는 그대로 유지
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== 'undefined') {
        useAuthStore.getState().logout()
        window.location.href = '/login?error=unauthorized'
      }
    }
    return Promise.reject(error)
  }
)

export default api
