'use client'

import React, {useState, useEffect, useCallback} from 'react'
import {PageHeader} from '@/components/layout/PageHeader'
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
  ChevronLeft,
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
import {Badge} from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
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
import {useToast} from '@/hooks/use-toast'

import {
  fetchPartnerCompanies,
  createPartnerCompany,
  deletePartnerCompany,
  updatePartnerCompany,
  searchCompaniesFromDart
} from '@/services/partnerCompany'
import {DartCorpInfo, PartnerCompany} from '@/types/IFRS/partnerCompany'

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
  const {toast} = useToast()

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
  const [selectedDartCompany, setSelectedDartCompany] = useState<DartCorpInfo | null>(
    null
  ) // DART에서 선택된 회사 (origin/develop: selectedCompany)

  // 입력 폼 데이터 (HEAD: newPartnerData, origin/develop: newPartnerData 와 유사)
  const [formData, setFormData] = useState({
    id: '', // 수정 시 사용
    companyName: '',
    corpCode: '',
    contractStartDate: new Date().toISOString().split('T')[0]
  })

  const [dialogError, setDialogError] = useState<string | null>(null) // 다이얼로그 내 에러 (origin/develop: error)

  // 디바운스된 검색어
  const debouncedMainSearchQuery = useDebounce(searchQuery, 500) // 파트너 목록 검색 (HEAD)
  const debouncedDartSearchQuery = useDebounce(companySearchQuery, 500) // DART 검색 (HEAD)

  // 파트너사 목록 로드 (페이징 및 검색 지원) - HEAD 기준
  const loadPartners = useCallback(
    async (page: number, companyNameFilter?: string) => {
      setIsLoading(true)
      setIsPageLoading(false) // 실제 로딩 시작 시 페이지 로딩 상태 false
      try {
        const response = await fetchPartnerCompanies(page, pageSize, companyNameFilter)
        // API 응답이 Spring Data Page 형태인지 확인하고 적절히 처리
        const partners = response.content || response.data || []
        const transformedData = partners.map(p => ({
          ...p,
          companyName: p.corp_name || p.corpName || p.companyName,
          corpName: p.corp_name || p.corpName,
          corpCode: p.corp_code || p.corpCode,
          stockCode: p.stock_code || p.stockCode,
          contractStartDate: p.contract_start_date || p.contractStartDate,
          modifyDate: p.modify_date || p.modifyDate
        }))
        setPartners(transformedData)
        setCurrentPage(response.number ? response.number + 1 : response.page || page)
        setTotalPages(
          response.totalPages ||
            Math.ceil(
              (response.totalElements || response.total || 0) /
                (response.size || response.pageSize || pageSize)
            )
        )
        setTotalItems(response.totalElements || response.total || 0)
      } catch (error) {
        console.error('Failed to load partner companies:', error)
        toast({
          variant: 'destructive',
          title: '오류',
          description: '파트너사 목록을 불러오는데 실패했습니다.'
        })
      } finally {
        setIsLoading(false)
      }
    },
    [pageSize, toast]
  )

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

      setDartSearchResults(response.content || response.data || []) // API 응답이 content 또는 data 배열을 포함한다고 가정
      if ((response.content || response.data || []).length === 0) {
        setDialogError(`'${debouncedDartSearchQuery}'에 대한 검색 결과가 없습니다.`)
      }
    } catch (error) {
      console.error('Failed to search companies from DART:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'DART 기업 검색 중 오류가 발생했습니다.'
      setDialogError(errorMessage)
      toast({
        variant: 'destructive',
        title: 'DART 검색 오류',
        description: errorMessage
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
    setSelectedDartCompany(company)
    setFormData(prev => ({
      ...prev,
      companyName: company.corpName || company.corp_name || '',
      corpCode: company.corpCode || company.corp_code || '',
      contractStartDate: new Date().toISOString().split('T')[0]
    }))
    // 선택한 회사명을 검색 필드에 유지
    setCompanySearchQuery(company.corpName || company.corp_name || '')
    // 검색 결과는 유지하되, 에러는 제거
    setDialogError(null)
  }, [])

  // 모달 상태 초기화 (HEAD + origin/develop)
  const resetModalStateAndClose = useCallback(() => {
    setFormData({
      id: '',
      companyName: '',
      corpCode: '',
      contractStartDate: new Date().toISOString().split('T')[0]
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
      toast({
        variant: 'destructive',
        title: '입력 오류',
        description: '회사명, DART코드, 계약 시작일은 필수입니다.'
      })
      return
    }

    setIsSubmitting(true)
    setDialogError(null)
    try {
      // 선택된 DART 회사에서 주식코드 가져오기
      const stockCode = selectedDartCompany?.stockCode || selectedDartCompany?.stock_code

      if (isEditDialogOpen && selectedPartner?.id) {
        // 수정 모드
        await updatePartnerCompany(selectedPartner.id, {
          companyName: formData.companyName,
          corpName: formData.companyName,
          corpCode: formData.corpCode,
          contractStartDate: formData.contractStartDate,
          stockCode: stockCode // 주식코드 추가
        })
        toast({title: '성공', description: '파트너사가 수정되었습니다.'})
      } else {
        // 추가 모드
        await createPartnerCompany({
          companyName: formData.companyName,
          corpCode: formData.corpCode,
          contractStartDate: formData.contractStartDate,
          stockCode: stockCode // 주식코드 추가
        })
        toast({title: '성공', description: '파트너사가 추가되었습니다.'})
      }
      resetModalStateAndClose()
      await loadPartners(
        isEditDialogOpen ? currentPage : 1,
        debouncedMainSearchQuery || undefined
      )
    } catch (error) {
      console.error('Failed to save partner company:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : isEditDialogOpen
          ? '파트너사 수정에 실패했습니다.'
          : '파트너사 추가에 실패했습니다.'
      setDialogError(errorMessage)
      toast({variant: 'destructive', title: '저장 오류', description: errorMessage})
    } finally {
      setIsSubmitting(false)
    }
  }, [
    formData,
    toast,
    currentPage,
    debouncedMainSearchQuery,
    loadPartners,
    resetModalStateAndClose,
    isEditDialogOpen,
    selectedPartner
  ])

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
      toast({
        variant: 'destructive',
        title: '삭제 오류',
        description: '파트너사 삭제에 실패했습니다.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [
    selectedPartner,
    currentPage,
    partners.length,
    debouncedMainSearchQuery,
    loadPartners,
    toast
  ])

  // 페이지 이동 핸들러 (HEAD 기준)
  const handlePageChange = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages || page === currentPage) return
      loadPartners(page, debouncedMainSearchQuery || undefined)
    },
    [totalPages, currentPage, debouncedMainSearchQuery, loadPartners]
  )

  // 수정 다이얼로그 열기 핸들러
  const openEditDialog = (partner: PartnerCompany) => {
    setSelectedPartner(partner)

    setFormData({
      id: partner.id || '',
      companyName: partner.corpName || partner.companyName,
      corpCode: partner.corpCode || partner.corp_code || '',
      contractStartDate:
        partner.contract_start_date || partner.contractStartDate
          ? (partner.contract_start_date || partner.contractStartDate)
              ?.toString()
              .split('T')[0] || new Date().toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
    })
    setCompanySearchQuery(partner.corpName || partner.companyName)
    setSelectedDartCompany({
      // 선택된 DART 회사 정보도 설정 (수정 시 DART 재검색 불필요하게 안 하도록)
      corpCode: partner.corpCode || partner.corp_code || '',
      corpName: partner.corpName || partner.companyName,
      stockCode: partner.stockCode || partner.stock_code,
      modifyDate: partner.modifyDate || partner.modify_date || '',
      // 백엔드 호환성
      corp_code: partner.corpCode || partner.corp_code || '',
      corp_name: partner.corpName || partner.companyName,
      stock_code: partner.stockCode || partner.stock_code,
      modify_date: partner.modifyDate || partner.modify_date || ''
    })
    setIsEditDialogOpen(true)
  }

  // 추가 다이얼로그 열기 핸들러
  const openAddDialog = () => {
    resetModalStateAndClose() // 이전 상태 초기화
    setIsAddDialogOpen(true)
  }

  // 로딩 UI
  if (isPageLoading && partners.length === 0) {
    // 초기 전체 페이지 로딩
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-customG" />
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
        icon={<Building2 className="w-8 h-8" />}
        title="파트너사 관리"
        description="파트너사를 등록, 조회, 수정 및 삭제합니다."
        module="CSDD"
      />

      <div className="flex flex-col gap-6 mt-8">
        {/* 검색 및 추가 버튼 섹션 */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-slate-400" />
            <Input
              placeholder="파트너사명으로 검색하세요..."
              value={searchQuery || ''}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-12 pl-12 pr-12 text-base transition-all duration-200 bg-white border-2 shadow-sm border-slate-200 rounded-xl focus:border-customG focus:ring-customG/20 placeholder:text-slate-400"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery('')}
                className="absolute w-8 h-8 transition-colors transform -translate-y-1/2 rounded-lg right-3 top-1/2 hover:bg-slate-100">
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </Button>
            )}
          </div>

          <Button
            onClick={openAddDialog}
            className="h-12 px-6 font-medium text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-customG to-emerald-600 hover:from-customGDark hover:to-emerald-700 rounded-xl hover:shadow-xl hover:scale-105">
            <Plus className="w-5 h-5 mr-2" />새 파트너사 추가
          </Button>
        </div>

        <Dialog
          open={isAddDialogOpen || isEditDialogOpen}
          onOpenChange={open => {
            if (!open) resetModalStateAndClose()
            else if (isAddDialogOpen) setIsAddDialogOpen(true)
            else if (isEditDialogOpen) setIsEditDialogOpen(true)
          }}>
          <DialogContent className="bg-white border-0 shadow-2xl sm:max-w-2xl rounded-2xl">
            <DialogHeader className="pb-6 border-b border-slate-100">
              <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-slate-800">
                <div className="p-2 rounded-lg bg-gradient-to-br from-customG to-emerald-600">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                {isEditDialogOpen ? '파트너사 정보 수정' : '새 파트너사 등록'}
              </DialogTitle>
            </DialogHeader>
            <div className="py-6 space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="companySearch"
                  className="flex items-center gap-2 text-base font-semibold text-slate-700">
                  <Search className="w-4 h-4" />
                  회사 검색 (DART 데이터베이스)
                </Label>
                <div className="relative">
                  <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-slate-400" />
                  <Input
                    id="companySearch"
                    placeholder="검색할 회사명을 입력하세요"
                    value={companySearchQuery || ''}
                    onChange={e => setCompanySearchQuery(e.target.value)}
                    className="h-12 pl-12 text-base transition-all duration-200 border-2 bg-slate-50 border-slate-200 rounded-xl focus:border-customG focus:ring-customG/20"
                    disabled={isSubmitting}
                  />
                  {isLoading && companySearchQuery && (
                    <div className="absolute transform -translate-y-1/2 right-4 top-1/2">
                      <Loader2 className="w-5 h-5 animate-spin text-customG" />
                    </div>
                  )}
                </div>

                {dartSearchResults.length > 0 && (
                  <div className="mt-4 overflow-hidden bg-white border-2 shadow-sm border-slate-200 rounded-xl">
                    <div className="overflow-y-auto max-h-64">
                      {dartSearchResults.map((company, index) => (
                        <button
                          key={`dart-${company.corpCode || company.corp_code}-${index}`}
                          type="button"
                          className={`w-full p-4 hover:bg-slate-50 cursor-pointer flex justify-between items-center text-left transition-all duration-200 border-b border-slate-100 last:border-b-0 ${
                            (selectedDartCompany?.corpCode ||
                              selectedDartCompany?.corp_code) ===
                            (company.corpCode || company.corp_code)
                              ? 'bg-customG/5 border-l-4 border-l-customG'
                              : ''
                          }`}
                          onClick={() => handleSelectDartCompany(company)}
                          disabled={isSubmitting}>
                          <div className="flex-1">
                            <p className="mb-1 text-base font-semibold text-slate-800">
                              {company.corpName || company.corp_name}
                            </p>
                            <p className="flex items-center gap-4 text-sm text-slate-500">
                              <span className="px-2 py-1 font-mono rounded-md bg-slate-100">
                                DART: {company.corpCode || company.corp_code}
                              </span>
                              {(company.stockCode || company.stock_code) &&
                                String(
                                  company.stockCode || company.stock_code
                                ).trim() && (
                                  <span className="px-2 py-1 font-mono rounded-md bg-emerald-100 text-emerald-700">
                                    주식: {company.stockCode || company.stock_code}
                                  </span>
                                )}
                            </p>
                          </div>
                          {(selectedDartCompany?.corpCode ||
                            selectedDartCompany?.corp_code) ===
                            (company.corpCode || company.corp_code) && (
                            <div className="p-2 ml-4 rounded-full bg-customG">
                              <Check className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {dialogError &&
                  dartSearchResults.length === 0 &&
                  companySearchQuery &&
                  !isLoading && (
                    <div className="flex items-center gap-3 p-4 mt-4 border border-red-200 bg-red-50 rounded-xl">
                      <AlertTriangle className="flex-shrink-0 w-5 h-5 text-red-500" />
                      <p className="text-sm font-medium text-red-700">{dialogError}</p>
                    </div>
                  )}
              </div>

              {/* 회사명, DART 코드, 계약 시작일 입력 필드는 추가 모드일 때는 숨기고, 수정 모드일 때만 보이도록 변경 */}
              {isEditDialogOpen && (
                <div className="p-6 space-y-6 border bg-slate-50 rounded-xl border-slate-200">
                  <h4 className="mb-4 text-lg font-semibold text-slate-800">
                    파트너사 상세 정보
                  </h4>

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label
                        htmlFor="companyName"
                        className="text-sm font-semibold text-slate-700">
                        회사명
                      </Label>
                      <Input
                        id="companyName"
                        value={formData.companyName || ''}
                        onChange={e =>
                          setFormData({...formData, companyName: e.target.value})
                        }
                        className="transition-all duration-200 bg-white border-2 rounded-lg h-11 border-slate-200 focus:border-customG focus:ring-customG/20"
                        placeholder="파트너사 회사명을 입력하세요"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="corpCode"
                        className="text-sm font-semibold text-slate-700">
                        DART 코드
                      </Label>
                      <Input
                        id="corpCode"
                        value={formData.corpCode || ''}
                        onChange={e =>
                          setFormData({...formData, corpCode: e.target.value})
                        }
                        className="font-mono transition-all duration-200 bg-white border-2 rounded-lg h-11 border-slate-200 focus:border-customG focus:ring-customG/20"
                        placeholder="8자리 DART 고유번호"
                        maxLength={8}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contractStartDate"
                      className="text-sm font-semibold text-slate-700">
                      계약 시작일
                    </Label>
                    <Input
                      id="contractStartDate"
                      type="date"
                      value={formData.contractStartDate || ''}
                      onChange={e =>
                        setFormData({...formData, contractStartDate: e.target.value})
                      }
                      className="transition-all duration-200 bg-white border-2 rounded-lg h-11 border-slate-200 focus:border-customG focus:ring-customG/20"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}

              {dialogError && !companySearchQuery && (
                <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 rounded-xl">
                  <AlertTriangle className="flex-shrink-0 w-5 h-5 text-red-500" />
                  <p className="text-sm font-medium text-red-700">{dialogError}</p>
                </div>
              )}
            </div>
            <DialogFooter className="gap-3 pt-6 border-t border-slate-100">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetModalStateAndClose}
                  disabled={isSubmitting}
                  className="px-6 transition-all duration-200 border-2 rounded-lg h-11 border-slate-200 hover:border-slate-300">
                  취소
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleSubmitPartner}
                disabled={
                  isSubmitting ||
                  (isAddDialogOpen && !selectedDartCompany) || // 추가 모드: DART 회사 선택 필수
                  (isEditDialogOpen &&
                    (!formData.companyName ||
                      !formData.corpCode ||
                      !formData.contractStartDate)) // 수정 모드: 기존 조건 (모든 필드 필요)
                }
                className="px-8 font-semibold text-white transition-all duration-200 transform rounded-lg shadow-lg h-11 bg-gradient-to-r from-customG to-emerald-600 hover:from-customGDark hover:to-emerald-700 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:transform-none">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 처리 중...
                  </>
                ) : isEditDialogOpen ? (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    정보 저장
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    파트너사 등록
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {isLoading && partners.length === 0 && !isPageLoading ? (
          <div className="flex items-center justify-center p-16">
            <div className="text-center">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-customG" />
              <p className="text-lg font-medium text-slate-700">
                파트너사 목록을 불러오는 중...
              </p>
              <p className="mt-1 text-sm text-slate-500">잠시만 기다려주세요</p>
            </div>
          </div>
        ) : partners.length === 0 && !searchQuery ? (
          <div className="bg-white border-2 shadow-lg border-slate-200 rounded-2xl">
            <div className="py-16 text-center">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl">
                <Users className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-800">
                아직 등록된 파트너사가 없습니다
              </h3>
              <p className="max-w-md mx-auto mb-8 text-base text-slate-500">
                ESG 경영을 함께할 파트너사를 등록해보세요. DART 데이터베이스와 연동하여
                손쉽게 관리할 수 있습니다.
              </p>
              <Button
                onClick={openAddDialog}
                className="h-12 px-8 font-semibold text-white transition-all duration-200 transform shadow-lg bg-gradient-to-r from-customG to-emerald-600 hover:from-customGDark hover:to-emerald-700 rounded-xl hover:shadow-xl hover:scale-105">
                <Plus className="w-5 h-5 mr-2" />첫 번째 파트너사 등록하기
              </Button>
            </div>
          </div>
        ) : partners.length === 0 && searchQuery ? (
          <div className="bg-white border-2 shadow-lg border-slate-200 rounded-2xl">
            <div className="py-16 text-center">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl">
                <Search className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-slate-800">
                검색 결과가 없습니다
              </h3>
              <p className="mb-2 text-base text-slate-500">
                '<span className="font-semibold text-slate-700">{searchQuery}</span>'와
                일치하는 파트너사를 찾을 수 없습니다.
              </p>
              <p className="text-sm text-slate-400">
                다른 검색어로 시도해보시거나, 새로운 파트너사를 등록해보세요.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden bg-white border-2 shadow-lg border-slate-200 rounded-2xl">
            <Table>
              <TableHeader>
                <TableRow className="border-b-2 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-150 border-slate-200">
                  <TableHead className="px-6 text-base font-bold h-14 text-slate-800">
                    회사명
                  </TableHead>
                  <TableHead className="px-6 text-base font-bold h-14 text-slate-800">
                    DART 코드
                  </TableHead>
                  <TableHead className="px-6 text-base font-bold h-14 text-slate-800">
                    상장 정보
                  </TableHead>
                  <TableHead className="px-6 text-base font-bold h-14 text-slate-800">
                    계약 시작일
                  </TableHead>
                  <TableHead className="px-6 text-base font-bold text-center h-14 text-slate-800">
                    관리
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.map((partner, index) => (
                  <TableRow
                    key={partner.id || `partner-${index}`}
                    className="transition-all duration-200 border-b hover:bg-slate-50/80 border-slate-100 last:border-b-0">
                    <TableCell className="h-16 px-6 text-base font-semibold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-customG"></div>
                        {partner.corpName || partner.companyName}
                      </div>
                    </TableCell>
                    <TableCell className="h-16 px-6">
                      <code className="px-3 py-1 font-mono text-sm font-medium rounded-lg bg-slate-100 text-slate-700">
                        {partner.corpCode || partner.corp_code}
                      </code>
                    </TableCell>
                    <TableCell className="h-16 px-6">
                      {(() => {
                        const stockCode = partner.stockCode || partner.stock_code

                        // 디버깅을 위한 로그 (개발 환경에서만)
                        if (process.env.NODE_ENV === 'development') {
                          console.log('주식코드 검증:', {
                            companyName: partner.corpName || partner.companyName,
                            stockCode: stockCode,
                            stockCodeType: typeof stockCode,
                            rawStockCode: partner.stockCode,
                            rawStock_code: partner.stock_code,
                            trimmedStockCode: stockCode ? String(stockCode).trim() : null,
                            isEmptyAfterTrim: stockCode
                              ? String(stockCode).trim() === ''
                              : null
                          })
                        }

                        // 개선된 주식코드 검증 로직
                        const isValidStockCode = (() => {
                          // null, undefined 체크
                          if (!stockCode) return false

                          // 문자열로 변환하여 처리
                          const codeStr = String(stockCode).trim()

                          // 빈 문자열 또는 공백만 있는 경우
                          if (codeStr === '') return false

                          // 무효한 값들 체크
                          const invalidValues = ['n/a', 'null', 'undefined', '000000']
                          if (invalidValues.includes(codeStr.toLowerCase())) return false

                          // 모든 자리가 0인 경우 (000000 외에 다른 길이도 체크)
                          if (/^0+$/.test(codeStr)) return false

                          // 유효한 주식코드로 판단 (숫자 6자리)
                          return /^\d{6}$/.test(codeStr)
                        })()

                        if (isValidStockCode) {
                          return (
                            <Badge
                              variant="outline"
                              className="px-3 py-1 font-semibold border-2 rounded-lg text-emerald-700 bg-emerald-50 border-emerald-200">
                              <div className="w-2 h-2 mr-2 rounded-full bg-emerald-500"></div>
                              {String(stockCode).trim()}
                            </Badge>
                          )
                        } else {
                          return (
                            <Badge
                              variant="secondary"
                              className="px-3 py-1 font-semibold border-2 rounded-lg text-slate-600 bg-slate-100 border-slate-200">
                              <div className="w-2 h-2 mr-2 rounded-full bg-slate-400"></div>
                              비상장
                            </Badge>
                          )
                        }
                      })()}
                    </TableCell>
                    <TableCell className="h-16 px-6 font-medium text-slate-600">
                      {partner.contract_start_date || partner.contractStartDate
                        ? new Date(
                            (partner.contract_start_date || partner.contractStartDate)!
                          ).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : '-'}
                    </TableCell>
                    <TableCell className="h-16 px-6 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-10 h-10 transition-colors rounded-lg hover:bg-slate-100">
                            <MoreHorizontal className="w-5 h-5 text-slate-600" />
                            <span className="sr-only">메뉴 열기</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48 p-2 bg-white border-2 shadow-xl border-slate-200 rounded-xl">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(partner)}
                            className="flex items-center gap-3 px-4 py-3 transition-colors rounded-lg cursor-pointer hover:bg-slate-50">
                            <Edit3 className="w-4 h-4 text-slate-600" />
                            <span className="font-medium text-slate-700">정보 수정</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPartner(partner)
                              setIsDeleteDialogOpen(true)
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-red-600 transition-colors rounded-lg cursor-pointer hover:bg-red-50 focus:text-red-600 focus:bg-red-50">
                            <Trash className="w-4 h-4" />
                            <span className="font-medium">파트너사 삭제</span>
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
          <div className="flex items-center justify-center gap-3 pt-8 mt-8 border-t-2 border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-10 px-4 font-medium transition-all duration-200 border-2 rounded-lg border-slate-200 hover:border-customG hover:bg-customG/5">
              <ChevronLeft className="w-4 h-4 mr-1" />
              이전
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({length: totalPages}, (_, i) => i + 1)
                .filter(
                  page =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                )
                .map((page, index, array) => (
                  <React.Fragment key={`page-${page}`}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-2 text-slate-400">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-customG text-white border-customG shadow-lg hover:bg-customGDark'
                          : 'border-2 border-slate-200 hover:border-customG hover:bg-customG/5'
                      }`}>
                      {page}
                    </Button>
                  </React.Fragment>
                ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-10 px-4 font-medium transition-all duration-200 border-2 rounded-lg border-slate-200 hover:border-customG hover:bg-customG/5">
              다음
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="bg-white border-0 shadow-2xl sm:max-w-lg rounded-2xl">
          <AlertDialogHeader className="pb-6 text-center">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <Trash className="w-8 h-8 text-red-600" />
            </div>
            <AlertDialogTitle className="mb-2 text-2xl font-bold text-slate-800">
              파트너사 삭제 확인
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base leading-relaxed text-slate-600">
              정말로{' '}
              <span className="px-2 py-1 font-bold rounded-md text-slate-800 bg-slate-100">
                {selectedPartner?.corpName || selectedPartner?.companyName}
              </span>{' '}
              파트너사를 삭제하시겠습니까?
              <br />
              <span className="block mt-2 font-semibold text-red-600">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 pt-6">
            <AlertDialogCancel
              onClick={() => setSelectedPartner(null)}
              disabled={isSubmitting}
              className="px-6 font-medium transition-all duration-200 border-2 rounded-lg h-11 border-slate-200 hover:border-slate-300">
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePartner}
              className="px-6 font-semibold text-white transition-all duration-200 transform bg-red-600 rounded-lg shadow-lg h-11 hover:bg-red-700 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:transform-none"
              disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  삭제 중...
                </>
              ) : (
                <>
                  <Trash className="w-4 h-4 mr-2" />
                  완전 삭제
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
