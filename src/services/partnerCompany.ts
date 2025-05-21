/**
 * 파트너사(협력사) 정보 타입
 */
export interface PartnerCompany {
  id: string;                    // 파트너사 고유 ID
  companyName: string;           // 회사명
  registrationNumber?: string;    // 사업자 등록번호 (DART corp_code 등 활용 가능)
  industry?: string;              // 산업군 (선택)
  country?: string;               // 국가 (선택)
  address?: string;               // 주소 (선택)
  contractStartDate?: Date;     // 계약 시작일 (선택)
  contractEndDate?: Date;       // 계약 종료일 (선택)
  createdAt: Date;               // 생성일
  updatedAt: Date;               // 수정일
}

/**
 * DART API 기업 정보 타입
 */
export interface DartCorpInfo {
  corp_code: string;   // 기업 고유 코드
  corp_name: string;   // 기업명
  stock_code?: string;  // 주식 코드 (상장사만 존재)
  modify_date: string; // 최종 수정일
}

/**
 * DART API 페이지네이션 응답 타입
 */
export interface DartApiResponse {
  data: DartCorpInfo[];    // 기업 정보 목록
  total: number;           // 전체 항목 수
  page: number;            // 현재 페이지 번호
  pageSize: number;        // 페이지 당 항목 수
  totalPages: number;      // 전체 페이지 수
  hasNextPage: boolean;    // 다음 페이지 존재 여부
}

/**
 * 기업 검색 파라미터 타입
 */
export interface SearchCorpParams {
  page?: number;
  pageSize?: number;
  listedOnly?: boolean;
  corpNameFilter?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'; // 환경 변수 또는 기본값 사용
const DART_API_BASE_URL = process.env.NEXT_PUBLIC_DART_API_URL || '/dart-open-api'; // DART API 기본 URL

/**
 * 전체 파트너사 목록을 가져옵니다.
 * @returns Promise<PartnerCompany[]>
 */
export async function fetchPartnerCompanies(): Promise<PartnerCompany[]> {
  console.log('Fetching all partner companies...');
  return [
    {
      id: 'partner-001',
      companyName: '협력사 A',
      createdAt: new Date(),
      updatedAt: new Date(),
      industry: '제조업',
      country: '대한민국',
      registrationNumber: '123-45-67890'
    },
    {
      id: 'partner-002',
      companyName: '파트너 B 솔루션스',
      createdAt: new Date(),
      updatedAt: new Date(),
      industry: 'IT 서비스',
      country: '미국',
      registrationNumber: '987-65-43210'
    }
  ];
}

/**
 * 특정 ID의 파트너사 정보를 가져옵니다.
 * @param id 파트너사 ID
 * @returns Promise<PartnerCompany | null>
 */
export async function fetchPartnerCompanyById(id: string): Promise<PartnerCompany | null> {
  console.log(`Fetching partner company with ID: ${id}...`);
  const companies = await fetchPartnerCompanies();
  return companies.find(c => c.id === id) || null;
}

/**
 * 새 파트너사를 생성합니다.
 * @param partnerData 생성할 파트너사 정보 (id, createdAt, updatedAt 제외)
 * @returns Promise<PartnerCompany>
 */
export async function createPartnerCompany(partnerData: Omit<PartnerCompany, 'id' | 'createdAt' | 'updatedAt'>): Promise<PartnerCompany> {
  console.log('Creating new partner company:', partnerData);
  const newPartner: PartnerCompany = {
    id: `partner-${Date.now().toString()}`,
    ...partnerData,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  return newPartner;
}

/**
 * 기존 파트너사 정보를 수정합니다.
 * @param id 수정할 파트너사 ID
 * @param partnerData 수정할 정보
 * @returns Promise<PartnerCompany | null>
 */
export async function updatePartnerCompany(id: string, partnerData: Partial<Omit<PartnerCompany, 'id' | 'createdAt' | 'updatedAt'>>): Promise<PartnerCompany | null> {
  console.log(`Updating partner company with ID: ${id}:`, partnerData);
  let existingPartner = await fetchPartnerCompanyById(id);
  if (existingPartner) {
    existingPartner = { ...existingPartner, ...partnerData, updatedAt: new Date() };
    return existingPartner;
  }
  return null;
}

/**
 * 특정 ID의 파트너사를 삭제합니다.
 * @param id 삭제할 파트너사 ID
 * @returns Promise<void>
 */
export async function deletePartnerCompany(id: string): Promise<void> {
  console.log(`Deleting partner company with ID: ${id}...`);
}

/**
 * DART Open API를 통해 기업 정보를 검색합니다.
 * @param params 검색 파라미터 (page, pageSize, listedOnly, corpNameFilter)
 * @returns Promise<DartApiResponse>
 */
export async function searchCompaniesFromDart(params: SearchCorpParams): Promise<DartApiResponse> {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append('page', params.page.toString());
  if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
  if (params.listedOnly !== undefined) queryParams.append('listedOnly', params.listedOnly.toString());
  if (params.corpNameFilter) queryParams.append('corpNameFilter', params.corpNameFilter);

  const response = await fetch(`${DART_API_BASE_URL}/corp-code/paginated?${queryParams.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    console.error('DART API Error:', response.status, errorData);
    throw new Error(`DART API request failed with status ${response.status}: ${errorData.message || 'Failed to fetch data'}`);
  }
  return response.json();
} 