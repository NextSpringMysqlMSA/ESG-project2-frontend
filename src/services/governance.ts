import api from '@/lib/axios'
import {CommitteeItem} from '@/stores/IFRS/governance/useCommitteeStore'

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

// 위원회 목록 조회 API 호출
export const fetchCommitteeList = async (): Promise<CommitteeItem[]> => {
  const response = await api.get('/api/v1/tcfd/governance/committee')
  return response.data
}

export const deleteCommitteeItem = async (committeeId: number) => {
  try {
    const response = await api.delete(`/api/v1/tcfd/governance/committee/${committeeId}`)
    return response.data
  } catch (error) {
    console.error('❌ 위원회 삭제 실패:', error)
    throw error
  }
}

// 회의 생성 API 호출
export const meetingApi = async (data: {
  meetingName: string
  meetingDate: string
  agenda: string
}) => {
  try {
    console.log('📤 회의 등록 요청 데이터:', data)
    const response = await api.post('/api/v1/tcfd/governance/meeting', data)
    console.log('✅ 회의 등록 성공 응답:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ 회의 등록 실패:', error)
    throw error
  }
}

// 회의 목록 조회 API 호출
export type MeetingItem = {
  meetingName: string
  meetingDate: string
  agenda: string
}

export const fetchMeetingList = async (): Promise<MeetingItem[]> => {
  const response = await api.get('/api/v1/tcfd/governance/meeting')
  return response.data
}

// KPI 생성 API 호출
export const KPIApi = async (data: {
  executiveName: string
  kpiName: string
  targetValue: string
  achievedValue: string
}) => {
  try {
    console.log('📤 kpi 등록 요청 데이터:', data) // 전송 데이터 로그
    const response = await api.post('/api/v1/tcfd/governance/executive-kpi', data)
    console.log('✅ kpi 등록 성공 응답:', response.data) // 응답 데이터 로그
    return response.data
  } catch (error) {
    console.error('❌ kpi 등록 실패:', error)
    throw error
  }
}

// 교육 생성 API 호출
export const educationApi = async (data: {
  educationTitle: string
  educationDate: string // ✅ 문자열로 변경
  participantCount: number
  content: string
}) => {
  try {
    console.log('📤 교육 등록 요청 데이터:', data)
    const response = await api.post('/api/v1/tcfd/governance/education', data)
    console.log('✅ 교육 등록 성공 응답:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ 교육 등록 실패:', error)
    throw error
  }
}

// KPI 목록 타입 및 조회 API 호출
export type KPIItem = {
  executiveName: string
  kpiName: string
  targetValue: string
  achievedValue: string
}

export const fetchKpiList = async (): Promise<KPIItem[]> => {
  const response = await api.get('/api/v1/tcfd/governance/executive-kpi')
  return response.data
}

// 교육 목록 타입 및 조회 API 호출
export type EducationItem = {
  educationTitle: string
  educationDate: string
  participantCount: number
  content: string
}

export const fetchEducationList = async (): Promise<EducationItem[]> => {
  const response = await api.get('/api/v1/tcfd/governance/education')
  return response.data
}
