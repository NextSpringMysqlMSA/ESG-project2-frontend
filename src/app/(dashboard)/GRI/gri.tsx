'use client'

import {useState, useEffect} from 'react'
import {Check, Database, ChevronRight, ArrowRight, Home, BookOpen} from 'lucide-react'
import {cn} from '@/lib/utils'
import {Button} from '@/components/ui/button'
import {Command, CommandGroup, CommandItem, CommandList} from '@/components/ui/command'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {motion} from 'framer-motion'
import {BreadcrumbLink} from '@/components/ui/breadcrumb'
import {PageHeader} from '@/components/layout/PageHeader'
import {LoadingState} from '@/components/ui/loading-state'

// GRI 테이블 컴포넌트 임포트
import GRI2 from './(tables)/gri2'
import GRI3 from './(tables)/gri3'
import GRI200 from './(tables)/gri200'
import GRI300 from './(tables)/gri300'
import GRI400 from './(tables)/gri400'

// key는 내부 처리용, label은 사용자에게 보여질 이름
const tableOptions = [
  {
    key: 'GRI2',
    label: 'GRI 2: 일반표준',
    description: '조직의 일반 공시 항목',
    icon: '📊',
    color: 'from-blue-50 to-purple-50',
    borderColor: 'border-blue-200',
    categories: '조직 정보, 지배구조, 전략 및 정책'
  },
  {
    key: 'GRI3',
    label: 'GRI 3: 일반표준',
    description: '중요 주제 공시 항목',
    icon: '📋',
    color: 'from-indigo-50 to-blue-50',
    borderColor: 'border-indigo-200',
    categories: '중대 토픽 식별 및 관리'
  },
  {
    key: 'GRI200',
    label: 'GRI 200: 경제',
    description: '경제적 성과 및 영향',
    icon: '💰',
    color: 'from-amber-50 to-yellow-50',
    borderColor: 'border-amber-200',
    categories: '경제 성과, 간접 효과, 윤리 및 세금'
  },
  {
    key: 'GRI300',
    label: 'GRI 300: 환경',
    description: '환경적 성과 및 영향',
    icon: '🌱',
    color: 'from-customGLight to-green-50',
    borderColor: 'border-customGLight',
    categories: '자원, 용수, 배출, 생물다양성, 폐기물'
  },
  {
    key: 'GRI400',
    label: 'GRI 400: 사회',
    description: '사회적 성과 및 영향',
    icon: '👥',
    color: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    categories: '인적 자원, 인권, 지역사회, 고객'
  }
]

const tableComponents: Record<string, React.FC> = {
  GRI2,
  GRI3,
  GRI200,
  GRI300,
  GRI400
}

