'use client'

import {useEffect, useState} from 'react'
import {
  Zap,
  LineChart,
  BarChart3,
  Cloud,
  Building,
  ChevronRight,
  Home
} from 'lucide-react'
import Scenario from './scenario'
import Risk from './risk'
import {BreadcrumbLink} from '@/components/ui/breadcrumb'
import CollapsibleWindow from '@/components/tools/collapsibleWindow'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import {useRiskStore} from '@/stores/IFRS/strategy/useRiskStore'
import {useScenarioStore} from '@/stores/IFRS/strategy/useScenarioStore'
import {fetchRiskList, fetchScenarioList} from '@/services/strategy'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {motion} from 'framer-motion'
import {Skeleton} from '@/components/ui/skeleton'
import {PageHeader} from '@/components/layout/PageHeader'
import {LoadingState} from '@/components/ui/loading-state'
import {StatusBadge} from '@/components/ui/status-badge'
import {Button} from '@/components/ui/button'
import {useUIStore} from '@/stores/IFRS/strategy/UIState'

export default function Strategy() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const {data: RiskData, setData} = useRiskStore()
  const {data: ScenarioData, setData: setScenarioData} = useScenarioStore()
  // 정보 카드 표시 여부를 관리하는 상태 추가
  const {showInfoCards, toggleInfoCards} = useUIStore()

  const loadData = async () => {
    try {
      const RiskData = await fetchRiskList()
      setData(RiskData)

      const ScenarioData = await fetchScenarioList()
      setScenarioData(ScenarioData)
    } catch (e) {
      console.error('데이터 불러오기 실패:', e)
      setError('데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [setData, setScenarioData])

  // 시나리오 테이블 헤더
  const scenarioHeader = [
    '분석 기준 연도',
    '행정구역',
    '시나리오',
    '위도/경도',
    '기후 지표',
    '산업 분야',
    '자산 유형',
    '자산 가치 ￦',
    '예상 피해액 ￦'
  ]

  // 리스크 테이블 헤더
  const riskHeader = [
    '리스크 종류',
    '리스크 요인',
    '영향도',
    '사업 모델 및 가치 사슬에 대한 영향',
    '시점',
    '잠재적 재무 영향',
    '내용 현황 및 계획'
  ]

  // 요약 통계 계산
  const scenarioCount = ScenarioData?.length || 0
  // const riskCount = RiskData?.length || 0

  // 리스크 유형 카운트
  const riskTypeCount = {
    '물리적 리스크':
      RiskData?.filter(item => item.riskType === '물리적 리스크').length || 0,
    '전환 리스크': RiskData?.filter(item => item.riskType === '전환 리스크').length || 0,
    '기회 요인': RiskData?.filter(item => item.riskType === '기회 요인').length || 0
  }

  return (
    <div className="flex flex-col w-full h-full p-4 space-y-6 md:p-8">
      {/* 상단 네비게이션 */}
      <div className="flex flex-row items-center p-2 px-2 mb-2 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Home className="w-4 h-4 mr-1" />
        <span>대시보드</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>ESG 공시</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>IFRS S2</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-customG">전략</span>
      </div>

      {/* 헤더 섹션 - PageHeader 컴포넌트 사용 */}
      <PageHeader
        icon={<LineChart className="w-6 h-6" />}
        title="기후변화 전략 관리"
        description="기후변화 관련 위험과 기회, 시나리오 분석을 통한 전략적 접근"
        module="IFRS"
        submodule="strategy"></PageHeader>

      <LoadingState
        isLoading={loading}
        error={error}
        isEmpty={RiskData?.length === 0 && ScenarioData?.length === 0}
        showFormWhenEmpty={true} // 데이터가 없어도 폼 표시
        emptyMessage="기후변화 전략 데이터가 없습니다."
        emptyIcon={<LineChart className="w-16 h-16" />}
        retryAction={loadData}>
        {/* 요약 통계 */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.4, delay: 0.1}}
          className="grid grid-cols-1 gap-4 mb-2 md:grid-cols-4">
          <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="flex items-center p-4">
              <div className="p-2 mr-3 bg-blue-100 rounded-full">
                <LineChart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">시나리오</p>
                <h3 className="text-2xl font-gmBold">
                  {loading ? <Skeleton className="w-8 h-8" /> : scenarioCount}
                  <span className="ml-1 text-sm font-normal text-gray-500">개</span>
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white">
            <CardContent className="flex items-center p-4">
              <div className="p-2 mr-3 bg-orange-100 rounded-full">
                <Zap className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">물리적 리스크</p>
                <h3 className="text-2xl font-gmBold">
                  {loading ? (
                    <Skeleton className="w-8 h-8" />
                  ) : (
                    riskTypeCount['물리적 리스크']
                  )}
                  <span className="ml-1 text-sm font-normal text-gray-500">개</span>
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-white border-rose-100">
            <CardContent className="flex items-center p-4">
              <div className="p-2 mr-3 rounded-full bg-rose-100">
                <Building className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">전환 리스크</p>
                <h3 className="text-2xl font-gmBold">
                  {loading ? (
                    <Skeleton className="w-8 h-8" />
                  ) : (
                    riskTypeCount['전환 리스크']
                  )}
                  <span className="ml-1 text-sm font-normal text-gray-500">개</span>
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-100 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="flex items-center p-4">
              <div className="p-2 mr-3 bg-green-100 rounded-full">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">기회 요인</p>
                <h3 className="text-2xl font-gmBold">
                  {loading ? (
                    <Skeleton className="w-8 h-8" />
                  ) : (
                    riskTypeCount['기회 요인']
                  )}
                  <span className="ml-1 text-sm font-normal text-gray-500">개</span>
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Separator />

        {/* 정보 카드 섹션 헤더 및 토글 버튼 */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-500">기후변화 전략 정보</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleInfoCards}
            className="text-gray-500 hover:text-blue-600">
            {showInfoCards ? '정보 카드 숨기기' : '정보 카드 표시하기'}
          </Button>
        </div>

        {/* 조건부 렌더링으로 정보 카드 표시/숨김 */}
        {showInfoCards && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.1}}>
              <Card className="h-full overflow-hidden border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Cloud className="w-5 h-5 text-blue-500" />
                    시나리오 분석의 중요성
                  </CardTitle>
                  <CardDescription>
                    SSP 기후 시나리오에 기반한 재무적 영향 분석
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col justify-between h-[calc(100%-80px)]">
                  <p className="text-sm text-gray-600">
                    물리적 기후변화 영향을 SSP 시나리오에 기반하여 분석합니다. 기업의
                    자산, 운영, 공급망에 대한 잠재적 위험과 기회를 식별하고, 장기적 전략에
                    반영할 수 있습니다.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <StatusBadge text="SSP1-1.9" severity="success" />
                    <StatusBadge text="SSP2-4.5" severity="info" />
                    <StatusBadge text="SSP3-7.0" severity="warning" />
                    <StatusBadge text="SSP5-8.5" severity="error" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: 0.2}}>
              <Card className="h-full overflow-hidden border-l-4 border-l-rose-500">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Zap className="w-5 h-5 text-rose-500" />
                    리스크 및 기회 식별
                  </CardTitle>
                  <CardDescription>기후변화 관련 위험과 기회 관리 체계</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col justify-between h-[calc(100%-80px)]">
                  <p className="text-sm text-gray-600">
                    기업 특성에 맞춘 물리적/전환 리스크를 식별하고 이를 관리하기 위한
                    체계적인 대응 전략을 수립합니다. 또한 기후변화에서 발생하는 새로운
                    사업 기회를 발굴하여 경쟁력을 강화합니다.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <StatusBadge text="물리적 리스크" severity="warning" />
                    <StatusBadge text="전환 리스크" severity="error" />
                    <StatusBadge text="기회 요인" severity="success" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Accordion 섹션 */}
        <div className="overflow-hidden bg-white border rounded-lg shadow-sm">
          <CardHeader className="p-4 bg-white border-b">
            <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
              <div>
                <CardTitle className="text-xl">기후변화 전략 관리</CardTitle>
                <CardDescription>
                  기후변화 관련 시나리오 및 리스크를 관리합니다
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="bg-white rounded-b-lg">
              <Accordion type="multiple" className="p-4">
                <AccordionItem
                  value="item-1"
                  className="mb-3 overflow-hidden border rounded-md shadow-sm">
                  <AccordionTrigger className="px-4 py-3 text-base font-medium bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-center">
                      <Cloud className="w-5 h-5 mr-2 text-blue-600" />
                      SSP 시나리오 분석 결과
                      <Badge
                        variant="outline"
                        className="ml-2 border-blue-100 bg-blue-50">
                        {ScenarioData?.length || 0}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4">
                    <Card className="border-0 shadow-none">
                      <CardContent className="p-0">
                        <CollapsibleWindow
                          type="scenario"
                          headers={scenarioHeader}
                          dialogTitle="SSP 시나리오 분석"
                          data={
                            loading
                              ? []
                              : ScenarioData.map(item => ({
                                  id: item.id,
                                  values: [
                                    String(item.baseYear ?? ''), // 분석 기준 연도
                                    String(item.regions ?? ''), // 행정구역
                                    String(item.scenario ?? ''), // 시나리오
                                    `${item.latitude ?? ''}/${item.longitude ?? ''}`, // 위도/경도 통합
                                    String(item.climate ?? ''), // 기후 지표
                                    String(item.industry ?? ''), // 산업 분야
                                    String(item.assetType ?? ''), // 자산 유형
                                    String(item.assetValue ?? ''), // 자산 가치
                                    String(item.estimatedDamage ?? '0') // 예상 피해액
                                  ]
                                }))
                          }
                          formContent={({onClose, rowId, mode}) => (
                            <Scenario onClose={onClose} rowId={rowId} mode={mode} />
                          )}
                        />
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem
                  value="item-2"
                  className="mb-1 overflow-hidden border rounded-md shadow-sm">
                  <AccordionTrigger className="px-4 py-3 text-base font-medium bg-gradient-to-r from-rose-50 to-white">
                    <div className="flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-rose-600" />
                      물리/전환 리스크 및 기회요인
                      <Badge
                        variant="outline"
                        className="ml-2 border-rose-100 bg-rose-50">
                        {RiskData?.length || 0}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="p-4">
                    <Card className="border-0 shadow-none">
                      <CardContent className="p-0">
                        <CollapsibleWindow
                          type="risk"
                          headers={riskHeader}
                          dialogTitle="리스크 식별 및 대응"
                          data={
                            loading
                              ? []
                              : RiskData.map(item => ({
                                  id: item.id,
                                  values: [
                                    item.riskType ?? '',
                                    item.riskCause ?? '',
                                    item.impact ?? '',
                                    item.businessModelImpact ?? '',
                                    item.time ?? '',
                                    item.financialImpact ?? '',
                                    item.plans ?? ''
                                  ]
                                }))
                          }
                          formContent={({onClose, rowId, mode}) => (
                            <Risk onClose={onClose} rowId={rowId} mode={mode} />
                          )}
                        />
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </CardContent>
        </div>
      </LoadingState>
    </div>
  )
}
