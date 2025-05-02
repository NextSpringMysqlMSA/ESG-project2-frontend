import api from '@/lib/axios'

export const committeeApi = async (data: {
  committeeName: string
  memberName: string
  memberPosition: string
  memberAffiliation: string
  climateResponsibility: string
}) => {
  return await api.post('/api/v1/tcfd/governance/committee', data)
}

export const KPIApi = async (data: {
  executiveName: string
  kpiName: string
  targetValue: string
  achievedValue: string
}) => {
  return await api.post('/api/v1/tcfd/governance/executive-kpi', data)
}

export const meetingApi = async (data: {
  meetingName: string
  meetingDate: Date
  agenda: string
}) => {
  return await api.post('/api/v1/tcfd/governance/meeting', data)
}

export const educationApi = async (data: {
  educationTitle: string
  educationDate: Date
  participantCount: number
  content: string
}) => {
  return await api.post('/api/v1/tcfd/governance/education', data)
}
