'use client'

import React, {useState, useEffect} from 'react'
import {
  ChevronRight,
  Home,
  Building2,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronsDown,
  ChevronsUp,
  FileSearch,
  Check,
  ChevronsUpDown,
  RefreshCcw
} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import {PageHeader} from '@/components/layout/PageHeader'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {cn} from '@/lib/utils'
import {useToast} from '@/hooks/use-toast'
import {LoadingState} from '@/components/ui/loading-state'
import {
  fetchUniquePartnerCompanyNames,
  fetchFinancialRiskAssessment,
  fetchPartnerCompanies
} from '@/services/partnerCompany'
import {FinancialRiskAssessment} from '@/types/IFRS/partnerCompany'

// API 응답 타입 정의
interface RiskItem {
  description: string
  actualValue: string
  threshold: string
  notes: string | null
  itemNumber: number
  atRisk: boolean
}

interface FinancialRiskData {
  partnerCompanyId: string
  partnerCompanyName: string
  assessmentYear: string
  reportCode: string
  riskItems: RiskItem[]
}

// 협력사 데이터는 이제 API에서 동적으로 가져옵니다.
// const partners = [...] 제거됨

// 상태 레이블 유틸리티 함수
function getStatusLabel(atRiskCount: number) {
  if (atRiskCount === 0) {
    return {
      label: '안전',
      color: 'text-emerald-600',
      icon: <CheckCircle className="w-5 h-5 text-emerald-500" />
    }
  }
  if (atRiskCount <= 2) {
    return {
      label: '주의',
      color: 'text-amber-600',
      icon: <Info className="w-5 h-5 text-amber-500" />
    }
  }
  return {
    label: '위험',
    color: 'text-red-600',
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />
  }
}

// PartnerCombobox의 props 타입 수정
interface PartnerComboboxProps {
  options: Array<{name: string; code: string}>
  value: string | null // 선택된 협력사의 DART 코드
  onChange: (code: string) => void
}

