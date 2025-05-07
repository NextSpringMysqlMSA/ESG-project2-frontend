// 위원회 타입
export interface committeeState {
  id: number // <- 고유 식별자 추가
  committeeName: string
  memberName: string
  memberPosition: string
  memberAffiliation: string
  climateResponsibility: string
}

// 환경 교육 타입
export interface educationState {
  id: number // <- 고유 식별자 추가
  educationTitle: string
  educationDate: Date | null
  participantCount: number
  content: string
}

// KPI 타입
export interface kpiState {
  id: number // <- 고유 식별자 추가
  executiveName: string
  kpiName: string
  targetValue: string
  achievedValue: string
}

// 회의 타입
export interface meetingState {
  id: number // <- 고유 식별자 추가
  meetingName: string
  meetingDate: Date | null
  agenda: string
}
