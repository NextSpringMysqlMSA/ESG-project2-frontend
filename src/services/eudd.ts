import api from '@/lib/axios'
import {getMyInfo} from './auth' // 추가

// 응답 타입 정의 (프로젝트에 맞게 수정 가능)
export interface EuddViolationDto {
  id: string
  title: string
  description: string
  lawReference?: string
}

export interface EuddAnswerRequest {
  memberId: number
  answers: Record<string, boolean>
}

// 🔍 결과 조회 (memberId는 getMyInfo로 내부 조회)
export const fetchEuddResult = async (): Promise<EuddViolationDto[]> => {
  try {
    const user = await getMyInfo()
    if (!user || !user.memberId) {
      throw new Error('User info is invalid or memberId is missing')
    }

    console.log('🧍 사용자 정보:', user)

    const res = await api.get('/api/v1/csdd/eudd/result', {
      headers: {
        'X-MEMBER-ID': String(user.memberId)
      },
      withCredentials: true
    })

    return res.data
  } catch (error) {
    console.error('❌ Error fetching EUDD result:', error)
    return [] // 빈 배열을 반환하거나 필요한 대체 처리를 추가
  }
}

// 📤 설문 제출
export const submitEuddAnswers = async (
  payload: EuddAnswerRequest
): Promise<EuddViolationDto[]> => {
  const res = await api.post('/api/v1/csdd/eudd/submit', payload)
  return res.data
}

// 🛠️ 설문 수정 (기존 응답 제거 후 다시 저장)
export const updateEuddAnswers = async (
  payload: EuddAnswerRequest
): Promise<EuddViolationDto[]> => {
  const res = await api.put('/api/v1/csdd/eudd/update', payload, {
    headers: {
      'X-MEMBER-ID': String(payload.memberId)
    }
  })
  return res.data
}
