'use client'

import {useState, useEffect, useCallback} from 'react'
import {useToast} from '@/hooks/use-toast'
import {
  fetchPartnerCompanies,
  createPartnerCompany,
  updatePartnerCompany,
  deletePartnerCompany,
  searchCompaniesFromDart
} from '@/services/partnerCompany'
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
  Users,
  Calendar,
  Shield
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog'
import {Badge} from '@/components/ui/badge'
import {Card, CardContent} from '@/components/ui/card'
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

// 상태 배지 컴포넌트
const StatusBadge = ({status}: {status?: 'ACTIVE' | 'INACTIVE' | 'PENDING'}) => {
  const statusConfig = {
    ACTIVE: {
      label: '활성',
      className: 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
    },
    INACTIVE: {
      label: '비활성',
      className: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
    },
    PENDING: {
      label: '보류',
      className: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100'
    }
  }

  const config = statusConfig[status || 'ACTIVE']

  return (
    <Badge variant="outline" className={config.className}>
      <Shield className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  )
}

export default function ManagePartnerPage() {
  const {toast} = useToast()

  // 상태 관리
  const [partners, setPartners] = useState<PartnerCompany[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize] = useState(10)

  // 다이얼로그 상태
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<PartnerCompany | null>(null)

  // 추가/수정 다이얼로그 내 상태
  const [companySearchQuery, setCompanySearchQuery] = useState('')
  const [dartSearchResults, setDartSearchResults] = useState<DartCorpInfo[]>([])
  const [selectedDartCompany, setSelectedDartCompany] = useState<DartCorpInfo | null>(
    null
  )

  // 입력 폼 데이터
  const [formData, setFormData] = useState({
    id: '',
    companyName: '',
    corpCode: '',
    contractStartDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'PENDING'
  })

  const [dialogError, setDialogError] = useState<string | null>(null)

  // 디바운스된 검색어
  const debouncedMainSearchQuery = useDebounce(searchQuery, 500)
  const debouncedDartSearchQuery = useDebounce(companySearchQuery, 500)

  // 파트너사 목록 로드
  const loadPartners = useCallback(
    async (page: number, companyNameFilter?: string) => {
      // 최종 방어 로직 - 페이지 번호 철저한 검증
      console.log('🔍 loadPartners 호출됨:', {page, companyNameFilter})

      let validPage = 1

      // 다양한 타입의 잘못된 입력 처리
      if (page === null || page === undefined) {
        console.warn('⚠️ page가 null/undefined:', page)
        validPage = 1
      } else {
        const pageNum = Number(page)
        if (isNaN(pageNum) || !isFinite(pageNum) || pageNum < 1) {
          console.warn('⚠️ 잘못된 page 값:', page, '타입:', typeof page)
          validPage = 1
        } else {
          validPage = Math.max(1, Math.floor(pageNum))
        }
      }

      console.log('✅ 검증된 page 값:', validPage)

      setIsLoading(true)
      setIsPageLoading(false)
      try {
        console.log('📡 API 호출 시작 - 페이지:', validPage, '필터:', companyNameFilter)
        const response = await fetchPartnerCompanies(
          validPage,
          pageSize,
          companyNameFilter
        )
        console.log('📡 API 응답 받음:', response)

        setPartners(response.content)
        setCurrentPage(response.number + 1) // Spring Data는 0부터 시작하므로 +1
        setTotalPages(response.totalPages)
        setTotalItems(response.totalElements)
      } catch (error) {
        console.error('❌ Failed to load partner companies:', error)
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
    if (!isPageLoading) {
      loadPartners(1, debouncedMainSearchQuery || undefined)
    }
  }, [debouncedMainSearchQuery, loadPartners, isPageLoading])

  // DART 기업 검색
  const searchDartCompanies = useCallback(async () => {
    if (!debouncedDartSearchQuery) {
      setDartSearchResults([])
      setDialogError(null)
      return
    }

    setIsLoading(true)
    setDialogError(null)
    setDartSearchResults([])
    try {
      console.log('DART 검색 시작:', debouncedDartSearchQuery)

      const response = await searchCompaniesFromDart({
        page: 1,
        pageSize: 5,
        listedOnly: true,
        corpNameFilter: debouncedDartSearchQuery
      })

      console.log('DART 검색 응답 전체:', response)

      // Spring Data Page 응답 구조 처리
      const searchResults = response.content.map((item: any) => ({
        corp_code: item.corpCode || item.corp_code,
        corp_name: item.corpName || item.corp_name,
        stock_code: item.stockCode || item.stock_code || '',
        modify_date: item.modifyDate || item.modify_date || ''
      }))

      console.log('변환된 검색 결과:', searchResults)
      console.log('검색 결과 개수:', response.totalElements)

      setDartSearchResults(searchResults)

      if (searchResults.length === 0) {
        setDialogError(`'${debouncedDartSearchQuery}'에 대한 검색 결과가 없습니다.`)
      } else {
        setDialogError(null) // 결과가 있으면 에러 메시지 제거
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

  // DART 검색어 변경 시 검색
  useEffect(() => {
    if (debouncedDartSearchQuery && (isAddDialogOpen || isEditDialogOpen)) {
      searchDartCompanies()
    }
  }, [debouncedDartSearchQuery, isAddDialogOpen, isEditDialogOpen, searchDartCompanies])

  // DART 검색 결과에서 회사 선택
  const handleSelectDartCompany = useCallback((company: DartCorpInfo) => {
    setSelectedDartCompany(company)
    setFormData(prev => ({
      ...prev,
      companyName: company.corp_name,
      corpCode: company.corp_code,
      contractStartDate: new Date().toISOString().split('T')[0]
    }))
    setDartSearchResults([])
    setCompanySearchQuery('')
    setDialogError(null)
  }, [])

  // 모달 상태 초기화
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

  // 파트너사 추가/수정 핸들러
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
      if (isEditDialogOpen && selectedPartner?.id) {
        // 수정 모드 - 변경된 타입에 맞게 수정
        await updatePartnerCompany(selectedPartner.id, {
          corpName: formData.companyName,
          corpCode: formData.corpCode,
          contractStartDate: new Date(formData.contractStartDate),
          status: formData.status
        })
        toast({title: '성공', description: '파트너사가 수정되었습니다.'})
      } else {
        // 추가 모드
        await createPartnerCompany({
          companyName: formData.companyName,
          corpCode: formData.corpCode,
          contractStartDate: formData.contractStartDate
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

  // 파트너사 삭제 핸들러
  const handleDeletePartner = useCallback(async () => {
    if (!selectedPartner?.id) return

    setIsSubmitting(true)
    try {
      await deletePartnerCompany(selectedPartner.id)
      toast({title: '성공', description: '파트너사가 삭제되었습니다.'})
      setIsDeleteDialogOpen(false)
      setSelectedPartner(null)
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

  // 페이지 이동 핸들러
  const handlePageChange = useCallback(
    (page: number) => {
      console.log('🔍 handlePageChange 호출됨:', {page, currentPage, totalPages})

      // 강화된 페이지 값 검증
      let validPage = 1

      if (page === null || page === undefined) {
        console.warn('⚠️ handlePageChange: page가 null/undefined')
        return
      }

      const pageNum = Number(page)
      if (isNaN(pageNum) || !isFinite(pageNum)) {
        console.warn('⚠️ handlePageChange: 잘못된 페이지 번호:', page)
        return
      }

      validPage = Math.max(1, Math.floor(pageNum))

      // 범위 검증
      if (validPage < 1 || validPage > totalPages || validPage === currentPage) {
        console.log('🚫 페이지 변경 건너뜀:', {validPage, currentPage, totalPages})
        return
      }

      console.log('✅ 페이지 변경 실행:', validPage)
      loadPartners(validPage, debouncedMainSearchQuery || undefined)
    },
    [totalPages, currentPage, debouncedMainSearchQuery, loadPartners]
  )

  // 수정 다이얼로그 열기 핸들러 - 변경된 타입에 맞게 수정
  const openEditDialog = (partner: PartnerCompany) => {
    setSelectedPartner(partner)

    let finalStatus: PartnerCompany['status'] = 'ACTIVE'
    const validStatuses: Array<PartnerCompany['status']> = [
      'ACTIVE',
      'INACTIVE',
      'PENDING'
    ]
    if (partner.status && validStatuses.includes(partner.status)) {
      finalStatus = partner.status
    }

    setFormData({
      id: partner.id || '',
      companyName: partner.corpName,
      corpCode: partner.corpCode,
      contractStartDate: partner.contractStartDate
        ? partner.contractStartDate.toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      status: finalStatus
    })
    setCompanySearchQuery(partner.corpName)
    setSelectedDartCompany({
      corp_code: partner.corpCode,
      corp_name: partner.corpName,
      stock_code: partner.stockCode,
      modify_date: partner.modifyDate || ''
    })
    setIsEditDialogOpen(true)
  }

  // 추가 다이얼로그 열기 핸들러
  const openAddDialog = () => {
    resetModalStateAndClose()
    setIsAddDialogOpen(true)
  }

  // 로딩 UI
  if (isPageLoading && partners.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-customG" />
          <p className="text-lg font-medium text-gray-600">
            파트너사 정보를 불러오는 중...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full min-h-screen p-4 md:p-8 bg-gray-50">
      {/* 브레드크럼 */}
      <Card className="mb-6 border-0 shadow-sm">
        <CardContent className="flex flex-row items-center p-4 text-sm text-gray-600">
          <Home className="w-4 h-4 mr-2" />
          <span>협력사 관리</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="font-medium text-customG">파트너사 관리</span>
        </CardContent>
      </Card>

      {/* 페이지 헤더 */}
      <div className="mb-8">
        <PageHeader
          icon={<Building2 className="w-8 h-8" />}
          title="파트너사 관리"
          description="DART 정보 기반으로 파트너사를 등록하고 관리합니다."
          module="CSDD"
        />
      </div>

      {/* 메인 컨텐츠 */}
      <Card className="flex-1 border-0 shadow-sm">
        <CardContent className="p-6">
          {/* 상단 검색 및 추가 버튼 */}
          <div className="flex flex-col items-center justify-between gap-4 mb-6 md:flex-row">
            <div className="relative w-full md:w-96">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                placeholder="파트너사명으로 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 border-gray-200 h-11 focus:border-customG"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery('')}
                  className="absolute w-8 h-8 transform -translate-y-1/2 right-2 top-1/2 hover:bg-gray-100">
                  <X className="w-4 h-4 text-gray-400" />
                </Button>
              )}
            </div>

            <Button
              onClick={openAddDialog}
              className="px-6 shadow-sm bg-customG hover:bg-customGDark h-11">
              <Plus className="w-4 h-4 mr-2" />
              파트너사 추가
            </Button>
          </div>

          {/* 통계 정보 */}
          {!isLoading && totalItems > 0 && (
            <div className="flex items-center gap-4 p-4 mb-6 rounded-lg bg-gray-50">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-customG" />
                <span className="text-sm font-medium text-gray-700">
                  총 <span className="font-bold text-customG">{totalItems}</span>개
                  파트너사
                </span>
              </div>
              {searchQuery && (
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    '{searchQuery}' 검색 결과{' '}
                    <span className="font-medium">{partners.length}</span>개
                  </span>
                </div>
              )}
            </div>
          )}

          {/* 다이얼로그 */}
          <Dialog
            open={isAddDialogOpen || isEditDialogOpen}
            onOpenChange={open => {
              if (!open) resetModalStateAndClose()
            }}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-customG" />
                  {isEditDialogOpen ? '파트너사 수정' : '파트너사 추가'}
                </DialogTitle>
              </DialogHeader>

              <div className="py-4 space-y-6">
                {/* DART 검색 */}
                <div className="space-y-3">
                  <Label htmlFor="companySearch" className="text-sm font-medium">
                    회사 검색 (DART)
                  </Label>
                  <div className="relative">
                    <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                    <Input
                      id="companySearch"
                      placeholder="회사명을 입력하여 검색"
                      value={companySearchQuery}
                      onChange={e => setCompanySearchQuery(e.target.value)}
                      className="pl-10 border-gray-200 h-11 focus:border-customG"
                      disabled={isSubmitting}
                    />
                    {isLoading && companySearchQuery && (
                      <Loader2 className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 right-3 top-1/2 animate-spin" />
                    )}
                  </div>

                  {/* DART 검색 결과 */}
                  {dartSearchResults.length > 0 && (
                    <div className="overflow-y-auto border rounded-lg shadow-sm max-h-60">
                      {dartSearchResults.map(company => (
                        <button
                          key={company.corp_code}
                          type="button"
                          className={`w-full p-4 hover:bg-gray-50 border-b last:border-b-0 transition-colors duration-150 flex justify-between items-center text-left ${
                            selectedDartCompany?.corp_code === company.corp_code
                              ? 'bg-customG/5 border-customG/20'
                              : ''
                          }`}
                          onClick={() => handleSelectDartCompany(company)}
                          disabled={isSubmitting}>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">
                              {company.corp_name}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded">
                                {company.corp_code}
                              </span>
                              {company.stock_code && company.stock_code.trim() && (
                                <span className="px-2 py-1 text-xs text-blue-600 rounded bg-blue-50">
                                  {company.stock_code}
                                </span>
                              )}
                            </div>
                          </div>
                          {selectedDartCompany?.corp_code === company.corp_code && (
                            <Check className="flex-shrink-0 w-5 h-5 text-customG" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 검색 결과 없음 메시지 */}
                  {dialogError &&
                    dartSearchResults.length === 0 &&
                    companySearchQuery &&
                    !isLoading && (
                      <div className="flex items-center gap-2 p-3 text-sm border rounded-lg text-amber-700 bg-amber-50 border-amber-200">
                        <AlertTriangle className="flex-shrink-0 w-4 h-4" />
                        {dialogError}
                      </div>
                    )}
                </div>

                {/* 선택된 회사 정보 표시 */}
                {selectedDartCompany && (
                  <div className="p-4 border rounded-lg bg-customG/5 border-customG/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Check className="w-4 h-4 text-customG" />
                      <span className="text-sm font-medium text-customG">
                        선택된 회사
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {selectedDartCompany.corp_name}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      DART 코드: {selectedDartCompany.corp_code}
                      {selectedDartCompany.stock_code &&
                        selectedDartCompany.stock_code.trim() &&
                        ` | 주식코드: ${selectedDartCompany.stock_code}`}
                    </p>
                  </div>
                )}

                {/* 수정 모드에서만 보이는 추가 필드들 */}
                {isEditDialogOpen && (
                  <>
                    <div className="space-y-3">
                      <Label htmlFor="companyName" className="text-sm font-medium">
                        회사명
                      </Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={e =>
                          setFormData({...formData, companyName: e.target.value})
                        }
                        placeholder="파트너사 회사명"
                        className="border-gray-200 h-11 focus:border-customG"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="corpCode" className="text-sm font-medium">
                        DART 코드
                      </Label>
                      <Input
                        id="corpCode"
                        value={formData.corpCode}
                        onChange={e =>
                          setFormData({...formData, corpCode: e.target.value})
                        }
                        placeholder="DART 고유번호 (8자리)"
                        maxLength={8}
                        className="border-gray-200 h-11 focus:border-customG"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="contractStartDate"
                        className="flex items-center gap-2 text-sm font-medium">
                        <Calendar className="w-4 h-4" />
                        계약 시작일
                      </Label>
                      <Input
                        id="contractStartDate"
                        type="date"
                        value={formData.contractStartDate}
                        onChange={e =>
                          setFormData({...formData, contractStartDate: e.target.value})
                        }
                        className="border-gray-200 h-11 focus:border-customG"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="status" className="text-sm font-medium">
                        상태
                      </Label>
                      <select
                        id="status"
                        value={formData.status || ''}
                        onChange={e => {
                          const selectedValue = e.target.value
                          if (
                            selectedValue === 'ACTIVE' ||
                            selectedValue === 'INACTIVE' ||
                            selectedValue === 'PENDING'
                          ) {
                            setFormData({...formData, status: selectedValue})
                          }
                        }}
                        className="block w-full px-3 py-2 text-base border border-gray-200 rounded-md h-11 focus:outline-none focus:ring-2 focus:ring-customG focus:border-customG disabled:bg-gray-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}>
                        <option value="ACTIVE">활성</option>
                        <option value="INACTIVE">비활성</option>
                        <option value="PENDING">보류</option>
                      </select>
                    </div>
                  </>
                )}

                {/* 일반 에러 메시지 */}
                {dialogError && !companySearchQuery && (
                  <div className="flex items-center gap-2 p-3 text-sm text-red-700 border border-red-200 rounded-lg bg-red-50">
                    <AlertTriangle className="flex-shrink-0 w-4 h-4" />
                    {dialogError}
                  </div>
                )}
              </div>

              <DialogFooter className="gap-3">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetModalStateAndClose}
                    disabled={isSubmitting}
                    className="h-11">
                    취소
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  onClick={handleSubmitPartner}
                  disabled={
                    isSubmitting ||
                    (isAddDialogOpen && !selectedDartCompany) ||
                    (isEditDialogOpen &&
                      (!formData.companyName ||
                        !formData.corpCode ||
                        !formData.contractStartDate))
                  }
                  className="px-6 bg-customG hover:bg-customGDark h-11">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      처리 중...
                    </>
                  ) : isEditDialogOpen ? (
                    '저장'
                  ) : (
                    '추가'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 컨텐츠 영역 */}
          {isLoading && partners.length === 0 && !isPageLoading ? (
            <div className="flex flex-col items-center justify-center p-16">
              <Loader2 className="w-10 h-10 mb-4 animate-spin text-customG" />
              <p className="font-medium text-gray-600">파트너사 목록을 불러오는 중...</p>
            </div>
          ) : partners.length === 0 && !searchQuery ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                등록된 파트너사가 없습니다
              </h3>
              <p className="max-w-md mb-6 text-gray-600">
                DART 정보를 기반으로 파트너사를 등록하여 관리를 시작하세요.
              </p>
              <Button
                onClick={openAddDialog}
                className="px-6 bg-customG hover:bg-customGDark h-11">
                <Plus className="w-4 h-4 mr-2" />첫 파트너사 추가하기
              </Button>
            </div>
          ) : partners.length === 0 && searchQuery ? (
            <div className="flex flex-col items-center justify-center p-16 text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-600">
                '<span className="font-semibold text-customG">{searchQuery}</span>'에 대한
                검색 결과가 없습니다.
              </p>
            </div>
          ) : (
            <>
              {/* 테이블 */}
              <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold text-gray-700">
                        회사명
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        DART 코드
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        상장 정보
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">
                        계약 시작일
                      </TableHead>
                      <TableHead className="font-semibold text-gray-700">상태</TableHead>
                      <TableHead className="font-semibold text-right text-gray-700">
                        관리
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {partners.map(partner => (
                      <TableRow
                        key={partner.id}
                        className="transition-colors hover:bg-gray-50">
                        <TableCell className="py-4 font-medium text-gray-900">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            {partner.corpName}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <code className="px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded">
                            {partner.corpCode}
                          </code>
                        </TableCell>
                        <TableCell className="py-4">
                          {partner.stockCode ? (
                            <Badge
                              variant="outline"
                              className="text-blue-700 border-blue-300 bg-blue-50 hover:bg-blue-100">
                              {partner.stockCode} (상장)
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="text-gray-600 bg-gray-100">
                              비상장
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {partner.contractStartDate
                              ? partner.contractStartDate.toLocaleDateString('ko-KR')
                              : '-'}
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          <StatusBadge status={partner.status} />
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-8 h-8 hover:bg-gray-100">
                                <MoreHorizontal className="w-4 h-4" />
                                <span className="sr-only">메뉴 열기</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={() => openEditDialog(partner)}
                                className="cursor-pointer">
                                <Edit3 className="w-4 h-4 mr-2" />
                                수정
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedPartner(partner)
                                  setIsDeleteDialogOpen(true)
                                }}
                                className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50">
                                <Trash className="w-4 h-4 mr-2" />
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

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 mt-8 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 h-9">
                    이전
                  </Button>

                  {Array.from({length: totalPages}, (_, i) => i + 1).map(
                    page =>
                      (page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)) && (
                        <Button
                          key={page}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className={`w-9 h-9 ${
                            currentPage === page
                              ? 'bg-customG hover:bg-customGDark text-white'
                              : ''
                          }`}>
                          {page}
                        </Button>
                      )
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 h-9">
                    다음
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              파트너사 삭제 확인
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              정말로{' '}
              <span className="font-semibold text-gray-900">
                {selectedPartner?.corpName}
              </span>{' '}
              파트너사를 삭제하시겠습니까?
              <br />
              <span className="font-medium text-red-600">
                이 작업은 되돌릴 수 없습니다.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel
              onClick={() => setSelectedPartner(null)}
              disabled={isSubmitting}
              className="h-10">
              취소
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePartner}
              className="h-10 text-white bg-red-600 hover:bg-red-700 focus-visible:ring-red-500"
              disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash className="w-4 h-4 mr-2" />
              )}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
