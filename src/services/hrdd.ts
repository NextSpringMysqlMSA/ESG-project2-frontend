import api from '@/lib/axios'
import {HrddAnswerRequest, HrddViolationDto} from '@/types/IFRS/csddd'

// 결과 조회
export const fetchHrddResult = async (): Promise<HrddViolationDto[]> => {
  const response = await api.get('/api/v1/csdd/hrdd/result')
  return response.data
}

// 설문 제출
export const submitHrddAnswers = async (
  payload: HrddAnswerRequest
): Promise<HrddViolationDto[]> => {
  const response = await api.post('/api/v1/csdd/hrdd/submit', payload)
  return response.data
}

// 설문 수정
export const updateHrddAnswers = async (
  payload: HrddAnswerRequest
): Promise<HrddViolationDto[]> => {
  const response = await api.put('/api/v1/csdd/hrdd/update', payload)
  return response.data
}
