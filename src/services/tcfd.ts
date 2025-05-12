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

// 위원회 상세 조회 (ID로 데이터 가져오기)
export const fetchCommitteeById = async (id: number): Promise<CommitteeItem> => {
  try {
    console.log(`Fetching committee with ID: ${id}`) // 호출된 ID 출력
    const response = await api.get(`/api/v1/tcfd/governance/committee/${id}`)
    console.log('Response data:', response.data) // 응답 데이터 출력
    return response.data
  } catch (error) {
    console.error('Error fetching committee data:', error) // 에러 로그 추가
    throw error
  }
}
// 위원회 목록 조회 (ID 없이 모든 데이터 가져오기)
export const fetchCommitteeList = async (): Promise<CommitteeItem[]> => {
  const response = await api.get('/api/v1/tcfd/governance/committee')
  return response.data
}
// 위원회 목록 조회
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
