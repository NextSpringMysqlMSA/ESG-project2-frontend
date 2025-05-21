'use client'

import { useState, useEffect } from 'react';
import { Home, ChevronRight, Users, Search, X, Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { searchCompaniesFromDart, DartCorpInfo, PartnerCompany, createPartnerCompany, fetchPartnerCompanies, deletePartnerCompany } from '@/services/partnerCompany';

// useDebounce 훅
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

// 파트너사 관리 페이지
// TODO: 실제 파트너사 데이터 연동 및 기능 구현 필요

export default function ManagePartnerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState<DartCorpInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<DartCorpInfo | null>(null);
  
  const [partnerList, setPartnerList] = useState<PartnerCompany[]>([]);
  const [pageLoading, setPageLoading] = useState(true); // 페이지 초기 파트너 목록 로딩

  // 초기 파트너사 목록 로드
  useEffect(() => {
    const loadInitialPartners = async () => {
      setPageLoading(true);
      try {
        const partners = await fetchPartnerCompanies(); // 서비스 함수 호출
        setPartnerList(partners);
      } catch (err) {
        console.error('초기 파트너 목록 로드 오류:', err);
        // 페이지 레벨의 에러 처리 (예: 토스트 메시지)
      }
      setPageLoading(false);
    };
    loadInitialPartners();
  }, []);

  // DART API 검색 로직
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim() !== '') {
      const fetchCompanies = async () => {
        setIsLoading(true); // 검색 로딩 시작
        setError(null); // 이전 에러 메시지 초기화
        setSearchResults([]);
        try {
          const response = await searchCompaniesFromDart({ corpNameFilter: debouncedSearchTerm, pageSize: 10 });
          setSearchResults(response.data);
          if (response.data.length === 0) {
            setError(`'${debouncedSearchTerm}'에 대한 검색 결과가 없습니다.`);
          }
        } catch (err) {
          console.error('DART API 검색 오류:', err);
          setError(err instanceof Error ? err.message : '기업 정보 검색 중 오류가 발생했습니다.');
        }
        setIsLoading(false); // 검색 로딩 종료
      };
      fetchCompanies();
    } else {
      setSearchResults([]);
      setSelectedCompany(null);
      setError(null); // 검색어 없을 시 에러도 초기화
    }
  }, [debouncedSearchTerm]);

  const handleSelectCompany = (company: DartCorpInfo) => {
    setSelectedCompany(company);
    setError(null); // 회사 선택 시 에러 메시지 초기화
  };
  
  const handleAddPartner = async () => {
    if (!selectedCompany) {
      setError('먼저 검색을 통해 회사를 선택해주세요.');
      return;
    }

    setIsSubmitting(true); // 제출 로딩 시작
    setError(null); // 이전 에러 메시지 초기화

    try {
      const newPartnerData: Omit<PartnerCompany, 'id' | 'createdAt' | 'updatedAt'> = {
        companyName: selectedCompany.corp_name,
        registrationNumber: selectedCompany.corp_code,
      };
      
      const createdPartner = await createPartnerCompany(newPartnerData);
      // console.log('새 파트너사 등록 성공:', createdPartner);
      // alert(`${createdPartner.companyName} 회사가 성공적으로 파트너사로 추가되었습니다.`);
      setPartnerList(prevList => [createdPartner, ...prevList]); // 목록 상단에 추가

      setIsModalOpen(false); // 성공 시 모달 닫기 (상태 초기화는 onOpenChange에서 처리)

    } catch (err) {
      console.error('파트너사 추가 오류:', err);
      setError(err instanceof Error ? err.message : '파트너사 추가 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false); // 제출 로딩 종료
    }
  };

  // 파트너사 삭제 함수
  const handleDeletePartner = async (partnerId: string) => {
    // TODO: 실제 삭제 전 확인 다이얼로그 추가 고려
    // console.log('Deleting partner:', partnerId);
    try {
      await deletePartnerCompany(partnerId); // 서비스 함수 호출 (현재는 목업)
      setPartnerList(prevList => prevList.filter(partner => partner.id !== partnerId));
      // TODO: 삭제 성공/실패에 대한 사용자 피드백 (예: 토스트 메시지)
    } catch (err) {
      console.error('파트너사 삭제 오류:', partnerId, err);
      // TODO: 삭제 실패 시 에러 처리 및 사용자 피드백
      alert('파트너사 삭제 중 오류가 발생했습니다.'); // 임시 알림
    }
  };

  const resetModalState = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedCompany(null);
    setError(null);
    setIsLoading(false);
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col w-full h-full p-4 md:p-8 bg-slate-50">
      {/* 상단 네비게이션 */}
      <div className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Home className="w-4 h-4 mr-1" />
        {/* TODO: 실제 상위 경로로 수정 필요 */}
        <BreadcrumbLink href="/home" className="hover:text-customG">
          ESG 공시 
        </BreadcrumbLink>
        <ChevronRight className="w-4 h-4 mx-2" />
        <BreadcrumbLink href="#" className="hover:text-customG"> {/* 협력사 관리 그룹 페이지가 있다면 해당 경로로 */}
          협력사 관리
        </BreadcrumbLink>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="font-medium text-customG">파트너사 관리</span>
      </div>

      <PageHeader
        icon={<Users className="w-6 h-6" />}
        title="파트너사 관리"
        description="협력 파트너사 정보 및 계약 관리"
        // module="Partner"
        // submodule="Manage"
      >
        {/* <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 pl-1.5">
          <Users className="w-3.5 h-3.5 mr-1" />
          협력사
        </Badge> */}
      </PageHeader>

      <Card className="mt-6 overflow-hidden shadow-sm">
        <CardHeader className="p-4 bg-white border-b">
          <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
            <div>
              <CardTitle className="text-xl">파트너사 목록</CardTitle>
              <CardDescription>
                등록된 파트너사를 확인하고 관리합니다. (총 {partnerList.length}개사)
              </CardDescription>
            </div>
            <div>
              <Dialog open={isModalOpen} onOpenChange={(open) => {
                setIsModalOpen(open);
                if (!open) {
                  resetModalState();
                }
              }}>
                <DialogTrigger asChild>
                  <Button variant="default">
                    <Users className="w-4 h-4 mr-2" />
                    파트너사 추가
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>새 파트너사 추가</DialogTitle>
                    <DialogDescription>
                      회사명을 검색하여 정보를 확인하고 파트너사로 추가합니다.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="relative">
                      <Search className="absolute w-4 h-4 text-gray-400 left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder="회사명 검색 (예: 삼성전자)"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        disabled={isLoading || isSubmitting}
                      />
                    </div>
                    
                    {isLoading && (
                      <div className="flex items-center justify-center h-[100px]">
                        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                        <p className="ml-2 text-sm text-gray-500">기업 정보 검색 중...</p>
                      </div>
                    )}

                    {!isLoading && error && searchResults.length === 0 && (
                      <p className="text-sm text-center text-red-500 py-2">{error}</p>
                    )}
                    
                    {!isLoading && searchResults.length > 0 && (
                      <div className="overflow-y-auto max-h-[200px] border rounded-md p-2">
                        <p className="mb-2 text-sm text-gray-600">검색 결과: {searchResults.length}건 (클릭하여 선택)</p>
                        <ul className="space-y-1">
                          {searchResults.map((company) => (
                            <li key={company.corp_code}>
                              <Button
                                variant={selectedCompany?.corp_code === company.corp_code ? "secondary" : "ghost"}
                                className="w-full justify-start text-left h-auto py-2 px-3"
                                onClick={() => handleSelectCompany(company)}
                                disabled={isSubmitting}
                              >
                                <div>
                                  <p className="font-semibold">{company.corp_name}</p>
                                  <p className="text-xs text-gray-500">
                                    기업코드: {company.corp_code}
                                    {company.stock_code && `, 주식코드: ${company.stock_code}`}
                                  </p>
                                </div>
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {selectedCompany && (
                      <div className="p-4 mt-3 border rounded-md bg-slate-50">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-md">선택된 회사: {selectedCompany.corp_name}</h4>
                            <Button variant="ghost" size="sm" onClick={() => {setSelectedCompany(null); setError(null);}} className="text-xs" disabled={isSubmitting}>
                                <X className="w-3 h-3 mr-1" /> 선택 취소
                            </Button>
                        </div>
                        <p className="mb-1 text-sm text-gray-600">기업 코드: {selectedCompany.corp_code}</p>
                      </div>
                    )}

                  </div>
                  <DialogFooter className="mt-2">
                    <DialogClose asChild>
                        <Button variant="outline" disabled={isSubmitting}>취소</Button>
                    </DialogClose>
                    <Button 
                        type="button" 
                        onClick={handleAddPartner} 
                        disabled={!selectedCompany || isSubmitting || isLoading}
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Users className="w-4 h-4 mr-2"/>}
                      {isSubmitting ? '추가 중...' : '파트너사로 추가'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 bg-white rounded-b-lg">
          {pageLoading ? (
            <div className="flex items-center justify-center h-20">
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                <p className="ml-2 text-gray-500">파트너사 목록을 불러오는 중...</p>
            </div>
          ) : partnerList.length === 0 ? (
            <p className="text-gray-600">
              등록된 파트너사가 없습니다. "파트너사 추가" 버튼을 클릭하여 새 파트너사를 등록하세요.
            </p>
          ) : (
            <ul className="space-y-3">
              {partnerList.map(partner => (
                <li key={partner.id} className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{partner.companyName}</h3>
                    {partner.registrationNumber && <p className="text-sm text-gray-600">사업자번호: {partner.registrationNumber}</p>}
                    <p className="text-xs text-gray-500">등록일: {new Date(partner.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-1 rounded-md shadow-lg bg-white border">
                      <Button
                        variant="ghost"
                        className="flex items-center justify-start w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDeletePartner(partner.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        삭제
                      </Button>
                    </PopoverContent>
                  </Popover>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
