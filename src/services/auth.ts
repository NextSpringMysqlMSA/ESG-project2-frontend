import api from '@/lib/axios'

export const getMyInfo = async () => {
  const response = await api.get('/auth/me')
  return response.data
}

export const loginApi = async (email: string, password: string) => {
  const response = await api.post('/auth/login', {email, password})
  console.log('응답 데이터:', response.data)
  return response.data.token
}

export const registerApi = async (data: {
  name: string
  email: string
  phoneNumber: string
  companyName?: string
  position?: string
  password: string
}) => {
  return await api.post('/auth/register', data)
}
