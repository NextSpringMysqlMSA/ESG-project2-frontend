import api from '@/lib/axios'

// 서버 DTO와 정확히 일치시키기
export interface EuddViolationDto {
  id: string
  questionText: string
  legalRelevance: string
  legalBasis: string
  fineRange: string
  criminalLiability: string
}

export interface EuddAnswerRequest {
  answers: Record<string, boolean>
}

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
