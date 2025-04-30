// src/lib/axios.ts
import axios from 'axios'
import {useAuthStore} from '@/stores/authStore'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SPRING_API_URL
})

api.interceptors.request.use(config => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`
  }

  return config
})

export default api
