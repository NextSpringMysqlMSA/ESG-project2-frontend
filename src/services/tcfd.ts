import api from '@/lib/axios'

// 위원회 생성 API 호출
export const committeeApi = async (data: {
  committeeName: string
  memberName: string
  memberPosition: string
  memberAffiliation: string
  climateResponsibility: string
}) => {
  try {
    console.log('📤 위원회 등록 요청 데이터:', data) // 전송 데이터 로그
    const response = await api.post('/api/v1/tcfd/governance/committee', data)
    console.log('✅ 위원회 등록 성공 응답:', response.data) // 응답 데이터 로그
    return response.data
  } catch (error) {
    console.error('❌ 위원회 등록 실패:', error)
    throw error
  }
}
