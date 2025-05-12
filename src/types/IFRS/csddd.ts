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
