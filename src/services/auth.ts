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

export const changePasswordApi = async (data: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) => {
  return await api.put('/auth/password', data)
}

export const uploadProfileImageApi = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.put('/auth/profile-image', formData, {
    headers: {'Content-Type': 'multipart/form-data'}
  })
  return response.data // image URL
}
