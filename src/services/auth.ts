import api from '@/lib/axios'

// 로그인한 사용자의 정보를 가져오는 API
export const getMyInfo = async () => {
  const response = await api.get('/auth/me')
  return response.data
}
//------------------------------------------------------------------------------

// 로그인한 사용자의 프로필 정보를 가져오는 API
export const loginApi = async (email: string, password: string) => {
  const response = await api.post('/auth/login', {email, password})
  return response.data.token
}
//------------------------------------------------------------------------------

/// 회원가입 API
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
//------------------------------------------------------------------------------

// 로그아웃 API
export const changePasswordApi = async (data: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}) => {
  return await api.put('/auth/password', data)
}
//------------------------------------------------------------------------------

// 프로필 이미지 업로드 API (이미지 URL 반환)
export const uploadProfileImageApi = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await api.put('/auth/profile-image', formData)
  return response.data
}

//------------------------------------------------------------------------------

// 프로필 이미지 URL만 조회
export const getProfileImageUrl = async (): Promise<string> => {
  const response = await api.get('/auth/profile-image')
  console.log('getProfileImageUrl', response.data)
  return response.data // 문자열 URL 반환
}
//------------------------------------------------------------------------------
