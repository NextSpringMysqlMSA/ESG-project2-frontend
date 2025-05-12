import api from '@/lib/axios'
import {EuddAnswerRequest, EuddViolationDto} from '@/types/IFRS/csddd'

// 결과 조회
export const fetchEuddResult = async (): Promise<EuddViolationDto[]> => {
  const response = await api.get('/api/v1/csdd/eudd/result')
  return response.data
}

// 설문 제출
export const submitEuddAnswers = async (
  payload: EuddAnswerRequest
): Promise<EuddViolationDto[]> => {
  const response = await api.post('/api/v1/csdd/eudd/submit', payload)
  return response.data
}

// 설문 수정
export const updateEuddAnswers = async (
  payload: EuddAnswerRequest
): Promise<EuddViolationDto[]> => {
  const response = await api.put('/api/v1/csdd/eudd/update', payload)
  return response.data
}
