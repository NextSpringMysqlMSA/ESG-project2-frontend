import api from '@/lib/axios'
import {
  EddAnswerRequest,
  EddViolationDto,
  EuddAnswerRequest,
  EuddViolationDto,
  HrddAnswerRequest,
  HrddViolationDto
} from '@/types/IFRS/csddd'

/********************************************************
 * EUDD (EU 공급망 실사 지침)
 ********************************************************/

export const fetchEuddResult = async (): Promise<EuddViolationDto[]> => {
  const response = await api.get('/api/v1/csdd/eudd/result')
  return response.data
}

export const updateEuddAnswers = async (
  payload: EuddAnswerRequest
): Promise<EuddViolationDto[]> => {
  const response = await api.put('/api/v1/csdd/eudd/update', payload)
  return response.data
}
/********************************************************
 * EDD (환경 실사 지침)
 ********************************************************/

export const fetchEddResult = async (): Promise<EddViolationDto[]> => {
  const response = await api.get('/api/v1/csdd/edd/result')
  return response.data
}

// 환경경 실사 지침 자가진단 답변 업데이트

export const updateEddAnswers = async (
  payload: EddAnswerRequest
): Promise<EddViolationDto[]> => {
  const response = await api.put('/api/v1/csdd/edd/update', payload)
  return response.data
}

/********************************************************
 * HRDD
 ********************************************************/

// 결과 조회
export const fetchHrddResult = async (): Promise<HrddViolationDto[]> => {
  const response = await api.get('/api/v1/csdd/hrdd/result')
  return response.data
}

// 설문 수정
export const updateHrddAnswers = async (
  payload: HrddAnswerRequest
): Promise<HrddViolationDto[]> => {
  const response = await api.put('/api/v1/csdd/hrdd/update', payload)
  return response.data
}
