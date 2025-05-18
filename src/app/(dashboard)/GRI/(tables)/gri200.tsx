'use client'

import {useState} from 'react'
import GriTable from '@/app/(dashboard)/GRI/(tables)/griTable'
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

  // 데이터 구조 변경: 카테고리 정보를 포함하는 데이터 구조로 변경
  const rowsWithCategory = [
    // 경제 성과
    {category: '경제 성과', data: ['201-1', '직접적인 경제적 가치 창출과 배분', '']},
    {
      category: '경제 성과',
      data: ['201-2', '기후변화의 재무적 영향과 사업활동에 대한 위험 및 기회', '']
    },
    {category: '경제 성과', data: ['201-3', '확정급여제도와 기타 퇴직제도', '']},
    {category: '경제 성과', data: ['201-4', '정부로부터 받은 재정적 지원', '']},

    // 시장 지위
    {
      category: '시장 지위',
      data: [
        '202-1',
        '주요 사업장이 위치한 지역의 최저 임금과 비교한 성별 기본 초임 임금 비율',
        ''
      ]
    },
    {
      category: '시장 지위',
      data: ['202-2', '주요 사업장이 위치한 현지에서 고용된 고위 경영진의 비율', '']
    },

    // 간접 경제 효과
    {
      category: '간접 경제 효과',
      data: ['203-1', '인프라 투자와 지원 서비스의 개발 및 영향', '']
    },
    {category: '간접 경제 효과', data: ['203-2', '중요한 간접적 경제 효과', '']},

    // 구매 관행
    {category: '구매 관행', data: ['204-1', '지역 공급업체에서 사용하는 예산 비율', '']},

    // 반부패
    {
      category: '반부패',
      data: ['205-1', '부패 위험을 평가한 사업장의 수 및 비율, 파악된 중요한 위험', '']
    },
    {category: '반부패', data: ['205-2', '반부패 정책 및 절차에 대한 공지와 훈련', '']},
    {category: '반부패', data: ['205-3', '확인된 부패 사례와 이에 대한 조치', '']},

    // 반경쟁 행위
    {
      category: '반경쟁 행위',
      data: ['206-1', '경쟁저해행위, 독과점 등 불공정 거래행위에 대한 법적 조치', '']
    },

    // 세금
    {category: '세금', data: ['207-1', '세금에 대한 접근법', '']},
    {category: '세금', data: ['207-2', '조세 거버넌스, 통제 및 리스크 관리', '']},
    {category: '세금', data: ['207-3', '이해관계자 참여 및 세금 문제 관리', '']}
  ]

  // 기존 rows 배열을 단순화하여 카테고리 없이 데이터만 포함
  const rows = rowsWithCategory.map(item => item.data)

  // 카테고리별 행 필터링 함수
  // 카테고리별 행 필터링 함수 수정
  const getFilteredRows = (category: string) => {
    if (category === 'all') return rows

    // 선택된 카테고리에 해당하는 행만 필터링
    return rowsWithCategory
      .filter(item => {
        // 숫자(3자리) 형태인 경우 코드 번호로 필터링 ('205' 등)
        if (/^\d{3}$/.test(category)) {
          return item.data[0].startsWith(category)
        } else {
          // 문자열인 경우 카테고리명으로 필터링 ('반부패' 등)
          return item.category === category
        }
      })
      .map(item => item.data)
  }

  // 테이블 카테고리 추출 (중복 제거)
  const categories = ['all', ...new Set(rowsWithCategory.map(item => item.category))]

  // 항목 그룹화 - 기존 구조 유지
  const categoryGroups = {
    performance: {
      title: '경제 성과',
      icon: BarChart3,
      keys: ['경제 성과', '시장 지위'],
      description: '직접적인 경제 성과 및 시장 지위 관련 지표'
    },
    indirect: {
      title: '간접 효과',
      icon: Building,
      keys: ['간접 경제 효과', '구매 관행'],
      description: '간접 경제 효과 및 구매 관행 관련 지표'
    },
    ethics: {
      title: '윤리 및 세금',
      icon: ShieldAlert,
      keys: ['반부패', '반경쟁 행위', '세금'],
      description: '반부패, 반경쟁 행위 및 세금 관련 지표'
    }
  }

  // GRI 번호와 카테고리 매핑
  // const codeToCategory = {
  //   '201': '경제 성과',
  //   '202': '시장 지위',
  //   '203': '간접 경제 효과',
  //   '204': '구매 관행',
  //   '205': '반부패',
  //   '206': '반경쟁 행위',
  //   '207': '세금'
  // }

  // 항목 아이콘 설정
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '경제 성과':
        return <BarChart3 className="w-4 h-4 mr-2" />
      case '시장 지위':
        return <Landmark className="w-4 h-4 mr-2" />
      case '간접 경제 효과':
        return <Building className="w-4 h-4 mr-2" />
      case '구매 관행':
        return <ShoppingBag className="w-4 h-4 mr-2" />
      case '반부패':
        return <ShieldAlert className="w-4 h-4 mr-2" />
      case '반경쟁 행위':
        return <FileCheck className="w-4 h-4 mr-2" />
      case '세금':
        return <DollarSign className="w-4 h-4 mr-2" />
      case '201':
        return <BarChart3 className="w-4 h-4 mr-2" />
      case '202':
        return <Landmark className="w-4 h-4 mr-2" />
      case '203':
        return <Building className="w-4 h-4 mr-2" />
      case '204':
        return <ShoppingBag className="w-4 h-4 mr-2" />
      case '205':
        return <ShieldAlert className="w-4 h-4 mr-2" />
      case '206':
        return <FileCheck className="w-4 h-4 mr-2" />
      case '207':
        return <DollarSign className="w-4 h-4 mr-2" />
      default:
        return null
    }
  }

  // 카테고리별 항목 수 계산
  const getCategoryItemCount = (category: string) => {
    return getFilteredRows(category).length
  }

  // 그룹별 항목 수 계산
  const getGroupItemCount = (groupKeys: string[]) => {
    let count = 0
    groupKeys.forEach(key => {
      count += rowsWithCategory.filter(item => item.category === key).length
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
            <CardTitle className="text-2xl text-gray-800 font-gmBold">
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
                {categories.slice(1).map(category => (
                  <DropdownMenuItem
                    key={category}
                    className={cn(
                      'flex justify-between cursor-pointer px-3 py-1.5',
                      activeTab === category && 'bg-customG/10 text-customG font-medium'
                    )}
                    onClick={() => setActiveTab(category)}>
                    <div className="flex items-center">
                      {getCategoryIcon(category)}
                      <span>{category}</span>
                    </div>
                    <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-customGLight/50 text-customGTextDark">
                      {getCategoryItemCount(category)}
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
                        <div className="flex items-center">
                          {getCategoryIcon(key)}
                          <span>{key}</span>
                        </div>
                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded-full bg-customGLight/50 text-customGTextDark">
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

      {/* 범례 및 필터링 정보 통합 - 테마 색상으로 개선 */}
      <div className="flex items-center justify-between p-3 border rounded-md bg-customGLight/30 border-customGBorder/30">
        <div className="text-sm">
          <span className="font-medium text-customGTextDark">
            {activeTab === 'all' ? '전체 항목' : activeTab}
          </span>
          <span className="ml-2 text-xs text-customG/80">
            {getFilteredRows(activeTab).length}개 항목
          </span>
        </div>

        {/* 범례 */}
        <div className="flex items-center text-xs text-customG/90">
          <Info className="h-3.5 w-3.5 text-customG mr-1" />
          <span>내용란을 클릭하여 정보 입력</span>
        </div>
      </div>

      {/* 테이블 - 테마 색상으로 개선된 테이블 적용 */}
      <Card className="overflow-hidden border rounded-lg shadow-sm border-customGBorder/50">
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

      {/* 하단 정보 - 테마 색상으로 개선 */}
      <div className="flex items-start p-4 border rounded-md bg-customGLight/20 border-customGBorder/30">
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
