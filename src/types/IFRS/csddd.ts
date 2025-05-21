export interface EuddViolationDto {
  id: string
  questionText: string
  legalRelevance: string
  legalBasis: string
  fineRange: string
  criminalLiability: string
}

export interface EuddAnswerRequest {
  answers: Record<string, boolean>
}

export interface HrddViolationDto {
  id: string
  questionText: string
  legalRelevance: string
  legalBasis: string
  fineRange: string
  criminalLiability: string
}
export interface HrddAnswerRequest {
  answers: Record<string, boolean>
}

export interface EddViolationDto {
  id: string
  questionText: string
  legalRelevance: string
  legalBasis: string
  fineRange: string
  criminalLiability: string
}
export interface EddAnswerRequest {
  answers: Record<string, boolean>
}
