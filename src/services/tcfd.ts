import api from '@/lib/axios'

// // 위원회 생성 API 호출
// export const committeeApi = async (data: {
//   committeeName: string
//   memberName: string
//   memberPosition: string
//   memberAffiliation: string
//   climateResponsibility: string
// }) => {
//   try {
//     console.log('📤 위원회 등록 요청 데이터:', data) // 전송 데이터 로그
//     const response = await api.post('/api/v1/tcfd/governance/committee', data)
//     console.log('✅ 위원회 등록 성공 응답:', response.data) // 응답 데이터 로그
//     return response.data
//   } catch (error) {
//     console.error('❌ 위원회 등록 실패:', error)
//     throw error
//   }
// }

// // 위원회 목록 조회 API 호출
// export const fetchCommitteeList = async (): Promise<CommitteeItem[]> => {
//   const response = await api.get('/api/v1/tcfd/governance/committee')
//   return response.data
// }

// export const deleteCommitteeItem = async (committeeName: string) => {
//   try {
//     const response = await api.delete(`/api/v1/tcfd/governance/committee`, {
//       params: {name: committeeName}
//     })
//     return response.data
//   } catch (error) {
//     console.error('❌ 위원회 삭제 실패:', error)
//     throw error
//   }
// }

// // 회의 생성 API 호출
// export const meetingApi = async (data: {
//   meetingName: string
//   meetingDate: string
//   agenda: string
// }) => {
//   try {
//     console.log('📤 회의 등록 요청 데이터:', data)
//     const response = await api.post('/api/v1/tcfd/governance/meeting', data)
//     console.log('✅ 회의 등록 성공 응답:', response.data)
//     return response.data
//   } catch (error) {
//     console.error('❌ 회의 등록 실패:', error)
//     throw error
//   }
// }

// // 회의 목록 조회 API 호출
// export type MeetingItem = {
//   meetingName: string
//   meetingDate: string
//   agenda: string
// }

// export const fetchMeetingList = async (): Promise<MeetingItem[]> => {
//   const response = await api.get('/api/v1/tcfd/governance/meeting')
//   return response.data
// }

// // KPI 생성 API 호출
// export const KPIApi = async (data: {
//   executiveName: string
//   kpiName: string
//   targetValue: string
//   achievedValue: string
// }) => {
//   try {
//     console.log('📤 kpi 등록 요청 데이터:', data) // 전송 데이터 로그
//     const response = await api.post('/api/v1/tcfd/governance/executive-kpi', data)
//     console.log('✅ kpi 등록 성공 응답:', response.data) // 응답 데이터 로그
//     return response.data
//   } catch (error) {
//     console.error('❌ kpi 등록 실패:', error)
//     throw error
//   }
// }

// // 교육 생성 API 호출
// export const educationApi = async (data: {
//   educationTitle: string
//   educationDate: string // ✅ 문자열로 변경
//   participantCount: number
//   content: string
// }) => {
//   try {
//     console.log('📤 교육 등록 요청 데이터:', data)
//     const response = await api.post('/api/v1/tcfd/governance/education', data)
//     console.log('✅ 교육 등록 성공 응답:', response.data)
//     return response.data
//   } catch (error) {
//     console.error('❌ 교육 등록 실패:', error)
//     throw error
//   }
// }

// // KPI 목록 타입 및 조회 API 호출
// export type KPIItem = {
//   executiveName: string
//   kpiName: string
//   targetValue: string
//   achievedValue: string
// }

// export const fetchKpiList = async (): Promise<KPIItem[]> => {
//   const response = await api.get('/api/v1/tcfd/governance/executive-kpi')
//   return response.data
// }

// // 교육 목록 타입 및 조회 API 호출
// export type EducationItem = {
//   educationTitle: string
//   educationDate: string
//   participantCount: number
//   content: string
// }

// export const fetchEducationList = async (): Promise<EducationItem[]> => {
//   const response = await api.get('/api/v1/tcfd/governance/education')
//   return response.data
// }

// 위원회 데이터 항목 타입 (조회 및 수정 시 사용)
export type CommitteeItem = {
  id: number
  committeeName: string
  memberName: string
  memberPosition: string
  memberAffiliation: string
  climateResponsibility: string
}

// 위원회 생성 요청용 타입 (id 제외)
export type CreateCommitteeDto = Omit<CommitteeItem, 'id'>

// 위원회 수정 요청용 타입 (id 포함)
export type UpdateCommitteeDto = CommitteeItem

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

export const fetchCommitteeList = async (): Promise<CommitteeItem[]> => {
  const response = await api.get('/api/v1/tcfd/governance/committee')
  return response.data
}

export const createCommittee = async (committeeData: CreateCommitteeDto) => {
  return await api.post('/api/v1/tcfd/governance/committee', committeeData)
}

export const updateCommittee = async (id: number, committeeData: UpdateCommitteeDto) => {
  return await api.put(`/api/v1/tcfd/governance/committee/${id}`, committeeData)
}

export const deleteCommittee = async (id: number) => {
  return await api.delete(`/api/v1/tcfd/governance/committee/${id}`)
}

// 회의 데이터 항목 타입
export type MeetingItem = {
  id: number
  meetingName: string
  meetingDate: string
  agenda: string
}

export type CreateMeetingDto = Omit<MeetingItem, 'id'>
export type UpdateMeetingDto = MeetingItem

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

export type KPIItem = {
  id: number
  executiveName: string
  kpiName: string
  targetValue: string
  achievedValue: string
}

export type CreateKpiDto = Omit<KPIItem, 'id'>
export type UpdateKpiDto = KPIItem

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

export type EducationItem = {
  id: number
  educationTitle: string
  educationDate: string
  participantCount: number
  content: string
}

export type CreateEducationDto = Omit<EducationItem, 'id'>
export type UpdateEducationDto = EducationItem

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
