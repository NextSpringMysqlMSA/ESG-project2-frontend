'use client'

import {useState} from 'react'
import GriTable from '@/components/tools/griTable'
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card'
import {cn} from '@/lib/utils'
import {
  Info,
  Users,
  HeartHandshake,
  ChevronDown,
  Shield,
  Building,
  ShoppingCart,
  UserRound,
  ListFilter,
  FileCheck
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export default function GRI400() {
  const [activeTab, setActiveTab] = useState('all')

  const headers = ['No.', '지표명', '내용']

  // 각 GRI 번호의 앞자리를 기준으로 항목 구분
  const categories = {
    '401': '고용',
    '402': '노사관계',
    '403': '산업안전보건',
    '404': '훈련 및 교육',
    '405': '다양성과 기회균등',
    '406': '차별금지',
    '407': '결사 및 단체교섭의 자유',
    '408': '아동노동',
    '409': '강제노동',
    '410': '보안관행',
    '411': '원주민 권리',
    '412': '인권평가',
    '413': '지역사회',
    '414': '공급업체 사회평가',
    '415': '공공정책',
    '416': '고객 안전보건',
    '417': '마케팅 및 라벨링',
    '418': '고객개인정보보호',
    '419': '사회경제적 법규준수'
  }

  const rows = [
    ['401-1', '신규채용자 수 및 이직자 현황', ''],
    ['401-2', '임직원 복리후생 제도', ''],
    ['401-3', '육아휴직 사용, 복귀, 유지', ''],

    ['402-1', '운영상 변경내용 최소 통지 기간', ''],

    ['403-1', '안전보건경영시스템 구축', ''],
    ['403-2', '안전보건 위험성 평가, 산업재해 조사', ''],
    ['403-3', '안전보건 개선 활동', ''],
    ['403-4', '근로자 대상 안전보건 커뮤니케이션', ''],
    ['403-5', '근로자 대상 안전보건 교육 및 훈련', ''],
    ['403-6', '근로자 건강증진 프로그램', ''],
    ['403-7', '사업운영과 직결된 안전보건 영향 예방 및 완화', ''],
    ['403-8', '안전보건경영시스템 적용 대상 근로자', ''],
    ['403-9', '임직원, 협력사 재해 및 부상발생 현황', ''],
    ['403-10', '임직원, 협력사 질병발생 현황', ''],

    ['404-1', '임직원 1인당 평균 교육 시간', ''],
    ['404-2', '임직원 역량 강화 및 전환 지원을 위한 프로그램', ''],
    ['404-3', '업무성과 및 경력개발에 대한 정기적 피드백 비율', ''],

    ['405-1', '범주별 거버넌스 기구 및 근로자 구성', ''],
    ['405-2', '남성 대비 여성의 기본급 및 보상 비율', ''],

    ['406-1', '차별 사건 및 이에 대한 조치', ''],

    ['407-1', '결사 및 단체교섭의 자유 침해 위험 사업장', ''],

    ['408-1', '아동 노동 발생 위험이 높은 사업장', ''],
    ['409-1', '강제 노동 발생 위험이 높은 사업장', ''],

    ['410-1', '보안 담당자의 인권 교육', ''],

    ['411-1', '원주민 권리 침해 사건 수', ''],

    ['412-1', '인권영향 평가 혹은 검토대상 사업장', ''],
    ['412-2', '임직원 인권 교육', ''],

    ['413-1', '지역사회 참여 및 평가 프로그램 사업장', ''],
    ['413-2', '부정적 영향을 미치는 사업장', ''],

    ['414-1', '심사를 거친 신규 공급업체', ''],
    ['414-2', '부정적 사회 영향 및 조치', ''],

    ['415-1', '정치자금 기부 내역', ''],

    ['416-1', '제품 및 서비스 안전보건 영향평가', ''],
    ['416-2', '안전보건 영향 관련 규정 위반 사건', ''],

    ['417-1', '제품 정보 및 라벨링 내용', ''],
    ['417-2', '라벨링 관련 법규 위반', ''],
    ['417-3', '마케팅 관련 규정 위반', ''],

    ['418-1', '개인정보보호 위반 및 불만 건수', ''],

    ['419-1', '사회·경제적 법규 위반', '']
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

  // 카테고리 그룹화
  const categoryGroups = {
    human: {
      title: '인적 자원',
      icon: UserRound,
      keys: ['401', '402', '404', '405'],
      description: '고용, 노사관계, 훈련 및 교육, 다양성과 기회균등'
    },
    safety: {
      title: '안전 및 보건',
      icon: Shield,
      keys: ['403'],
      description: '산업안전보건 관련 지표'
    },
    rights: {
      title: '인권 및 다양성',
      icon: Users,
      keys: ['406', '407', '408', '409', '410', '411', '412'],
      description: '차별금지, 결사의 자유, 아동노동, 강제노동, 원주민 권리 등'
    },
    community: {
      title: '지역사회 및 공급망',
      icon: Building,
      keys: ['413', '414', '415'],
      description: '지역사회 참여, 공급업체 사회평가, 공공정책'
    },
    customer: {
      title: '제품 및 고객',
      icon: ShoppingCart,
      keys: ['416', '417', '418', '419'],
      description: '고객 안전보건, 마케팅 및 라벨링, 고객정보보호, 법규준수'
    }
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
            <HeartHandshake className="w-6 h-6 text-customG" />
            <CardTitle className="text-2xl font-bold text-gray-800">
              GRI 400: 사회
            </CardTitle>
          </div>
          <p className="mt-2 text-gray-600">
            고용, 산업안전, 인권, 지역사회, 제품책임 등 조직이 사회에 미치는 영향과 관련된
            공시 항목입니다. 기업의 사회적 책임과 이해관계자와의 관계를 평가합니다.
          </p>
        </CardHeader>
      </Card>

      {/* 간소화된 항목 필터 섹션 - GRI300과 동일한 패턴 적용 */}
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
            <FileCheck className="w-4 h-4 mr-2" />
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
                모든 GRI 400 세부 항목
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
              tableId="GRI400"
            />
          </div>
        </CardContent>
      </Card>

      {/* 하단 정보 */}
      <div className="flex items-start p-4 rounded-md bg-customG/5">
        <div className="flex-1 text-sm text-gray-600">
          <h4 className="mb-2 font-medium text-customG">GRI 400 개요</h4>
          <p>
            GRI 400 시리즈는 기업의 사회적 영향력과 책임에 관한 지표들을 담고 있습니다.
            근로자의 고용 조건부터 인권, 지역사회 참여, 고객 관리까지 기업 활동이 사회에
            미치는 다양한 영향을 측정합니다. 이러한 지표는 조직이 사회적으로 책임감 있는
            경영을 하고 있는지 평가하는 기준이 됩니다.
          </p>
        </div>
      </div>
    </div>
  )
}