function PartnerCombobox({options, value, onChange}: PartnerComboboxProps) {
  const [open, setOpen] = useState(false)
  const selectedOption = options.find(option => option.code === value)

  console.log('PartnerCombobox 렌더링:', {
    optionsLength: options.length,
    options: options,
    selectedValue: value,
    selectedOption: selectedOption
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full font-medium transition-all duration-200 border-2 h-11 bg-slate-50 border-slate-200 hover:border-customG hover:bg-white rounded-xl">
          {selectedOption ? (
            <span className="text-slate-800">{selectedOption.name}</span>
          ) : (
            <span className="text-slate-400">협력사를 선택해주세요...</span>
          )}
          <ChevronsUpDown className="w-4 h-4 ml-2 text-slate-400 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 bg-white border-2 shadow-xl border-slate-200 rounded-xl"
        style={{minWidth: 'var(--radix-popover-trigger-width)'}}>
        <Command className="rounded-xl">
          <CommandInput
            placeholder="협력사 검색..."
            className="h-12 border-0 border-b border-slate-100 rounded-t-xl"
          />
          <CommandList className="max-h-64">
            <CommandEmpty className="py-8 text-center text-slate-500">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              해당하는 협력사가 없습니다.
            </CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.code}
                  value={option.name}
                  onSelect={() => {
                    onChange(option.code)
                    setOpen(false)
                  }}
                  className="flex items-center px-4 py-3 mx-2 my-1 transition-colors rounded-lg cursor-pointer hover:bg-customG/5">
                  <Check
                    className={cn(
                      'mr-3 h-4 w-4 text-customG',
                      value === option.code ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-800">{option.name}</span>
                    <span className="font-mono text-xs text-slate-500">
                      코드: {option.code}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default function FinancialRiskForm() {
  const {toast} = useToast()

  // 상태 관리
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [partnerOptions, setPartnerOptions] = useState<
    Array<{name: string; code: string}>
  >([])
  const [selectedPartnerCode, setSelectedPartnerCode] = useState<string | null>(null)
  const [selectedPartnerName, setSelectedPartnerName] = useState<string | null>(null)
  const [riskData, setRiskData] = useState<FinancialRiskAssessment | null>(null)
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  // 확장/축소 토글 함수
  const toggleExpand = (itemNumber: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(itemNumber)) {
        newSet.delete(itemNumber)
      } else {
        newSet.add(itemNumber)
      }
      return newSet
    })
  }

  // 모든 항목 확장/축소 함수
  const toggleAllExpanded = (expand: boolean) => {
    if (riskData?.riskItems) {
      if (expand) {
        const allNumbers = new Set(riskData.riskItems.map(item => item.itemNumber))
        setExpandedItems(allNumbers)
      } else {
        setExpandedItems(new Set())
      }
    }
  }

  // 초기 데이터 로드
  useEffect(() => {
    loadPartnerOptions()
  }, [])

  // 파트너사 옵션 로드
  const loadPartnerOptions = async () => {
    try {
      setIsLoading(true)

      // 실제 파트너사 목록을 가져옵니다 (페이지네이션 포함)
      // 모든 파트너사를 가져오기 위해 큰 페이지 사이즈 사용
      const response = await fetchPartnerCompanies(1, 100)
      console.log('파트너사 목록 응답:', response)

      // 페이지네이션 응답 구조 처리
      let partnerData: any[] = []

      // response.data가 있는 경우 (기존 구조)
      if (response && response.data && Array.isArray(response.data)) {
        partnerData = response.data
      }
      // response.content가 있는 경우 (페이지네이션 구조)
      else if (
        response &&
        (response as any).content &&
        Array.isArray((response as any).content)
      ) {
        partnerData = (response as any).content
      }
      // response 자체가 배열인 경우
      else if (Array.isArray(response)) {
        partnerData = response
      }

      if (partnerData.length > 0) {
        // 파트너사 데이터를 옵션 형식으로 변환
        const options = partnerData.map((partner: any) => ({
          name: partner.corpName || partner.companyName, // 회사명 (여러 필드명 대응)
          code: partner.corpCode || partner.corp_code // DART 기업 코드 (여러 필드명 대응)
        }))

        console.log('변환된 파트너사 옵션:', options)
        console.log(
          '삼성전자 존재 여부:',
          options.find(opt => opt.name.includes('삼성'))
        )
        setPartnerOptions(options)
      } else {
        console.warn('파트너사 데이터가 없습니다. 응답 구조:', response)
        setPartnerOptions([])
      }
    } catch (err) {
      console.error('Failed to load partner options:', err)
      setError('파트너사 목록을 불러오는데 실패했습니다.')
      toast({
        variant: 'destructive',
        title: '오류',
        description: '파트너사 목록을 불러오는데 실패했습니다.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 파트너사 선택 시 핸들러
  const handlePartnerSelect = async (code: string) => {
    setSelectedPartnerCode(code)

    // 선택된 파트너사의 이름 찾기
    const selectedOption = partnerOptions.find(opt => opt.code === code)
    if (selectedOption) {
      setSelectedPartnerName(selectedOption.name)
    }

    try {
      setIsLoading(true)
      setError(null)
      setRiskData(null)

      // 재무 위험 분석 데이터 가져오기 - corpCode와 회사명 사용
      console.log('재무 위험 분석 요청:', {
        corpCode: code,
        companyName: selectedOption?.name
      })
      const data = await fetchFinancialRiskAssessment(code, selectedOption?.name)
      setRiskData(data)

      // 항목 확장 상태 초기화
      setExpandedItems(new Set())
    } catch (err) {
      console.error('Failed to load financial risk data:', err)
      setError('재무 위험 데이터를 불러오는데 실패했습니다.')
      toast({
        variant: 'destructive',
        title: '오류',
        description: '재무 위험 데이터를 불러오는데 실패했습니다.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 위험 항목 수 계산
  const atRiskCount = riskData?.riskItems?.filter(item => item.atRisk).length || 0
  const statusInfo = getStatusLabel(atRiskCount)

  return (
    <div className="flex flex-col w-full h-full min-h-screen p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Enhanced Breadcrumb */}
      <div className="flex flex-row items-center p-4 px-6 mb-8 text-sm border shadow-lg text-slate-600 bg-white/80 backdrop-blur-sm rounded-2xl border-slate-200/50">
        <div className="flex items-center justify-center w-8 h-8 mr-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
          <Home className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-slate-700">협력사 관리</span>
        <ChevronRight className="w-4 h-4 mx-3 text-slate-400" />
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>
          <span className="font-bold text-customG">재무제표 리스크 관리</span>
        </div>
      </div>

      {/* Enhanced Page Header */}
      <div className="mb-8">
        <PageHeader
          icon={<Building2 className="w-8 h-8" />}
          title="협력사 재무 위험 분석"
          description="파트너사의 재무 건전성과 위험을 실시간으로 분석합니다."
          module="CSDD"
        />
      </div>

      {/* Enhanced Selection Panel */}
      <div className="relative p-8 mt-2 overflow-hidden border shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl border-slate-200/50">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-100/50"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 -translate-x-12 translate-y-12 rounded-full bg-gradient-to-tr from-emerald-100/50 to-teal-100/50"></div>

        <div className="relative z-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-1 max-w-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                  <FileSearch className="w-5 h-5 text-white" />
                </div>
                <div>
                  <label className="block mb-1 text-lg font-bold text-slate-800">
                    분석할 파트너사 선택
                  </label>
                  <p className="text-sm text-slate-500">
                    재무 위험도를 분석할 협력사를 선택해주세요
                  </p>
                </div>
              </div>
              <PartnerCombobox
                options={partnerOptions}
                value={selectedPartnerCode}
                onChange={handlePartnerSelect}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsLoading(true)
                loadPartnerOptions().finally(() => setIsLoading(false))
              }}
              disabled={isLoading}
              className="h-12 px-8 font-semibold transition-all duration-300 border-2 border-slate-200 hover:border-customG hover:bg-customG/5 hover:shadow-lg rounded-2xl bg-white/80 backdrop-blur-sm">
              <RefreshCcw className={`w-5 h-5 mr-3 ${isLoading ? 'animate-spin' : ''}`} />
              <span>데이터 새로고침</span>
            </Button>
          </div>
        </div>
      </div>

      <LoadingState isLoading={isLoading} error={error} isEmpty={!riskData}>
        {riskData && (
          <div className="mt-12 space-y-10">
            {/* Enhanced Status Cards */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Company Info Card */}
              <Card className="relative overflow-hidden transition-all duration-300 border-2 shadow-xl bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-3xl hover:shadow-2xl group">
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 group-hover:opacity-100"></div>
                <CardHeader className="relative z-10 pb-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-t-3xl">
                  <CardTitle className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    파트너사 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-6">
                  <div className="mb-3 text-2xl font-bold transition-colors text-slate-800 group-hover:text-blue-700">
                    {riskData.partnerCompanyName}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <p className="px-4 py-2 font-mono text-sm font-medium text-slate-600 bg-slate-100/80 rounded-xl">
                      ID: {riskData.partnerCompanyId}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Assessment Info Card */}
              <Card className="relative overflow-hidden transition-all duration-300 border-2 shadow-xl bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-3xl hover:shadow-2xl group">
                <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-emerald-50/80 to-teal-50/80 group-hover:opacity-100"></div>
                <CardHeader className="relative z-10 pb-4 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-t-3xl">
                  <CardTitle className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl">
                      <FileSearch className="w-4 h-4 text-white" />
                    </div>
                    분석 기준
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-6">
                  <div className="mb-3 text-2xl font-bold transition-colors text-slate-800 group-hover:text-emerald-700">
                    {riskData.assessmentYear}년도
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                    <p className="px-4 py-2 font-mono text-sm font-medium text-slate-600 bg-slate-100/80 rounded-xl">
                      보고서: {riskData.reportCode}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Risk Status Card */}
              <Card
                className={`bg-white/90 backdrop-blur-sm border-2 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative ${
                  atRiskCount === 0
                    ? 'border-emerald-200/50'
                    : atRiskCount <= 2
                    ? 'border-amber-200/50'
                    : 'border-red-200/50'
                }`}>
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    atRiskCount === 0
                      ? 'bg-gradient-to-br from-emerald-50/80 to-green-50/80'
                      : atRiskCount <= 2
                      ? 'bg-gradient-to-br from-amber-50/80 to-yellow-50/80'
                      : 'bg-gradient-to-br from-red-50/80 to-pink-50/80'
                  }`}></div>
                <CardHeader
                  className={`pb-4 rounded-t-3xl relative z-10 ${
                    atRiskCount === 0
                      ? 'bg-gradient-to-br from-emerald-50 to-green-100'
                      : atRiskCount <= 2
                      ? 'bg-gradient-to-br from-amber-50 to-yellow-100'
                      : 'bg-gradient-to-br from-red-50 to-pink-100'
                  }`}>
                  <CardTitle className="flex items-center gap-3 text-sm font-bold text-slate-700">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-xl ${
                        atRiskCount === 0
                          ? 'bg-gradient-to-r from-emerald-500 to-green-500'
                          : atRiskCount <= 2
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                          : 'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}>
                      {React.cloneElement(statusInfo.icon, {
                        className: 'w-4 h-4 text-white'
                      })}
                    </div>
                    재무 위험 상태
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10 pt-6">
                  <div
                    className={`text-2xl font-bold mb-3 transition-colors ${
                      statusInfo.color
                    } ${
                      atRiskCount === 0
                        ? 'group-hover:text-emerald-700'
                        : atRiskCount <= 2
                        ? 'group-hover:text-amber-700'
                        : 'group-hover:text-red-700'
                    }`}>
                    {statusInfo.label}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        atRiskCount === 0
                          ? 'bg-emerald-400'
                          : atRiskCount <= 2
                          ? 'bg-amber-400'
                          : 'bg-red-400'
                      }`}></div>
                    <p className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100/80 rounded-xl">
                      위험 항목: <span className="font-bold">{atRiskCount}</span> /{' '}
                      {riskData.riskItems.length} 개
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Control Section */}
            <div className="relative p-8 overflow-hidden border-2 shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl border-slate-200/50">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 translate-x-10 -translate-y-10 rounded-full bg-gradient-to-br from-amber-100/50 to-orange-100/50"></div>

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-xl font-bold text-slate-800">
                      세부 위험 분석
                    </h3>
                    <p className="text-sm text-slate-500">
                      총{' '}
                      <span className="font-semibold text-slate-700">
                        {riskData.riskItems.length}개
                      </span>{' '}
                      항목을 분석했습니다
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllExpanded(true)}
                    className="px-6 py-3 font-semibold transition-all duration-300 border-2 border-slate-200 hover:border-customG hover:bg-customG/10 hover:shadow-lg rounded-2xl">
                    <ChevronsDown className="w-4 h-4 mr-2" />
                    모두 펼치기
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAllExpanded(false)}
                    className="px-6 py-3 font-semibold transition-all duration-300 border-2 border-slate-200 hover:border-customG hover:bg-customG/10 hover:shadow-lg rounded-2xl">
                    <ChevronsUp className="w-4 h-4 mr-2" />
                    모두 접기
                  </Button>
                </div>
              </div>
            </div>

            {/* Enhanced Risk Items */}
            <div className="space-y-6">
              {riskData.riskItems.map(item => (
                <Card
                  key={item.itemNumber}
                  className={`transition-all duration-300 rounded-3xl border-2 overflow-hidden group relative ${
                    item.atRisk
                      ? 'border-red-200 bg-gradient-to-r from-red-50/80 to-pink-50/80 shadow-xl hover:shadow-2xl'
                      : 'border-slate-200 bg-white/90 backdrop-blur-sm hover:shadow-xl'
                  }`}>
                  {/* Decorative background for at-risk items */}
                  {item.atRisk && (
                    <div className="absolute top-0 right-0 w-32 h-32 translate-x-16 -translate-y-16 rounded-full bg-gradient-to-br from-red-100/30 to-pink-100/30"></div>
                  )}

                  <CardHeader
                    className="relative z-10 pb-4 transition-all duration-300 cursor-pointer hover:bg-slate-50/50 rounded-t-3xl"
                    onClick={() => toggleExpand(item.itemNumber)}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-4 text-lg font-bold">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 text-lg font-bold rounded-2xl transition-all duration-300 ${
                            item.atRisk
                              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                              : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-2 border-slate-200 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:text-blue-700'
                          }`}>
                          {item.itemNumber}
                        </div>
                        <div className="flex-1">
                          <span className="block text-slate-800">{item.description}</span>
                          {item.atRisk && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="px-4 py-2 text-xs font-bold text-white rounded-full shadow-md bg-gradient-to-r from-red-500 to-pink-500">
                                ⚠️ 위험 상태
                              </span>
                              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-3 rounded-2xl transition-all duration-300 ${
                            expandedItems.has(item.itemNumber)
                              ? 'bg-customG/10 text-customG'
                              : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                          }`}>
                          {expandedItems.has(item.itemNumber) ? (
                            <ChevronsUp className="w-5 h-5" />
                          ) : (
                            <ChevronsDown className="w-5 h-5" />
                          )}
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-4 ml-16">
                      <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-600 whitespace-nowrap">
                            실제값:
                          </span>
                          <div
                            className={`font-mono px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                              item.atRisk
                                ? 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200'
                                : 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700'
                            }`}>
                            {item.actualValue}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-slate-600 whitespace-nowrap">
                            기준값:
                          </span>
                          <div className="px-4 py-2 font-mono text-blue-700 border border-blue-200 rounded-xl bg-gradient-to-r from-blue-100 to-indigo-100">
                            {item.threshold}
                          </div>
                        </div>
                      </div>
                    </CardDescription>
                  </CardHeader>

                  {expandedItems.has(item.itemNumber) && (
                    <CardContent className="relative z-10 pt-0 pb-8">
                      <div className="relative p-6 mx-4 overflow-hidden border rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200">
                        {/* Decorative element */}
                        <div className="absolute bottom-0 right-0 w-16 h-16 translate-x-8 translate-y-8 rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-100/50"></div>

                        <div className="relative z-10 flex items-start gap-4">
                          <div className="p-3 bg-white border shadow-sm rounded-2xl border-slate-200">
                            <FileSearch className="w-6 h-6 text-slate-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <h4 className="text-lg font-bold text-slate-800">
                                상세 분석 정보
                              </h4>
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            </div>
                            <div className="p-4 bg-white border shadow-sm rounded-xl border-slate-200">
                              <p className="text-base leading-relaxed text-slate-700">
                                {item.notes ||
                                  '추가적인 분석 정보가 제공되지 않았습니다. 기본 수치 비교를 통해 위험도를 판단했습니다.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </LoadingState>
    </div>
  )
}