// 향상된 드롭다운 컴포넌트
function TableSelector({
  options,
  value,
  onChange
}: {
  options: typeof tableOptions
  value: string | null
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const selected = options.find(option => option.key === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between border bg-white hover:bg-gray-50 transition-all shadow-sm">
          {selected ? (
            <div className="flex items-center">
              <span className="mr-2 text-xl">{selected.icon}</span>
              <span className="font-medium">{selected.label}</span>
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <Database className="w-4 h-4 mr-2" />
              <span>테이블 선택</span>
            </div>
          )}
          <ChevronRight
            className={`ml-2 h-4 w-4 transition-transform ${open ? 'rotate-90' : ''}`}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 shadow-lg border-0 rounded-lg overflow-hidden">
        <Command className="border rounded-lg">
          <CommandList>
            <CommandGroup className="p-1">
              {options.map(option => (
                <CommandItem
                  key={option.key}
                  value={option.key}
                  className="flex flex-col items-start p-3 cursor-pointer hover:bg-customG/5 data-[selected=true]:bg-customG/5 transition-colors rounded-md my-1"
                  onSelect={currentValue => {
                    onChange(currentValue === value ? '' : currentValue)
                    setOpen(false)
                  }}>
                  <div className="flex items-center w-full">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${option.color} mr-2 text-xl`}>
                      {option.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-gray-500">{option.description}</span>
                    </div>
                    <Check
                      className={cn(
                        'ml-auto h-4 w-4 text-customG',
                        value === option.key ? 'opacity-100' : 'opacity-0'
                      )}
                    />
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

// GRI 카드 컴포넌트
function GRITableCards({
  options,
  selectedTable,
  onChange
}: {
  options: typeof tableOptions
  selectedTable: string | null
  onChange: (value: string) => void
}) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {options.map((option, index) => (
        <motion.div
          key={option.key}
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.3, delay: index * 0.1}}>
          <Card
            className={`cursor-pointer hover:shadow-md transition-all overflow-hidden ${
              selectedTable === option.key
                ? `border-2 ${option.borderColor} bg-gradient-to-br ${option.color}`
                : 'border border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onChange(option.key)}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br ${option.color} ${option.borderColor} text-2xl`}>
                  {option.icon}
                </div>
                {selectedTable === option.key && (
                  <div className="px-2 py-1 text-xs text-white rounded-full bg-customG">
                    선택됨
                  </div>
                )}
              </div>
              <CardTitle className="mt-2 text-lg">{option.label}</CardTitle>
              <CardDescription>{option.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-2">
              <div className="p-2 text-xs text-gray-500 rounded-md bg-white/60">
                <strong className="text-customG">주요 항목:</strong> {option.categories}
              </div>
            </CardContent>
            <CardFooter className="pt-2 border-t">
              <Button
                variant={selectedTable === option.key ? 'default' : 'outline'}
                size="sm"
                className={
                  selectedTable === option.key
                    ? 'w-full bg-customG hover:bg-customG/90'
                    : 'w-full'
                }>
                {selectedTable === option.key ? '보기' : '선택하기'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}

// 메인 GRI 컴포넌트
export default function GRI() {
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 테이블 선택 시 로딩 효과
  useEffect(() => {
    if (selectedTable) {
      setLoading(true)
      const timer = setTimeout(() => {
        setLoading(false)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [selectedTable])

  const renderTableContent = () => {
    if (!selectedTable) return null

    if (loading) {
      return (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-gray-200 rounded-full border-t-customG animate-spin"></div>
        </div>
      )
    }

    const TableComponent = tableComponents[selectedTable]
    return TableComponent ? (
      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.3}}>
        <TableComponent />
      </motion.div>
    ) : (
      <div className="p-8 text-center text-gray-500">
        해당 테이블 컴포넌트를 찾을 수 없습니다.
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full p-4 md:p-8">
      {/* 상단 네비게이션 */}
      <div className="flex flex-row items-center px-4 py-2 mb-4 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Home className="w-4 h-4 mr-1" />
        <span>대시보드</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>ESG 공시</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="font-medium text-customG">GRI</span>
      </div>

      {/* 제목 및 설명 - PageHeader 컴포넌트 사용 */}
      <PageHeader
        icon={<BookOpen className="w-6 h-6" />}
        title="GRI 표준"
        description="Global Reporting Initiative(GRI) 표준에 따른 ESG 공시 요구사항"
        module="GRI"></PageHeader>

      {/* 메인 컨텐츠 카드 */}
      <Card className="bg-white border rounded-lg shadow-sm">
        <CardHeader className="pb-2 border-b">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <CardTitle className="text-xl">테이블 선택</CardTitle>
              <CardDescription>분석할 GRI 표준 섹션을 선택해주세요</CardDescription>
            </div>

            {selectedTable && (
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTable(null)}
                  className="border-gray-300 hover:bg-gray-50">
                  다른 표준 선택
                </Button>
                <TableSelector
                  options={tableOptions}
                  value={selectedTable}
                  onChange={setSelectedTable}
                />
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <LoadingState isLoading={loading} error={error} isEmpty={false}>
            {!selectedTable ? (
              <GRITableCards
                options={tableOptions}
                selectedTable={selectedTable}
                onChange={setSelectedTable}
              />
            ) : (
              <div>{renderTableContent()}</div>
            )}
          </LoadingState>
        </CardContent>
      </Card>
    </div>
  )
}
