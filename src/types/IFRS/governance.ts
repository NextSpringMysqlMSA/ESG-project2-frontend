export interface committeeState {
  committeeName: string
  memberName: string
  memberPosition: string
  memberAffiliation: string
  climateResponsibility: string
}

export interface educationState {
  educationTitle: string
  educationDate: Date
  participantCount: number
  content: string
}

export interface kpiState {
  executiveName: string
  kpiName: string
  targetValue: string
  achievedValue: string
}

export interface meetingState {
  meetingName: string
  meetingDate: Date
  agenda: string
}
