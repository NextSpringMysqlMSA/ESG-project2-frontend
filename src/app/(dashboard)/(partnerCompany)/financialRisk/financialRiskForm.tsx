'use client'

import {useState, useEffect} from 'react'
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
  type FinancialRiskAssessment
} from '@/services/partnerCompany'

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

// 협력사 데이터 구조 변경 (이름과 DART 코드 포함)
// 실제 운영 환경에서는 이 목록을 API로부터 받아오거나, 다른 방식으로 관리해야 합니다.
const partners = [
  {name: '협력사 A', code: '00126380'},
  {name: '협력사 B', code: '00123456'},
  {name: '협력사 C', code: '00789012'},
  {name: '협력사 D', code: '00345678'},
  {name: '협력사 E', code: '00901234'}
]

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full" // 너비를 full로 변경하거나 적절한 값으로 조절
        >
          {selectedOption ? selectedOption.name : '협력사 선택...'}
          <ChevronsUpDown className="w-4 h-4 ml-2 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0"
        style={{minWidth: 'var(--radix-popover-trigger-width)'}}>
        <Command>
          <CommandInput placeholder="협력사 검색..." />
          <CommandList>
            <CommandEmpty>해당하는 협력사가 없습니다.</CommandEmpty>
            <CommandGroup>
              {options.map(option => (
                <CommandItem
                  key={option.code}
                  value={option.code}
                  onSelect={currentValue => {
                    onChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.code ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {option.name}
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

      // 먼저 고유 파트너사명 목록을 가져옵니다.
      const partnerNames = await fetchUniquePartnerCompanyNames()
      console.log('Loaded partner names:', partnerNames)

      // 목록은 문자열 배열이므로 옵션 형식으로 변환합니다.
      // API가 아직 코드를 제공하지 않는 경우 임시 처리
      const options = partnerNames.map(name => ({
        name,
        code: name // 임시로 이름을 코드로 사용
      }))

      setPartnerOptions(options)
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

      // 재무 위험 분석 데이터 가져오기
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
    <div className="flex flex-col w-full h-full p-4 md:p-8">
      <div className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Home className="w-4 h-4 mr-1" />
        <span>협력사 관리</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-customG">재무제표 리스크 관리</span>
      </div>

      <PageHeader
        icon={<Building2 className="h-8 w-8" />}
        title="협력사 재무 위험 분석"
        description="사의 재무 건전성과 위험을 분석합니다."
        module="CSDD"
      />

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3">
          <PartnerCombobox
            options={partnerOptions}
            value={selectedPartnerCode}
            onChange={handlePartnerSelect}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setIsLoading(true)
            loadPartnerOptions().finally(() => setIsLoading(false))
          }}
          disabled={isLoading}
          className="flex items-center gap-1 mt-2 text-gray-500 hover:text-gray-700 md:mt-0">
          <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          데이터 새로고침
        </Button>
      </div>

      <LoadingState isLoading={isLoading} error={error} isEmpty={!riskData}>
        {riskData && (
          <div className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">파트너사</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{riskData.partnerCompanyName}</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    사업자번호: {riskData.partnerCompanyId}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">기준 정보</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{riskData.assessmentYear}년</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    보고서 코드: {riskData.reportCode}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">재무 위험 상태</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <div className="text-2xl font-bold">{statusInfo.label}</div>
                    {statusInfo.icon}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    위험 항목: {atRiskCount} / {riskData.riskItems.length} 항목
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAllExpanded(true)}
                className="text-xs">
                <ChevronsDown className="w-4 h-4 mr-1" />
                모두 펼치기
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleAllExpanded(false)}
                className="text-xs">
                <ChevronsUp className="w-4 h-4 mr-1" />
                모두 접기
              </Button>
            </div>

            <div className="space-y-4">
              {riskData.riskItems.map(item => (
                <Card
                  key={item.itemNumber}
                  className={item.atRisk ? 'border-red-200' : ''}>
                  <CardHeader
                    className="pb-2 cursor-pointer"
                    onClick={() => toggleExpand(item.itemNumber)}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-base font-medium">
                        <span className="inline-flex items-center justify-center w-6 h-6 text-sm rounded-full bg-slate-100">
                          {item.itemNumber}
                        </span>
                        {item.description}
                        {item.atRisk && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-100">
                            위험
                          </span>
                        )}
                      </CardTitle>
                      {expandedItems.has(item.itemNumber) ? (
                        <ChevronsUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronsDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <CardDescription>
                      실제값:{' '}
                      <span className={item.atRisk ? 'text-red-600 font-medium' : ''}>
                        {item.actualValue}
                      </span>{' '}
                      / 기준값: {item.threshold}
                    </CardDescription>
                  </CardHeader>

                  {expandedItems.has(item.itemNumber) && (
                    <CardContent>
                      <div className="p-3 text-sm rounded-md bg-slate-50">
                        <div className="flex items-start gap-2">
                          <FileSearch className="h-5 w-5 text-slate-400 mt-0.5" />
                          <div>
                            <p className="font-medium text-slate-700">상세 정보</p>
                            <p className="mt-1 text-slate-600">
                              {item.notes || '추가 정보가 없습니다.'}
                            </p>
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
