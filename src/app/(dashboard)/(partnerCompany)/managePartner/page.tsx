'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageHeader } from '@/components/layout/PageHeader'
import { 
  Building2, 
  Plus, 
  Search, 
  X, 
  Loader2, 
  AlertTriangle, 
  Check, 
  MoreHorizontal, 
  Trash, 
  Edit3,
  Home,
  ChevronRight,
  Users
} from 'lucide-react'
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { useToast } from '@/hooks/use-toast'
import type { 
  PartnerCompany,
  DartCorpInfo,
  PartnerCompanyResponse
} from '@/services/partnerCompany'
import { 
  fetchPartnerCompanies, 
  createPartnerCompany, 
  deletePartnerCompany, 
  updatePartnerCompany,
  searchCompaniesFromDart
} from '@/services/partnerCompany'

// 디바운스 훅
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default function ManagePartnerPage() {
  const { toast } = useToast()
  
  // 상태 관리 (HEAD 기반, origin/develop 요소 일부 통합)
  const [partners, setPartners] = useState<PartnerCompany[]>([])
  const [isLoading, setIsLoading] = useState(false) // 전반적인 로딩 (목록, DART 검색 등)
  const [isPageLoading, setIsPageLoading] = useState(true) // 페이지 초기 파트너 목록 로딩 (origin/develop)
  const [isSubmitting, setIsSubmitting] = useState(false) // 추가/수정 시 로딩 (origin/develop)
  const [searchQuery, setSearchQuery] = useState('') // 파트너 목록 검색어 (HEAD)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize] = useState(10)
  
  // 다이얼로그 상태 (HEAD 기반)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false) // 수정 다이얼로그 (HEAD)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<PartnerCompany | null>(null)
  
  // 추가/수정 다이얼로그 내 상태 (HEAD 기반, origin/develop 요소 통합)
  const [companySearchQuery, setCompanySearchQuery] = useState('') // DART 검색어 (HEAD)
  const [dartSearchResults, setDartSearchResults] = useState<DartCorpInfo[]>([]) // DART 검색 결과 (HEAD, 이름 변경: searchResults -> dartSearchResults)
  const [selectedDartCompany, setSelectedDartCompany] = useState<DartCorpInfo | null>(null) // DART에서 선택된 회사 (origin/develop: selectedCompany)
  
  // 입력 폼 데이터 (HEAD: newPartnerData, origin/develop: newPartnerData 와 유사)
  const [formData, setFormData] = useState({
    id: '', // 수정 시 사용
    companyName: '',
    corpCode: '',
    contractStartDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'PENDING' // 수정 시 사용
  })

  const [dialogError, setDialogError] = useState<string | null>(null) // 다이얼로그 내 에러 (origin/develop: error)

  // 디바운스된 검색어
  const debouncedMainSearchQuery = useDebounce(searchQuery, 500) // 파트너 목록 검색 (HEAD)
  const debouncedDartSearchQuery = useDebounce(companySearchQuery, 500) // DART 검색 (HEAD)
  
  // 파트너사 목록 로드 (페이징 및 검색 지원) - HEAD 기준
  const loadPartners = useCallback(async (page: number, companyNameFilter?: string) => {
    setIsLoading(true)
    setIsPageLoading(false) // 실제 로딩 시작 시 페이지 로딩 상태 false
    try {
      const response = await fetchPartnerCompanies(page, pageSize, companyNameFilter)
      // API 응답의 contract_start_date (string)를 프론트엔드 PartnerCompany 타입의 contractStartDate (Date)로 변환
      const transformedData = response.data.map(p => ({
        ...p,
        companyName: p.corp_name, // API 응답 corp_name을 companyName으로 매핑
        // contract_start_date가 있고 유효한 문자열일 때만 Date 객체로 변환
        contractStartDate: p.contract_start_date && typeof p.contract_start_date === 'string' 
                           ? new Date(p.contract_start_date) 
                           : new Date() // 혹은 적절한 기본값 또는 null 처리
      }));
      setPartners(transformedData)
      setCurrentPage(response.page)
      setTotalPages(Math.ceil(response.total / response.pageSize))
      setTotalItems(response.total)
    } catch (error) {
      console.error('Failed to load partner companies:', error)
      toast({
        variant: 'destructive',
        title: '오류',
        description: '파트너사 목록을 불러오는데 실패했습니다.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [pageSize, toast])
  
  // 페이지 첫 로드 시 파트너사 목록 조회
  useEffect(() => {
    setIsPageLoading(true)
    loadPartners(1).finally(() => setIsPageLoading(false))
  }, [loadPartners])
  
  // 메인 검색어 변경 시 파트너사 목록 재조회
  useEffect(() => {
    // isPageLoading이 true일때는 초기 로딩이므로, 검색어 변경으로 인한 재조회를 막습니다.
    if (!isPageLoading) {
      loadPartners(1, debouncedMainSearchQuery || undefined)
    }
  }, [debouncedMainSearchQuery, loadPartners, isPageLoading])
  
  // DART 기업 검색 (HEAD + origin/develop 통합)
  const searchDartCompanies = useCallback(async () => {
    if (!debouncedDartSearchQuery) {
      setDartSearchResults([])
      setDialogError(null)
      return
    }
    
    setIsLoading(true) // DART 검색 중 로딩 상태
    setDialogError(null)
    setDartSearchResults([])
    try {
      const response = await searchCompaniesFromDart({
        page: 1, // origin/develop 에서는 페이지 없었으나, API 스펙에 따라 추가/조정 가능
        pageSize: 5, // origin/develop 에서는 10, HEAD 에서는 5. 일단 5로 통일
        listedOnly: true, // HEAD 기준
        corpNameFilter: debouncedDartSearchQuery
      })
      
      setDartSearchResults(response.data || []) // API 응답이 data 배열을 포함한다고 가정
      if ((response.data || []).length === 0) {
        setDialogError(`'${debouncedDartSearchQuery}'에 대한 검색 결과가 없습니다.`)
      }
    } catch (error) {
      console.error('Failed to search companies from DART:', error)
      const errorMessage = error instanceof Error ? error.message : 'DART 기업 검색 중 오류가 발생했습니다.'
      setDialogError(errorMessage)
      toast({
        variant: 'destructive',
        title: 'DART 검색 오류',
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }, [debouncedDartSearchQuery, toast])
  
  // DART 검색어 변경 시 또는 다이얼로그 열릴 때 DART 검색 (isAddDialogOpen || isEditDialogOpen)
  useEffect(() => {
    if (debouncedDartSearchQuery && (isAddDialogOpen || isEditDialogOpen)) {
      searchDartCompanies()
    }
  }, [debouncedDartSearchQuery, isAddDialogOpen, isEditDialogOpen, searchDartCompanies])
  
  // DART 검색 결과에서 회사 선택 시 (HEAD + origin/develop)
  const handleSelectDartCompany = useCallback((company: DartCorpInfo) => {
    setSelectedDartCompany(company) // 선택된 DART 회사 정보 저장
    setFormData(prev => ({
      ...prev,
      companyName: company.corp_name,
      corpCode: company.corp_code,
      // 계약 시작일은 DART 회사 선택 시점의 오늘 날짜로 설정
      contractStartDate: new Date().toISOString().split('T')[0]
    }))
    setDartSearchResults([]) // 검색 결과 목록은 비움
    setCompanySearchQuery('') // DART 검색창 비움
    setDialogError(null)
  }, [])
  
  // 모달 상태 초기화 (HEAD + origin/develop)
  const resetModalStateAndClose = useCallback(() => {
    setFormData({
      id: '',
      companyName: '',
      corpCode: '',
      contractStartDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    })
    setCompanySearchQuery('')
    setDartSearchResults([])
    setSelectedDartCompany(null)
    setDialogError(null)
    setIsSubmitting(false)
    setIsAddDialogOpen(false)
    setIsEditDialogOpen(false)
  }, [])

  // 파트너사 추가/수정 핸들러 (HEAD + origin/develop 통합)
  const handleSubmitPartner = useCallback(async () => {
    if (!formData.companyName || !formData.corpCode || !formData.contractStartDate) {
      setDialogError('회사명, DART코드, 계약 시작일은 필수입니다.')
      toast({variant: 'destructive', title: '입력 오류', description: '회사명, DART코드, 계약 시작일은 필수입니다.'})
      return
    }

    setIsSubmitting(true)
    setDialogError(null)
    try {
      if (isEditDialogOpen && selectedPartner?.id) { // 수정 모드
        await updatePartnerCompany(selectedPartner.id, {
          companyName: formData.companyName,
          corp_name: formData.companyName,
          corp_code: formData.corpCode, 
          contract_start_date: formData.contractStartDate,
          status: formData.status
        })
        toast({title: '성공', description: '파트너사가 수정되었습니다.'})
      } else { // 추가 모드
        await createPartnerCompany({
          companyName: formData.companyName,
          corpCode: formData.corpCode,
          contractStartDate: formData.contractStartDate
        })
        toast({title: '성공', description: '파트너사가 추가되었습니다.'})
      }
      resetModalStateAndClose()
      await loadPartners(isEditDialogOpen ? currentPage : 1, debouncedMainSearchQuery || undefined)
    } catch (error) {
      console.error('Failed to save partner company:', error)
      const errorMessage = error instanceof Error ? error.message : (isEditDialogOpen ? '파트너사 수정에 실패했습니다.' : '파트너사 추가에 실패했습니다.')
      setDialogError(errorMessage)
      toast({ variant: 'destructive', title: '저장 오류', description: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, toast, currentPage, debouncedMainSearchQuery, loadPartners, resetModalStateAndClose, isEditDialogOpen, selectedPartner])

  // 파트너사 삭제 핸들러 (HEAD 기준)
  const handleDeletePartner = useCallback(async () => {
    if (!selectedPartner?.id) return

    setIsSubmitting(true) // 삭제 작업도 submitting 상태 사용
    try {
      await deletePartnerCompany(selectedPartner.id)
      toast({title: '성공', description: '파트너사가 삭제되었습니다.'})
      setIsDeleteDialogOpen(false)
      setSelectedPartner(null) // 선택 해제
      // 현재 페이지의 아이템이 모두 삭제되었을 경우, 이전 페이지로 이동하거나 1페이지로 이동
      let pageToLoad = currentPage
      if (partners.length === 1 && currentPage > 1) {
        pageToLoad = currentPage - 1
      }
      await loadPartners(pageToLoad, debouncedMainSearchQuery || undefined)
    } catch (error) {
      console.error('Failed to delete partner company:', error)
      toast({ variant: 'destructive', title: '삭제 오류', description: '파트너사 삭제에 실패했습니다.' })
    } finally {
      setIsSubmitting(false)
    }
  }, [selectedPartner, currentPage, partners.length, debouncedMainSearchQuery, loadPartners, toast])
  
  // 페이지 이동 핸들러 (HEAD 기준)
  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return
    loadPartners(page, debouncedMainSearchQuery || undefined)
  }, [totalPages, currentPage, debouncedMainSearchQuery, loadPartners])

  // 수정 다이얼로그 열기 핸들러
  const openEditDialog = (partner: PartnerCompany) => {
    setSelectedPartner(partner)
    
    // status 타입 처리: PartnerCompany['status'] 타입에 'ACTIVE', 'INACTIVE', 'PENDING'이 포함된다고 가정
    let finalStatus: PartnerCompany['status'] = 'ACTIVE'; // 기본값
    const validStatuses: Array<PartnerCompany['status']> = ['ACTIVE', 'INACTIVE', 'PENDING'];
    if (partner.status && validStatuses.includes(partner.status)) {
      finalStatus = partner.status;
    }

    setFormData({
      id: partner.id || '',
      companyName: partner.corp_name || partner.companyName, 
      corpCode: partner.corp_code,
      contractStartDate: partner.contract_start_date ? partner.contract_start_date.split('T')[0] : new Date().toISOString().split('T')[0],
      status: finalStatus
    })
    setCompanySearchQuery(partner.corp_name || partner.companyName) 
    setSelectedDartCompany({ // 선택된 DART 회사 정보도 설정 (수정 시 DART 재검색 불필요하게 안 하도록)
      corp_code: partner.corp_code,
      corp_name: partner.corp_name || partner.companyName,
      stock_code: partner.stock_code,
      modify_date: partner.modify_date || ''
    })
    setIsEditDialogOpen(true)
  }
  
  // 추가 다이얼로그 열기 핸들러
  const openAddDialog = () => {
    resetModalStateAndClose() // 이전 상태 초기화
    setIsAddDialogOpen(true)
  }

  // 로딩 UI
  if (isPageLoading && partners.length === 0) { // 초기 전체 페이지 로딩
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-customG" />
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full p-4 md:p-8">
      <div className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Home className="w-4 h-4 mr-1" />
        <span>협력사 관리</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-customG">파트너사 관리</span>
      </div>

      <PageHeader
        icon={<Building2 className="h-8 w-8" />}
        title="파트너사 관리"
        description="파트너사를 등록, 조회, 수정 및 삭제합니다."
        module="CSDD"
      />
      
      <div className="flex flex-col gap-4 mt-6">
        <div className="flex justify-between items-center">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="파트너사명 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </Button>
            )}
          </div>
          
          <Button onClick={openAddDialog} className="bg-customG hover:bg-customGDark">
            <Plus className="mr-2 h-4 w-4" />
            파트너사 추가
          </Button>
        </div>
        
        <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
          if (!open) resetModalStateAndClose()
          else if (isAddDialogOpen) setIsAddDialogOpen(true)
          else if (isEditDialogOpen) setIsEditDialogOpen(true)
        }}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{isEditDialogOpen ? '파트너사 수정' : '파트너사 추가'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-3">
              <div>
                <Label htmlFor="companySearch">회사 검색 (DART)</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companySearch"
                    placeholder="회사명 입력 후 검색"
                    value={companySearchQuery}
                    onChange={(e) => setCompanySearchQuery(e.target.value)}
                    className="pl-9"
                    disabled={isSubmitting}
                  />
                  {isLoading && companySearchQuery && (
                    <Loader2 className="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                
                {dartSearchResults.length > 0 && (
                  <div className="mt-2 border rounded-md max-h-48 overflow-y-auto">
                    {dartSearchResults.map((company) => (
                      <button
                        key={company.corp_code}
                        type="button"
                        className={`w-full p-2.5 hover:bg-slate-100 cursor-pointer flex justify-between items-center text-left ${selectedDartCompany?.corp_code === company.corp_code ? 'bg-slate-100' : ''}`}
                        onClick={() => handleSelectDartCompany(company)}
                        disabled={isSubmitting}
                      >
                        <div>
                          <p className="font-medium text-sm">{company.corp_name}</p>
                          <p className="text-xs text-muted-foreground">
                            DART 코드: {company.corp_code} {company.stock_code ? `(주식코드: ${company.stock_code})` : ''}
                          </p>
                        </div>
                        {selectedDartCompany?.corp_code === company.corp_code && (
                           <Check className="h-4 w-4 text-customG flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
                {dialogError && dartSearchResults.length === 0 && companySearchQuery && !isLoading && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                    {dialogError}
                  </p>
                )}
              </div>
              
              {/* 회사명, DART 코드, 계약 시작일 입력 필드는 추가 모드일 때는 숨기고, 수정 모드일 때만 보이도록 변경 */}
              {isEditDialogOpen && (
                <>
                  <div>
                    <Label htmlFor="companyName">회사명</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                      className="mt-1"
                      placeholder="파트너사 회사명"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="corpCode">DART 코드</Label>
                    <Input
                      id="corpCode"
                      value={formData.corpCode}
                      onChange={(e) => setFormData({...formData, corpCode: e.target.value})}
                      className="mt-1"
                      placeholder="DART 고유번호 (8자리)"
                      maxLength={8}
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contractStartDate">계약 시작일</Label>
                    <Input
                      id="contractStartDate"
                      type="date"
                      value={formData.contractStartDate}
                      onChange={(e) => setFormData({...formData, contractStartDate: e.target.value})}
                      className="mt-1"
                      disabled={isSubmitting}
                    />
                  </div>
                </>
              )}

              {isEditDialogOpen && (
                <div>
                  <Label htmlFor="status">상태</Label>
                  <select 
                    id="status" 
                    value={formData.status || ''}
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue === 'ACTIVE' || selectedValue === 'INACTIVE' || selectedValue === 'PENDING') {
                        setFormData({...formData, status: selectedValue });
                      } else {
                        setFormData({...formData, status: 'ACTIVE' }); 
                      }
                    }}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-customG focus:border-customG sm:text-sm rounded-md disabled:bg-slate-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    <option value="ACTIVE">활성</option>
                    <option value="INACTIVE">비활성</option>
                    <option value="PENDING">보류</option>
                  </select>
                </div>
              )}

              {dialogError && !companySearchQuery && (
                 <p className="text-sm text-red-500"><AlertTriangle className="h-4 w-4 mr-1.5 inline-block"/>{dialogError}</p>
              )}

            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline" onClick={resetModalStateAndClose} disabled={isSubmitting}>
                  취소
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleSubmitPartner}
                disabled={ 
                  isSubmitting || 
                  (isAddDialogOpen && !selectedDartCompany) || // 추가 모드: DART 회사 선택 필수
                  (isEditDialogOpen && (!formData.companyName || !formData.corpCode || !formData.contractStartDate)) // 수정 모드: 기존 조건 (모든 필드 필요)
                }
                className="bg-customG hover:bg-customGDark"
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 처리 중...</>
                ) : (isEditDialogOpen ? '저장' : '추가')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {(isLoading && partners.length === 0 && !isPageLoading) ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="ml-3 text-muted-foreground">파트너사 목록을 불러오는 중...</p>
          </div>
        ) : partners.length === 0 && !searchQuery ? (
          <div className="text-center py-10">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">등록된 파트너사 없음</h3>
            <p className="mt-1 text-sm text-gray-500">아직 등록된 파트너사가 없습니다. 먼저 파트너사를 추가해주세요.</p>
            <div className="mt-6">
              <Button onClick={openAddDialog} className="bg-customG hover:bg-customGDark">
                <Plus className="mr-2 h-4 w-4" />
                파트너사 추가하기
              </Button>
            </div>
          </div>
        ) : partners.length === 0 && searchQuery ? (
           <div className="text-center py-10">
            <Search className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">검색 결과 없음</h3>
            <p className="mt-1 text-sm text-gray-500">
              '<span className="font-semibold">{searchQuery}</span>'에 대한 검색 결과가 없습니다.
            </p>
          </div>
        ) : (
          <div className="border rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">회사명</TableHead>
                  <TableHead className="w-[15%]">DART 코드</TableHead>
                  <TableHead className="w-[15%]">상장 정보</TableHead>
                  <TableHead className="w-[15%]">계약 시작일</TableHead>
                  <TableHead className="text-right w-[15%]">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner) => (
                  <TableRow key={partner.id} className="hover:bg-slate-50">
                    <TableCell className="font-medium py-3">{partner.corp_name || partner.companyName}</TableCell>
                    <TableCell className="py-3">{partner.corp_code}</TableCell>
                    <TableCell className="py-3">
                      {partner.stock_code ? (
                        <Badge variant="outline" className="border-sky-300 text-sky-700 bg-sky-50">
                          {partner.stock_code} (상장)
                        </Badge>
                      ) : (
                        <Badge variant="secondary">비상장</Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-3">{partner.contract_start_date ? new Date(partner.contract_start_date).toLocaleDateString() : '-'}</TableCell>
                    <TableCell className="text-right py-2.5">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">메뉴 열기</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(partner)}>
                            <Edit3 className="mr-2 h-4 w-4" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPartner(partner)
                              setIsDeleteDialogOpen(true)
                            }}
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
        
        {totalPages > 1 && partners.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm"
            >
              이전
            </Button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                (page === 1 || page === totalPages || (page >= currentPage -1 && page <= currentPage + 1)) && (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-9 h-9 px-3 py-1.5 text-sm"
                >
                  {page}
                </Button>
                )
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm"
            >
              다음
            </Button>
          </div>
        )}
      </div>
      
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>파트너사 삭제 확인</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 <span className="font-semibold">{selectedPartner?.corp_name || selectedPartner?.companyName}</span> 파트너사를 삭제하시겠습니까?
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedPartner(null)} disabled={isSubmitting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePartner}
              className="bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash className="mr-2 h-4 w-4" />} 
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
