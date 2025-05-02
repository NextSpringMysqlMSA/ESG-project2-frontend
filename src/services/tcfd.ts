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
