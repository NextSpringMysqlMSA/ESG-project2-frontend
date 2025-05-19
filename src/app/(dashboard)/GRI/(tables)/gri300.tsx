'use client'

import {useState} from 'react'
import GriTable from '@/app/(dashboard)/GRI/(tables)/griTable'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {cn} from '@/lib/utils'
import {
  Info,
  Leaf,
  Droplets,
  Factory,
  FileCheck,
  Recycle,
  TreePine,
  Wind,
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

export default function GRI300() {
  const [activeTab, setActiveTab] = useState('all')

  const headers = ['No.', '지표명', '내용']

  // 각 GRI 번호의 앞자리를 기준으로 카테고리 구분
  const categoryNames = {
    '301': '원재료',
    '302': '에너지',
    '303': '용수 및 폐수',
    '304': '생물다양성',
    '305': '배출',
    '306': '폐기물',
    '307': '환경 규제준수',
    '308': '공급업체 환경평가'
  }

  // 카테고리 그룹화
  // 카테고리 그룹화 - 숫자 키 대신 문자열 카테고리명 사용
  const categoryGroups = {
    resources: {
      title: '자원 관리',
      icon: Factory,
      keys: ['원재료', '에너지'],
      description: '원재료 사용 및 에너지 사용과 관련된 지표'
    },
    water: {
      title: '용수 및 생물다양성',
      icon: Droplets,
      keys: ['용수 및 폐수', '생물다양성'],
      description: '용수 취수 및 사용, 생물다양성 영향 관련 지표'
    },
    emissions: {
      title: '배출 및 폐기물',
      icon: Wind,
      keys: ['배출', '폐기물'],
      description: '온실가스 및 대기오염물질 배출, 폐기물 발생 및 처리'
    },
    compliance: {
      title: '환경 규제 및 평가',
      icon: FileCheck,
      keys: ['환경 규제준수', '공급업체 환경평가'],
      description: '환경 관련 규제 준수 및 공급업체 환경 평가'
    }
  }

  // rowsWithCategory 배열의 순서를 수정합니다 - 환경 규제준수(307)를 올바른 위치로 이동

  // 데이터 구조 변경: 카테고리 정보를 포함하는 데이터 구조로 변경
  const rowsWithCategory = [
    {category: '원재료', data: ['301-1', '사용 원재료의 중량이나 부피', '']},
    {category: '원재료', data: ['301-2', '재생 원재료 사용 비율', '']},
    {category: '원재료', data: ['301-3', '재생 원료 사용 제품 및 포장재 비율', '']},

    {category: '에너지', data: ['302-1', '조직 내부 에너지 사용량', '']},
    {category: '에너지', data: ['302-2', '조직 외부 에너지 사용량', '']},
    {category: '에너지', data: ['302-3', '에너지 사용량 집약도', '']},
    {category: '에너지', data: ['302-4', '에너지 소비 절감', '']},
    {category: '에너지', data: ['302-5', '제품 및 서비스의 에너지 감축 필수 요건', '']},

    {category: '용수 및 폐수', data: ['303-1', '공유 자원으로서의 용수 활용', '']},
    {category: '용수 및 폐수', data: ['303-2', '폐수 관련 영향에 대한 관리', '']},
    {category: '용수 및 폐수', data: ['303-3', '용수 취수량', '']},
    {category: '용수 및 폐수', data: ['303-5', '용수 사용량', '']},

    {
      category: '생물다양성',
      data: [
        '304-1',
        '생물다양성 가치가 높은 구역 또는 주변지역에 소유, 임대, 관리 중인 사업장',
        ''
      ]
    },
    {
      category: '생물다양성',
      data: ['304-2', '활동, 제품, 서비스가 생물다양성에 미치는 중대한 영향', '']
    },
    {category: '생물다양성', data: ['304-3', '보호 또는 복원된 서식지', '']},
    {
      category: '생물다양성',
      data: ['304-4', '영향 지역에 서식하는 IUCN 적색목록 종과 국가보호종', '']
    },

    {category: '배출', data: ['305-1', '직접 온실가스 배출량(Scope 1)', '']},
    {category: '배출', data: ['305-2', '간접 온실가스 배출량(Scope 2)', '']},
    {category: '배출', data: ['305-3', '기타 간접 온실가스 배출량(Scope 3)', '']},
    {category: '배출', data: ['305-4', '온실가스 배출량 집약도', '']},
    {category: '배출', data: ['305-5', '온실가스 배출량 감축', '']},
    {category: '배출', data: ['305-6', '오존층 파괴 물질(ODS) 배출량', '']},
    {category: '배출', data: ['305-7', '대기오염물질 배출량(NOx, SOx 등)', '']},

    {category: '폐기물', data: ['306-1', '폐기물 발생 및 주요 사항', '']},
    {category: '폐기물', data: ['306-2', '폐기물 관련 주요 영향 관리', '']},
    {category: '폐기물', data: ['306-3', '폐기물 발생량 및 종류', '']},
    {category: '폐기물', data: ['306-4', '폐기물 재활용 현황', '']},
    {category: '폐기물', data: ['306-5', '기타 폐기물 처리 현황(에너지 회수 여부)', '']},

    // 환경 규제준수를 여기로 이동 (307 항목)
    {category: '환경 규제준수', data: ['307-1', '환경규제 위반', '']},

    {
      category: '공급업체 환경평가',
      data: ['308-1', '환경 기준 심사를 거친 신규 공급업체', '']
    },
    {
      category: '공급업체 환경평가',
      data: ['308-2', '공급망 내 부정적 환경 영향 및 조치', '']
    }
  ]
  // 기존 rows 배열을 단순화하여 카테고리 없이 데이터만 포함
  const rows = rowsWithCategory.map(item => item.data)

  // 카테고리별 행 필터링 함수
  const getFilteredRows = (category: string) => {
    if (category === 'all') return rows

    // 선택된 카테고리에 해당하는 행만 필터링
    return rowsWithCategory
      .filter(item => {
        // 숫자(3자리) 형태인 경우 코드 번호로 필터링 ('301' 등)
        if (/^\d{3}$/.test(category)) {
          return item.data[0].startsWith(category)
        } else {
          // 문자열인 경우 카테고리명으로 필터링 ('원재료' 등)
          return item.category === category
        }
      })
      .map(item => item.data)
  }

  // 테이블 카테고리 추출 (중복 제거)
  const categories = ['all', ...new Set(rowsWithCategory.map(item => item.category))]

  // 항목 아이콘 설정
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '원재료':
      case '301':
        return <Recycle className="w-4 h-4 mr-2" />
      case '에너지':
      case '302':
        return <Factory className="w-4 h-4 mr-2" />
      case '용수 및 폐수':
      case '303':
        return <Droplets className="w-4 h-4 mr-2" />
      case '생물다양성':
      case '304':
        return <TreePine className="w-4 h-4 mr-2" />
      case '배출':
      case '305':
        return <Wind className="w-4 h-4 mr-2" />
      case '폐기물':
      case '306':
        return <Recycle className="w-4 h-4 mr-2" />
      case '환경 규제준수':
      case '307':
        return <FileCheck className="w-4 h-4 mr-2" />
      case '공급업체 환경평가':
      case '308':
        return <FileCheck className="w-4 h-4 mr-2" />
      default:
        return <Leaf className="w-4 h-4 mr-2" />
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
      count += getFilteredRows(key).length
    })
    return count
  }

  return (
    <div className="flex flex-col w-full h-full px-1 space-y-6">
      {/* 헤더 섹션 */}
      <Card className="border-none shadow-sm bg-gradient-to-r from-customG/10 to-white">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <Leaf className="w-6 h-6 text-customG" />
            <CardTitle className="text-2xl text-gray-800 font-gmBold">
              GRI 300: 환경
            </CardTitle>
          </div>
          <p className="mt-2 text-gray-600">
            원재료, 에너지, 용수, 생물다양성, 대기배출, 폐기물, 환경 규제준수 등 조직의
            환경적 성과와 영향을 측정하는 공시 항목입니다.
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
            <Recycle className="w-4 h-4 mr-2" />
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
                모든 GRI 300 세부 항목
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
            {activeTab === 'all'
              ? '전체 항목'
              : /^\d{3}$/.test(activeTab)
              ? `${activeTab}: ${categoryNames[activeTab as keyof typeof categoryNames]}`
              : activeTab}
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
              tableId="GRI300"
            />
          </div>
        </CardContent>
      </Card>

      {/* 하단 정보 - 테마 색상으로 개선 */}
      <div className="flex items-start p-4 border rounded-md bg-customGLight/20 border-customGBorder/30">
        <div className="flex-1 text-sm text-gray-600">
          <h4 className="mb-2 font-medium text-customG">GRI 300 개요</h4>
          <p>
            GRI 300 시리즈는 환경 주제에 대한 표준입니다. 자원 사용, 에너지 소비,
            생물다양성 보호, 온실가스 배출, 폐기물 관리 등 조직의 환경적 영향을 포괄적으로
            공시하기 위한 지표들을 제공합니다. 이는 조직의 환경 성과를 평가하고 환경
            책임을 이행하는 데 있어 중요한 기준이 됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
