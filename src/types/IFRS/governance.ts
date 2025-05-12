// ===== 위원회(Committee) 관련 타입 =====
// 위원회 상태 인터페이스
export interface committeeState {
  id: number // 고유 식별자
  committeeName: string // 위원회 이름
  memberName: string // 위원회 구성원 이름
  memberPosition: string // 위원회 구성원 직책
  memberAffiliation: string // 위원회 구성원 소속
  climateResponsibility: string // 기후 관련 책임
}

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

// 위원회 수정 요청용 타입
export type UpdateCommitteeDto = CommitteeItem

// ===== 환경 교육(Education) 관련 타입 =====
// 환경 교육 상태 인터페이스
export interface educationState {
  id: number // 고유 식별자
  educationTitle: string // 교육 제목
  educationDate: Date | null // 교육 일자
  participantCount: number // 참가자 수
  content: string // 교육 내용
}

// 환경 교육 데이터 항목 타입
export type EducationItem = {
  id: number
  educationTitle: string
  educationDate: string
  participantCount: number
  content: string
}

// 환경 교육 생성 요청용 타입
export type CreateEducationDto = Omit<EducationItem, 'id'>

// 환경 교육 수정 요청용 타입
export type UpdateEducationDto = EducationItem

// ===== KPI 관련 타입 =====
// KPI 상태 인터페이스
export interface kpiState {
  id: number // 고유 식별자
  executiveName: string // 임원 이름
  kpiName: string // KPI 이름
  targetValue: string // 목표 값
  achievedValue: string // 달성 값
}

// KPI 데이터 항목 타입
export type KPIItem = {
  id: number
  executiveName: string
  kpiName: string
  targetValue: string
  achievedValue: string
}

// KPI 생성 요청용 타입
export type CreateKpiDto = Omit<KPIItem, 'id'>

// KPI 수정 요청용 타입
export type UpdateKpiDto = KPIItem

// ===== 회의(Meeting) 관련 타입 =====
// 회의 상태 인터페이스
export interface meetingState {
  id: number // 고유 식별자
  meetingName: string // 회의 이름
  meetingDate: Date | null // 회의 일자
  agenda: string // 회의 안건
}

// 회의 데이터 항목 타입
export type MeetingItem = {
  id: number
  meetingName: string
  meetingDate: string
  agenda: string
}

// 회의 생성 요청용 타입
export type CreateMeetingDto = Omit<MeetingItem, 'id'>

// 회의 수정 요청용 타입
export type UpdateMeetingDto = MeetingItem
