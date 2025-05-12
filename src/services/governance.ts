import api from '@/lib/axios'
import {
  CommitteeItem,
  CreateCommitteeDto,
  CreateEducationDto,
  CreateKpiDto,
  CreateMeetingDto,
  EducationItem,
  KPIItem,
  MeetingItem,
  UpdateCommitteeDto,
  UpdateEducationDto,
  UpdateKpiDto,
  UpdateMeetingDto
} from '@/types/IFRS/governance'

// 위원회 데이터 항목 타입 (조회 및 수정 시 사용)

// 위원회 상세 조회 (ID로 데이터 가져오기)
export const fetchCommitteeById = async (id: number): Promise<CommitteeItem> => {
  const response = await api.get(`/api/v1/tcfd/governance/committee/${id}`)
  return response.data
}
// 위원회 목록 조회 (ID 없이 모든 데이터 가져오기)
export const fetchCommitteeList = async (): Promise<CommitteeItem[]> => {
  const response = await api.get('/api/v1/tcfd/governance/committee')
  return response.data
}

// 위원회 생성
export const createCommittee = async (committeeData: CreateCommitteeDto) => {
  return await api.post('/api/v1/tcfd/governance/committee', committeeData)
}
// 위원회 수정
export const updateCommittee = async (id: number, committeeData: UpdateCommitteeDto) => {
  return await api.put(`/api/v1/tcfd/governance/committee/${id}`, committeeData)
}
// 위원회 삭제
export const deleteCommittee = async (id: number) => {
  return await api.delete(`/api/v1/tcfd/governance/committee/${id}`)
}
//-------------------------------------------------------------------------------------------

// 회의 상세 조회 함수 추가
export const fetchMeetingById = async (id: number): Promise<MeetingItem> => {
  const response = await api.get(`/api/v1/tcfd/governance/meeting/${id}`)
  return response.data
}

export const fetchMeetingList = async (): Promise<MeetingItem[]> => {
  const response = await api.get('/api/v1/tcfd/governance/meeting')
  return response.data
}

export const createMeeting = async (meetingData: CreateMeetingDto) => {
  return await api.post('/api/v1/tcfd/governance/meeting', meetingData)
}

export const updateMeeting = async (id: number, meetingData: UpdateMeetingDto) => {
  return await api.put(`/api/v1/tcfd/governance/meeting/${id}`, meetingData)
}

export const deleteMeeting = async (id: number) => {
  return await api.delete(`/api/v1/tcfd/governance/meeting/${id}`)
}
//-------------------------------------------------------------------------------------------

// KPI 상세 조회 함수 수정 (경로 통일)
export const fetchKpiById = async (id: number): Promise<KPIItem> => {
  const response = await api.get(`/api/v1/tcfd/governance/executive-kpi/${id}`)
  return response.data
}

export const fetchKpiList = async (): Promise<KPIItem[]> => {
  const response = await api.get('/api/v1/tcfd/governance/executive-kpi')
  return response.data
}

export const createKpi = async (kpiData: CreateKpiDto) => {
  return await api.post('/api/v1/tcfd/governance/executive-kpi', kpiData)
}

export const updateKpi = async (id: number, kpiData: UpdateKpiDto) => {
  return await api.put(`/api/v1/tcfd/governance/executive-kpi/${id}`, kpiData)
}

export const deleteKpi = async (id: number) => {
  return await api.delete(`/api/v1/tcfd/governance/executive-kpi/${id}`)
}
//-------------------------------------------------------------------------------------------

// 교육 상세 조회 함수 추가
export const fetchEducationById = async (id: number): Promise<EducationItem> => {
  const response = await api.get(`/api/v1/tcfd/governance/education/${id}`)
  return response.data
}

export const fetchEducationList = async (): Promise<EducationItem[]> => {
  const response = await api.get('/api/v1/tcfd/governance/education')
  return response.data
}

export const createEducation = async (educationData: CreateEducationDto) => {
  return await api.post('/api/v1/tcfd/governance/education', educationData)
}

export const updateEducation = async (id: number, educationData: UpdateEducationDto) => {
  return await api.put(`/api/v1/tcfd/governance/education/${id}`, educationData)
}

export const deleteEducation = async (id: number) => {
  return await api.delete(`/api/v1/tcfd/governance/education/${id}`)
}
