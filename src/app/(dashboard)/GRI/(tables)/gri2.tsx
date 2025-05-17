'use client'

import {useState} from 'react'
import GriTable from '@/app/(dashboard)/GRI/(tables)/griTable'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {cn} from '@/lib/utils'
import {
  Info,
  BookOpen,
  Building,
  Users,
  LayoutGrid,
  HandCoins,
  ClipboardList,
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

export default function GRI2() {
  const [activeTab, setActiveTab] = useState('all')

  // Topic 제거: 헤더에서 'Topic' 항목 삭제
  const headers = ['No.', '지표명', '내용']

  // 데이터 구조 변경: 첫 번째 컬럼을 메타데이터로 변경하고 실제 행에서는 제거
  const rowsWithCategory = [
    {category: '조직 및 보고 관행', data: ['2-1', '조직 세부사항', '']},
    {
      category: '조직 및 보고 관행',
      data: ['2-2', '조직의 지속가능경영보고에 포함된 법인', '']
    },
    {category: '조직 및 보고 관행', data: ['2-3', '보고 기간, 주기 및 문의처', '']},
    {category: '조직 및 보고 관행', data: ['2-4', '정보의 수정', '']},
    {category: '조직 및 보고 관행', data: ['2-5', '외부 검증', '']},
    {category: '기업활동 및 임직원', data: ['2-6', '활동, 가치사슬, 사업 관계', '']},
    {category: '기업활동 및 임직원', data: ['2-7', '임직원', '']},
    {category: '기업활동 및 임직원', data: ['2-8', '임직원이 아닌 근로자', '']},
    {category: '지배구조', data: ['2-9', '지배 구조 및 구성', '']},
    {category: '지배구조', data: ['2-10', '최고의사결정기구의 임명 및 선정', '']},
    {category: '지배구조', data: ['2-11', '최고의사결정기구 의장', '']},
    {
      category: '지배구조',
      data: ['2-12', '영향 관리 감독에 대한 최고의사결정기구의 역할', '']
    },
    {category: '지배구조', data: ['2-13', '영향 관리에 대한 책임의 위임', '']},
    {
      category: '지배구조',
      data: ['2-14', '지속가능성 보고에 대한 최고의사결정기구의 역할', '']
    },
    {category: '지배구조', data: ['2-15', '이해관계 상충', '']},
    {category: '지배구조', data: ['2-16', '중요 사안에 대한 커뮤니케이션', '']},
    {category: '지배구조', data: ['2-17', '최고의사결정기구의 집단지식', '']},
    {category: '지배구조', data: ['2-18', '최고의사결정기구 성과 평가', '']},
    {category: '지배구조', data: ['2-19', '보수 정책', '']},
    {category: '지배구조', data: ['2-20', '보수 결정 절차', '']},
    {category: '지배구조', data: ['2-21', '연간 총 보상 비율', '']},
    {
      category: '전략, 정책 및 관행',
      data: ['2-22', '지속가능한 개발 전략에 대한 성명서', '']
    },
    {category: '전략, 정책 및 관행', data: ['2-23', '정책 약속', '']},
    {category: '전략, 정책 및 관행', data: ['2-24', '정책 약속 내재', '']},
    {
      category: '전략, 정책 및 관행',
      data: ['2-25', '부정적 영향 개선을 위한 프로세스', '']
    },
    {category: '전략, 정책 및 관행', data: ['2-26', '자문 및 우려 제기에 대한 절차', '']},
    {
      category: '전략, 정책 및 관행',
      data: ['2-27', '법률 및 규정에 대한 컴플라이언스', '']
    },
    {category: '전략, 정책 및 관행', data: ['2-28', '가입 협회', '']},
    {category: '이해관계자 참여', data: ['2-29', '이해관계자 참여에 대한 접근방식', '']},
    {category: '이해관계자 참여', data: ['2-30', '단체협약', '']}
  ]

  // 기존 rows 배열을 단순화하여 카테고리 없이 데이터만 포함
  const rows = rowsWithCategory.map(item => item.data)

  // 카테고리별 행 필터링 함수
  const getFilteredRows = (category: string) => {
    if (category === 'all') return rows

    // 선택된 카테고리에 해당하는 행만 필터링
    return rowsWithCategory
      .filter(item => item.category === category)
      .map(item => item.data)
  }

  // 테이블 카테고리 추출
  const categories = ['all', ...new Set(rowsWithCategory.map(item => item.category))]

  // 항목 그룹화
  const categoryGroups = {
    organization: {
      title: '조직 정보',
      icon: Building,
      keys: ['조직 및 보고 관행', '기업활동 및 임직원'],
      description: '조직 세부사항, 보고 관행, 기업활동 및 임직원 관련 지표'
    },
    governance: {
      title: '지배구조',
      icon: LayoutGrid,
      keys: ['지배구조'],
      description: '의사결정기구, 보수, 거버넌스 구조 관련 지표'
    },
    strategy: {
      title: '전략 및 정책',
      icon: ClipboardList,
      keys: ['전략, 정책 및 관행', '이해관계자 참여'],
      description: '지속가능성 전략, 정책, 이해관계자 참여 관련 지표'
    }
  }

  // 항목 아이콘 설정
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '조직 및 보고 관행':
        return <Building className="w-4 h-4 mr-2" />
      case '기업활동 및 임직원':
        return <Users className="w-4 h-4 mr-2" />
      case '지배구조':
        return <LayoutGrid className="w-4 h-4 mr-2" />
      case '전략, 정책 및 관행':
        return <ClipboardList className="w-4 h-4 mr-2" />
      case '이해관계자 참여':
        return <HandCoins className="w-4 h-4 mr-2" />
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
            <BookOpen className="w-6 h-6 text-customG" />
            <CardTitle className="text-2xl text-gray-800 font-gmBold">
              GRI 2: 일반 표준
            </CardTitle>
          </div>
          <p className="mt-2 text-gray-600">
            기업의 지속가능성을 위한 일반 공시 항목으로, 조직의 기본 정보와 지배구조, 전략
            및 이해관계자 참여 등을 다룹니다.
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
            <ClipboardList className="w-4 h-4 mr-2" />
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
                모든 GRI 2 세부 항목
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
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
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
              tableId="GRI2"
            />
          </div>
        </CardContent>
      </Card>

      {/* 하단 정보 - 테마 색상으로 개선 */}
      <div className="flex items-start p-4 border rounded-md bg-customGLight/20 border-customGBorder/30">
        <div className="flex-1 text-sm text-gray-600">
          <h4 className="mb-2 font-medium text-customG">GRI 2 개요</h4>
          <p>
            GRI 2는 조직의 일반적인 세부사항과 지속가능성 보고 관행에 대한 정보를
            공시합니다. 이 표준은 모든 보고 조직이 적용해야 하는 필수 요구사항입니다.
          </p>
        </div>
      </div>
    </div>
  )
}
