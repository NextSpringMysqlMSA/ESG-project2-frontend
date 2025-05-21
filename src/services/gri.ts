import api from '@/lib/axios'

// GRI 공시 인터페이스
export interface GriDisclosure {
  id: number
  griCode: string
  indicator: string
  category: string
  content: string
  createdAt?: string
  updatedAt?: string
}

// GRI 공시 요청 인터페이스
export interface GriDisclosureRequest {
  griCode: string
  indicator: string
  category: string
  content: string
}

// API 엔드포인트
const API_URL = '/api/v1/gri'

/**
 * GRI 항목 목록 조회
 * @returns GRI 항목 배열
 */
export const fetchGriDisclosures = async (): Promise<GriDisclosure[]> => {
  try {
    const response = await api.get<GriDisclosure[]>(API_URL)
    return response.data
  } catch (error) {
    console.error('Error fetching GRI disclosures:', error)
    return []
  }
}

/**
 * 특정 GRI 항목 조회
 * @param id GRI 항목 ID
 * @returns GRI 항목 상세 정보
 */
export const fetchGriDisclosure = async (id: number): Promise<GriDisclosure | null> => {
  try {
    const response = await api.get<GriDisclosure>(`${API_URL}/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching GRI disclosure:', error)
    return null
  }
}

/**
 * 특정 GRI 코드로 항목 조회
 * @param griCode GRI 코드
 * @returns GRI 항목 상세 정보
 */
export const fetchGriDisclosureByCode = async (
  griCode: string
): Promise<GriDisclosure | null> => {
  try {
    const response = await api.get<GriDisclosure[]>(`${API_URL}/code/${griCode}`)
    if (response.data && response.data.length > 0) {
      return response.data[0]
    }
    return null
  } catch (error) {
    console.error('Error fetching GRI disclosure by code:', error)
    return null
  }
}

/**
 * GRI 항목 생성
 * @param data 생성할 GRI 항목 데이터
 * @returns 생성된 GRI 항목
 */
// frontend/src/services/gri.ts 파일에 추가

export const createGriDisclosure = async (
  data: GriDisclosureRequest
): Promise<GriDisclosure> => {
  // 데이터 검증 추가
  if (!data.content || data.content.trim() === '') {
    throw new Error('내용을 입력해주세요.')
  }

  const response = await api.post<GriDisclosure>(API_URL, data)
  return response.data
}

export const updateGriDisclosure = async (
  id: number,
  data: Partial<GriDisclosureRequest>
): Promise<GriDisclosure> => {
  // 데이터 검증 추가
  if (data.content !== undefined && data.content.trim() === '') {
    throw new Error('내용을 입력해주세요.')
  }

  const response = await api.put<GriDisclosure>(`${API_URL}/${id}`, data)
  return response.data
}

/**
 * GRI 항목 삭제
 * @param id 삭제할 GRI 항목 ID
 * @returns 삭제 성공 여부
 */
export const deleteGriDisclosure = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`${API_URL}/${id}`)
    return true
  } catch (error) {
    console.error('Error deleting GRI disclosure:', error)
    return false
  }
}
