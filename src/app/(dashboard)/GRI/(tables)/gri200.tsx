'use client'

import {useState} from 'react'
import GriTable from '@/components/tools/griTable'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {cn} from '@/lib/utils'
import {
  Info,
  DollarSign,
  BarChart3,
  Building,
  ShoppingBag,
  ShieldAlert,
  FileCheck,
  Landmark,
  ChevronDown,
  ListFilter
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export default function GRI200() {
  const [activeTab, setActiveTab] = useState('all')

  const headers = ['No.', '지표명', '내용']

  // 각 GRI 번호의 앞자리를 기준으로 항목 구분
  const categories = {
    '201': '경제 성과',
    '202': '시장 지위',
    '203': '간접 경제 효과',
    '204': '구매 관행',
    '205': '반부패',
    '206': '반경쟁 행위',
    '207': '세금'
  }

  // 항목 그룹화
  const categoryGroups = {
    performance: {
      title: '경제 성과',
      icon: BarChart3,
      keys: ['201', '202'],
      description: '직접적인 경제 성과 및 시장 지위 관련 지표'
    },
    indirect: {
      title: '간접 효과',
      icon: Building,
      keys: ['203', '204'],
      description: '간접 경제 효과 및 구매 관행 관련 지표'
    },
    ethics: {
      title: '윤리 및 세금',
      icon: ShieldAlert,
      keys: ['205', '206', '207'],
      description: '반부패, 반경쟁 행위 및 세금 관련 지표'
    }
  }

  const rows = [
    ['201-1', '직접적인 경제적 가치 창출과 배분', ''],
    ['201-2', '기후변화의 재무적 영향과 사업활동에 대한 위험 및 기회', ''],
    ['201-3', '확정급여제도와 기타 퇴직제도', ''],
    ['201-4', '정부로부터 받은 재정적 지원', ''],
    [
      '202-1',
      '주요 사업장이 위치한 지역의 최저 임금과 비교한 성별 기본 초임 임금 비율',
      ''
    ],
    ['202-2', '주요 사업장이 위치한 현지에서 고용된 고위 경영진의 비율', ''],
    ['203-1', '인프라 투자와 지원 서비스의 개발 및 영향', ''],
    ['203-2', '중요한 간접적 경제 효과', ''],
    ['204-1', '지역 공급업체에서 사용하는 예산 비율', ''],
    ['205-1', '부패 위험을 평가한 사업장의 수 및 비율, 파악된 중요한 위험', ''],
    ['205-2', '반부패 정책 및 절차에 대한 공지와 훈련', ''],
    ['205-3', '확인된 부패 사례와 이에 대한 조치', ''],
    ['206-1', '경쟁저해행위, 독과점 등 불공정 거래행위에 대한 법적 조치', ''],
    ['207-1', '세금에 대한 접근법', ''],
    ['207-2', '조세 거버넌스, 통제 및 리스크 관리', ''],
    ['207-3', '이해관계자 참여 및 세금 문제 관리', '']
  ]

  // 행 필터링 함수
  const getFilteredRows = (category: string) => {
    if (category === 'all') return rows
    return rows.filter(row => row[0].startsWith(category.substring(0, 3)))
  }

  // 항목별 지표 수 계산
  const getCategoryItemCount = (categoryKey: string) => {
    if (categoryKey === 'all') return rows.length
    return rows.filter(row => row[0].startsWith(categoryKey)).length
  }

  // 그룹별 항목 수 계산
  const getGroupItemCount = (groupKeys: string[]) => {
    let count = 0
    groupKeys.forEach(key => {
      count += getCategoryItemCount(key)
    })
    return count
  }

  return (
    <div className="flex flex-col w-full h-full px-1 space-y-6">
      {/* 헤더 섹션 */}
      <Card className="border-none shadow-sm bg-gradient-to-r from-customG/10 to-white">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-6 h-6 text-customG" />
            <CardTitle className="text-2xl font-bold text-gray-800">
              GRI 200: 경제
            </CardTitle>
          </div>
          <p className="mt-2 text-gray-600">
            경제적 가치 창출, 시장 지위, 간접 경제 효과, 구매 관행, 반부패, 조세 등 조직의
            경제적 성과와 영향을 측정하는 공시 항목입니다.
          </p>
        </CardHeader>
      </Card>

      {/* 간소화된 항목 필터 섹션 */}
      <div className="flex flex-col space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* 전체 보기 버튼 */}
          <button
            onClick={() => setActiveTab('all')}
            className={cn(
              'flex items-center whitespace-nowrap px-6 py-1.5 rounded-md border text-sm transition-all',
              activeTab === 'all'
                ? 'bg-customG text-white border-customG font-medium'
                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
            )}>
            <Landmark className="w-4 h-4 mr-2" />
            모든 항목
            <span className="ml-1.5 text-xs opacity-80">({rows.length})</span>
          </button>

          {/* 모든 세부 항목 드롭다운 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700">
                <ListFilter className="w-4 h-4 text-customG" />
                세부 항목
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[220px] max-h-[400px] overflow-y-auto">
              <div className="p-2 mb-1 text-xs font-medium text-gray-600 border-b">
                모든 GRI 200 세부 항목
              </div>
              <DropdownMenuGroup>
                {Object.entries(categories).map(([key, value]) => (
                  <DropdownMenuItem
                    key={key}
                    className={cn(
                      'flex justify-between cursor-pointer px-3 py-1.5',
                      activeTab === key && 'bg-customG/10 text-customG font-medium'
                    )}
                    onClick={() => setActiveTab(key)}>
                    <span>
                      {key}: {value}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                      {getCategoryItemCount(key)}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 항목 그룹 드롭다운 메뉴들 */}
          {Object.entries(categoryGroups).map(([groupKey, groupData]) => {
            // 현재 그룹에 속한 항목이 활성화되어 있는지 확인
            const isGroupActive = groupData.keys.includes(activeTab)

            return (
              <DropdownMenu key={groupKey}>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 text-sm rounded-md border transition-colors',
                      isGroupActive
                        ? 'bg-customG text-white border-customG font-medium'
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                    )}>
                    <groupData.icon className="w-4 h-4" />
                    {groupData.title}
                    <span className="ml-1 text-xs opacity-80">
                      ({getGroupItemCount(groupData.keys)})
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-70" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[260px]">
                  <div className="p-2 mb-1 text-sm font-medium border-b text-customG bg-customG/5">
                    <div className="flex items-center">
                      <groupData.icon className="w-4 h-4 mr-2" />
                      {groupData.title}
                    </div>
                    <div className="mt-1 text-xs font-normal text-gray-600">
                      {groupData.description}
                    </div>
                  </div>
                  <DropdownMenuGroup className="p-1">
                    {groupData.keys.map(key => (
                      <DropdownMenuItem
                        key={key}
                        className={cn(
                          'flex justify-between cursor-pointer px-3 py-2 rounded-md',
                          activeTab === key && 'bg-customG/10 text-customG font-medium'
                        )}
                        onClick={() => setActiveTab(key)}>
                        <span>
                          {key}: {categories[key as keyof typeof categories]}
                        </span>
                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {getCategoryItemCount(key)}
                        </span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )
          })}
        </div>
      </div>

      {/* 범례 및 필터링 정보 통합 */}
      <div className="flex items-center justify-between p-3 rounded-md bg-gray-50">
        <div className="text-sm">
          <span className="font-medium text-customG">
            {activeTab === 'all'
              ? '전체 항목'
              : `${activeTab}: ${categories[activeTab as keyof typeof categories]}`}
          </span>
          <span className="ml-2 text-xs text-gray-500">
            {getFilteredRows(activeTab).length}개 항목
          </span>
        </div>

        {/* 범례 */}
        <div className="flex items-center text-xs text-gray-500">
          <Info className="h-3.5 w-3.5 text-customG mr-1" />
          <span>내용란을 클릭하여 정보 입력</span>
        </div>
      </div>

      {/* 테이블 */}
      <Card className="overflow-hidden border rounded-lg shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <GriTable
              headers={headers}
              rows={getFilteredRows(activeTab)}
              tableId="GRI200"
            />
          </div>
        </CardContent>
      </Card>

      {/* 하단 정보 */}
      <div className="flex items-start p-4 rounded-md bg-customG/5">
        <div className="flex-1 text-sm text-gray-600">
          <h4 className="mb-2 font-medium text-customG">GRI 200 개요</h4>
          <p>
            GRI 200 시리즈는 경제적 주제에 대한 표준입니다. 조직의 경제적 성과, 시장
            점유율, 간접적 경제 영향, 조달 관행, 반부패 및 반경쟁적 행위에 관한 정보를
            다룹니다. 이는 조직이 지역 경제에 미치는 영향과 경제적 지속가능성을 평가하는
            데 중요한 지표입니다.
          </p>
        </div>
      </div>
    </div>
  )
}
