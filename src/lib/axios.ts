import axios from 'axios'
import {useAuthStore} from '@/stores/authStore'
// import router from 'next/router' // App Router가 아니라 Pages Router면 이거, App Router면 next/navigation 사용
// import toast from 'react-hot-toast'

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SPRING_API_URL,
  withCredentials: true // 쿠키 사용할 경우 필요
})

// 요청을 보낼 때 Authorization 헤더와 Content-Type을 자동으로 설정
// 요청 인터셉터
api.interceptors.request.use(
  config => {
    const getAuthHeader = useAuthStore.getState().getAuthorizationHeader
    const token = getAuthHeader?.()

    if (token) {
      config.headers.Authorization = token
    }

    return config
  },
  error => Promise.reject(error)
)

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
