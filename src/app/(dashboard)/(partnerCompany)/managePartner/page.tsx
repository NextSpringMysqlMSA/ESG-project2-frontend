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
  Edit3 
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
  DartCorpInfo
} from '@/services/partnerCompany'
import { 
  fetchPartnerCompanies, 
  createPartnerCompany, 
  deletePartnerCompany, 
  updatePartnerCompany,
  searchCompaniesFromDart
} from '@/services/partnerCompany'

// 디바운스 훅: 검색 최적화를 위함
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
  
  // 상태 관리
  const [partners, setPartners] = useState<PartnerCompany[]>([])
  const [isLoading, setIsLoading] = useState(false)
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
  
  // 추가 다이얼로그 상태
  const [companySearchQuery, setCompanySearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<DartCorpInfo[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [newPartnerData, setNewPartnerData] = useState({
    companyName: '',
    corpCode: '',
    contractStartDate: new Date().toISOString().split('T')[0]
  })
  
  // 디바운스된 검색어
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const debouncedCompanySearchQuery = useDebounce(companySearchQuery, 500)
  
  // 파트너사 목록 로드 (페이징 및 검색 지원)
  const loadPartners = useCallback(async (page: number, companyNameFilter?: string) => {
    try {
      setIsLoading(true)
      const response = await fetchPartnerCompanies(page, pageSize, companyNameFilter)
      
      setPartners(response.data)
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
  
  // 페이지 로드 시 파트너사 목록 조회
  useEffect(() => {
    const loadInitialPartners = async () => {
      try {
        setIsLoading(true)
        await loadPartners(1)
      } catch (error) {
        console.error('Failed to load partner companies:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadInitialPartners()
  }, [loadPartners])
  
  // 검색어 변경 시 파트너사 목록 재조회
  useEffect(() => {
    if (debouncedSearchQuery) {
      loadPartners(1, debouncedSearchQuery)
    } else {
      loadPartners(1)
    }
  }, [debouncedSearchQuery, loadPartners])
  
  // DART 기업 검색
  const searchDartCompanies = useCallback(async () => {
    if (!debouncedCompanySearchQuery) {
      setSearchResults([])
      return
    }
    
    try {
      setIsSearching(true)
      const response = await searchCompaniesFromDart({
        page: 1,
        pageSize: 5,
        listedOnly: true,
        corpNameFilter: debouncedCompanySearchQuery
      })
      
      setSearchResults(response.data as DartCorpInfo[])
    } catch (error) {
      console.error('Failed to search companies from DART:', error)
      toast({
        variant: 'destructive',
        title: '오류',
        description: 'DART 기업 검색에 실패했습니다.',
      })
    } finally {
      setIsSearching(false)
    }
  }, [debouncedCompanySearchQuery, toast])
  
  // 회사 검색어 변경 시 DART 검색
  useEffect(() => {
    if (debouncedCompanySearchQuery && isAddDialogOpen) {
      searchDartCompanies()
    }
  }, [debouncedCompanySearchQuery, isAddDialogOpen, searchDartCompanies])
  
  // 파트너사 선택 핸들러
  const handleSelectCompany = useCallback((company: DartCorpInfo) => {
    setNewPartnerData({
      ...newPartnerData,
      companyName: company.corp_name,
      corpCode: company.corp_code
    })
    setSearchResults([])
    setCompanySearchQuery('')
  }, [newPartnerData])
  
  // 파트너사 추가 핸들러
  const handleAddPartner = useCallback(async () => {
    try {
      if (!newPartnerData.companyName || !newPartnerData.corpCode || !newPartnerData.contractStartDate) {
        toast({
          variant: 'destructive',
          title: '입력 오류',
          description: '모든 필드를 입력해주세요.',
        })
        return
      }
      
      setIsLoading(true)
      await createPartnerCompany({
        companyName: newPartnerData.companyName,
        corpCode: newPartnerData.corpCode,
        contractStartDate: newPartnerData.contractStartDate
      })
      
      toast({
        title: '성공',
        description: '파트너사가 추가되었습니다.',
      })
      
      setIsAddDialogOpen(false)
      resetModalState()
      await loadPartners(currentPage, debouncedSearchQuery || undefined)
    } catch (error) {
      console.error('Failed to add partner company:', error)
      toast({
        variant: 'destructive',
        title: '오류',
        description: '파트너사 추가에 실패했습니다.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [newPartnerData, toast, currentPage, debouncedSearchQuery, loadPartners])
  
  // 파트너사 삭제 핸들러
  const handleDeletePartner = useCallback(async (partnerId: string) => {
    try {
      setIsLoading(true)
      await deletePartnerCompany(partnerId)
      
      toast({
        title: '성공',
        description: '파트너사가 삭제되었습니다.',
      })
      
      setIsDeleteDialogOpen(false)
      setSelectedPartner(null)
      await loadPartners(currentPage, debouncedSearchQuery || undefined)
    } catch (error) {
      console.error('Failed to delete partner company:', error)
      toast({
        variant: 'destructive',
        title: '오류',
        description: '파트너사 삭제에 실패했습니다.',
      })
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, debouncedSearchQuery, loadPartners, toast])
  
  // 모달 상태 초기화
  const resetModalState = useCallback(() => {
    setNewPartnerData({
      companyName: '',
      corpCode: '',
      contractStartDate: new Date().toISOString().split('T')[0]
    })
    setCompanySearchQuery('')
    setSearchResults([])
  }, [])
  
  // 페이지 이동 핸들러
  const handlePageChange = useCallback((page: number) => {
    if (page < 1 || page > totalPages) return
    loadPartners(page, debouncedSearchQuery || undefined)
  }, [totalPages, debouncedSearchQuery, loadPartners])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={<Building2 className="h-8 w-8" />}
        title="파트너사 관리"
        description="파트너사를 등록하고 관리합니다."
        module="CSDD"
      />
      
      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="파트너사 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              resetModalState()
              setIsAddDialogOpen(true)
            }}>
              <Plus className="mr-2 h-4 w-4" />
              파트너사 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>파트너사 추가</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="companySearch" className="text-right">
                  회사 검색
                </Label>
                <div className="relative mt-1">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="companySearch"
                    placeholder="회사명 검색..."
                    value={companySearchQuery}
                    onChange={(e) => setCompanySearchQuery(e.target.value)}
                    className="pl-8"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                
                {searchResults.length > 0 && (
                  <div className="mt-2 border rounded-md overflow-hidden">
                    <ul className="divide-y">
                      {searchResults.map((company) => (
                        <button
                          key={company.corp_code}
                          type="button"
                          className="w-full p-2 hover:bg-slate-50 cursor-pointer flex justify-between items-center text-left"
                          onClick={() => handleSelectCompany(company)}
                        >
                          <div>
                            <p className="font-medium">{company.corp_name}</p>
                            <p className="text-xs text-muted-foreground">
                              {company.stock_code ? `주식코드: ${company.stock_code}` : '비상장'}
                            </p>
                          </div>
                          <span className="flex-shrink-0">
                            <Check className="h-4 w-4" />
                          </span>
                        </button>
                      ))}
                    </ul>
                  </div>
                )}
                
                {debouncedCompanySearchQuery && searchResults.length === 0 && !isSearching && (
                  <p className="mt-2 text-sm text-muted-foreground flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                    검색 결과가 없습니다.
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="companyName" className="text-right">
                  회사명
                </Label>
                <Input
                  id="companyName"
                  value={newPartnerData.companyName}
                  onChange={(e) => setNewPartnerData({...newPartnerData, companyName: e.target.value})}
                  className="mt-1"
                  placeholder="회사명"
                />
              </div>
              
              <div>
                <Label htmlFor="corpCode" className="text-right">
                  DART 코드
                </Label>
                <Input
                  id="corpCode"
                  value={newPartnerData.corpCode}
                  onChange={(e) => setNewPartnerData({...newPartnerData, corpCode: e.target.value})}
                  className="mt-1"
                  placeholder="DART 코드 (8자리)"
                />
              </div>
              
              <div>
                <Label htmlFor="contractStartDate" className="text-right">
                  계약 시작일
                </Label>
                <Input
                  id="contractStartDate"
                  type="date"
                  value={newPartnerData.contractStartDate}
                  onChange={(e) => setNewPartnerData({...newPartnerData, contractStartDate: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  취소
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleAddPartner}
                disabled={isLoading || !newPartnerData.companyName || !newPartnerData.corpCode}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    처리 중...
                  </>
                ) : (
                  '추가'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading && partners.length === 0 ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>회사명</TableHead>
                  <TableHead>DART 코드</TableHead>
                  <TableHead>상장 여부</TableHead>
                  <TableHead>계약 시작일</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {partners.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                      {searchQuery ? '검색 결과가 없습니다.' : '등록된 파트너사가 없습니다.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  partners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">{partner.corp_name}</TableCell>
                      <TableCell>{partner.corp_code}</TableCell>
                      <TableCell>
                        {partner.stock_code ? (
                          <Badge variant="default" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                            {partner.stock_code}
                          </Badge>
                        ) : (
                          <Badge variant="outline">비상장</Badge>
                        )}
                      </TableCell>
                      <TableCell>{partner.contract_start_date}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            partner.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-800 hover:bg-green-100'
                              : 'bg-red-100 text-red-800 hover:bg-red-100'
                          }
                        >
                          {partner.status === 'ACTIVE' ? '활성' : '비활성'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">메뉴 열기</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPartner(partner)
                                setIsEditDialogOpen(true)
                              }}
                            >
                              <Edit3 className="mr-2 h-4 w-4" />
                              <span>수정</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedPartner(partner)
                                setIsDeleteDialogOpen(true)
                              }}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              <span>삭제</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8"
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </Button>
            </div>
          )}
        </>
      )}
      
      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>파트너사 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPartner?.corp_name} 파트너사를 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedPartner?.id && handleDeletePartner(selectedPartner.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                '삭제'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* 수정 다이얼로그 구현은 생략 (파트너사 추가와 유사하게 구현) */}
    </div>
  )
}
