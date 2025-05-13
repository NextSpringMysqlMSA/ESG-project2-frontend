import api from '@/lib/axios'
import {EddAnswerRequest, EddViolationDto} from '@/types/IFRS/csddd'

// 결과 조회
export const fetcheddResult = async (): Promise<EddViolationDto[]> => {
  const response = await api.get('/api/v1/csdd/edd/result')
  return response.data
}

// 설문 제출
export const submiteddAnswers = async (
  payload: EddAnswerRequest
): Promise<EddViolationDto[]> => {
  const response = await api.post('/api/v1/csdd/edd/submit', payload)
  return response.data
}

// 설문 수정
export const updateeddAnswers = async (
  payload: EddAnswerRequest
): Promise<EddViolationDto[]> => {
  const response = await api.put('/api/v1/csdd/edd/update', payload)
  return response.data
}
