'use client'

import {useEffect, useState} from 'react'
import {format} from 'date-fns'
import {motion} from 'framer-motion'
import {
  Landmark,
  Users,
  CalendarDays,
  BarChart,
  GraduationCap,
  ChevronRight,
  Home
} from 'lucide-react'

// 컴포넌트 가져오기
import Committee from './committee'
import KPI from './kpi'
import Education from './education'
import Meeting from './meeting'
import CollapsibleWindow from '@/components/tools/collapsibleWindow'

// UI 컴포넌트
import {BreadcrumbLink} from '@/components/ui/breadcrumb'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Skeleton} from '@/components/ui/skeleton'
import {PageHeader} from '@/components/layout/PageHeader'
import {LoadingState} from '@/components/ui/loading-state'

// 데이터 스토어 및 서비스
import {useCommitteeStore} from '@/stores/IFRS/governance/useCommitteeStore'
import {useMeetingStore} from '@/stores/IFRS/governance/useMeetingStore'
import {useKPIStore} from '@/stores/IFRS/governance/useKPIStore'
import {useEducationStore} from '@/stores/IFRS/governance/useEducationStore'
import {
  fetchCommitteeList,
  fetchMeetingList,
  fetchKpiList,
  fetchEducationList
} from '@/services/governance'

/**
 * Governance 컴포넌트
 *
 * IFRS S2 거버넌스 관련 정보를 관리하고 표시하는 대시보드 컴포넌트입니다.
 * 위원회 구성, 회의 관리, 경영진 KPI, 환경 교육 등의 섹션으로 구성되어 있습니다.
 */
export default function Governance() {
  // 데이터 로딩 상태
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 탭 상태 관리
  // const [activeTab, setActiveTab] = useState('all')

  // 데이터 스토어
  const {data: committeeData, setData} = useCommitteeStore()
  const {data: meetingData, setData: setMeetingData} = useMeetingStore()
  const {data: kpiData, setData: setKpiData} = useKPIStore()
  const {data: educationData, setData: setEducationData} = useEducationStore()

  // 데이터 통계
  const stats = {
    committees: committeeData?.length || 0,
    meetings: meetingData?.length || 0,
    kpis: kpiData?.length || 0,
    educations: educationData?.length || 0,
    total:
      (committeeData?.length || 0) +
      (meetingData?.length || 0) +
      (kpiData?.length || 0) +
      (educationData?.length || 0)
  }

  // 컴포넌트 마운트 시 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        // 위원회 데이터 로드
        const committeeData = await fetchCommitteeList()
        setData(committeeData)

        // 회의 데이터 로드 및 날짜 파싱
        const meetingData = await fetchMeetingList()
        const parsedMeetingData = meetingData.map(item => ({
          ...item,
          meetingDate: new Date(item.meetingDate)
        }))
        setMeetingData(parsedMeetingData)

        // KPI 데이터 로드
        const kpiList = await fetchKpiList()
        setKpiData(kpiList)

        // 교육 데이터 로드 및 날짜 파싱
        const educationList = await fetchEducationList()
        const parsedEducationList = educationList.map(item => ({
          ...item,
          educationDate: new Date(item.educationDate)
        }))
        setEducationData(parsedEducationList)
      } catch (e) {
        console.error('데이터 불러오기 실패:', e)
        setError('데이터를 불러오는 중 오류가 발생했습니다.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [setData, setMeetingData, setKpiData, setEducationData])

  // 테이블 헤더 정의
  const committeeHeader = [
    '위원회 이름',
    '구성원 이름 / 직책 / 소속',
    '기후 관련 역할 및 책임 설명'
  ]
  const meetingHeader = ['회의 날짜', '회의 제목', '주요 안건 및 의결 내용']
  const KPIHeader = ['경영진 이름', 'KPI명', '목표율/목표값', '달성률/달성값']
  const educationHeader = ['교육 일자', '참석자 수', '교육 제목', '교육 주요 내용']

  return (
    <div className="flex flex-col w-full h-full p-4 md:p-8">
      {/* 상단 네비게이션 */}
      <div className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Home className="w-4 h-4 mr-1" />
        <span>대시보드</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>ESG 공시</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span>IFRS S2</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="text-customG">거버넌스</span>
      </div>
      {/* 헤더 섹션 - PageHeader 컴포넌트 사용 */}
      <PageHeader
        icon={<Landmark className="w-6 h-6" />}
        title="거버넌스"
        description="IFRS S2/TCFD 기반 기후 거버넌스 체계 관리"
        module="IFRS"
        submodule="governance"></PageHeader>
      {/* LoadingState 컴포넌트 활용 - 빈 상태일 때도 폼을 표시하도록 수정 */}
      <LoadingState
        isLoading={loading}
        error={error}
        isEmpty={stats.total === 0}
        showFormWhenEmpty={true}
        emptyMessage="거버넌스 데이터가 없습니다. 첫 번째 항목을 추가해 보세요."
        emptyAction={{
          label: '데이터 추가하기',
          onClick: () => {
            /* 추가 작업 구현 */
          }
        }}>
        {/* 통계 카드 */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.4, delay: 0.1}}
          className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="flex items-center p-4">
              <div className="p-2 mr-3 bg-blue-100 rounded-full">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">위원회</p>
                <h3 className="text-2xl font-gmBold">
                  {loading ? <Skeleton className="w-8 h-8" /> : stats.committees}
                  <span className="ml-1 text-sm font-normal text-gray-500">개</span>
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-100 bg-gradient-to-br from-emerald-50 to-white">
            <CardContent className="flex items-center p-4">
              <div className="p-2 mr-3 rounded-full bg-emerald-100">
                <CalendarDays className="w-5 h-5 text-customG" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">회의</p>
                <h3 className="text-2xl font-gmBold">
                  {loading ? <Skeleton className="w-8 h-8" /> : stats.meetings}
                  <span className="ml-1 text-sm font-normal text-gray-500">개</span>
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="flex items-center p-4">
              <div className="p-2 mr-3 bg-purple-100 rounded-full">
                <BarChart className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">KPI</p>
                <h3 className="text-2xl font-gmBold">
                  {loading ? <Skeleton className="w-8 h-8" /> : stats.kpis}
                  <span className="ml-1 text-sm font-normal text-gray-500">개</span>
                </h3>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-100 bg-gradient-to-br from-amber-50 to-white">
            <CardContent className="flex items-center p-4">
              <div className="p-2 mr-3 rounded-full bg-amber-100">
                <GraduationCap className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">교육</p>
                <h3 className="text-2xl font-gmBold">
                  {loading ? <Skeleton className="w-8 h-8" /> : stats.educations}
                  <span className="ml-1 text-sm font-normal text-gray-500">개</span>
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* 메인 콘텐츠 */}
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5, delay: 0.2}}>
          <Card className="overflow-hidden shadow-sm">
            <CardHeader className="p-4 bg-white border-b">
              <div className="flex flex-col justify-between gap-2 md:flex-row md:items-center">
                <div>
                  <CardTitle className="text-xl">거버넌스 관리</CardTitle>
                  <CardDescription>
                    지속가능성 거버넌스 구조 및 활동에 대한 정보를 관리합니다
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <div className="bg-white rounded-b-lg">
                <Accordion type="multiple" defaultValue={[]} className="p-4">
                  <AccordionItem
                    value="item-1"
                    className="mb-3 overflow-hidden border rounded-md shadow-sm">
                    <AccordionTrigger className="px-4 py-3 text-base font-medium bg-gradient-to-r from-blue-50 to-white">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-2 text-blue-600" />
                        위원회 구성
                        <Badge
                          variant="outline"
                          className="ml-2 border-blue-100 bg-blue-50">
                          {committeeData.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4">
                      <CollapsibleWindow
                        type="committee"
                        headers={committeeHeader}
                        dialogTitle="위원회 및 조직 입력"
                        data={committeeData.map(item => ({
                          id: item.id,
                          values: [
                            item.committeeName,
                            `${item.memberName} / ${item.memberPosition} / ${item.memberAffiliation}`,
                            item.climateResponsibility
                          ]
                        }))}
                        formContent={({onClose, rowId, mode}) => (
                          <Committee onClose={onClose} rowId={rowId} mode={mode} />
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-2"
                    className="mb-3 overflow-hidden border rounded-md shadow-sm">
                    <AccordionTrigger className="px-4 py-3 text-base font-medium bg-gradient-to-r from-customGLight to-white">
                      <div className="flex items-center">
                        <CalendarDays className="w-5 h-5 mr-2 text-customG" />
                        회의 관리
                        <Badge
                          variant="outline"
                          className="ml-2 bg-customGLight border-customGBorder">
                          {meetingData.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4">
                      <CollapsibleWindow
                        type="meeting"
                        headers={meetingHeader}
                        dialogTitle="회의관리"
                        data={meetingData.map(item => ({
                          id: item.id,
                          values: [
                            item.meetingDate
                              ? format(item.meetingDate, 'yyyy-MM-dd')
                              : '',
                            item.meetingName ?? '',
                            item.agenda ?? ''
                          ]
                        }))}
                        formContent={({onClose, rowId, mode}) => (
                          <Meeting onClose={onClose} rowId={rowId} mode={mode} />
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-3"
                    className="mb-3 overflow-hidden border rounded-md shadow-sm">
                    <AccordionTrigger className="px-4 py-3 text-base font-medium bg-gradient-to-r from-purple-50 to-white">
                      <div className="flex items-center">
                        <BarChart className="w-5 h-5 mr-2 text-purple-600" />
                        경영진 KPI
                        <Badge
                          variant="outline"
                          className="ml-2 border-purple-100 bg-purple-50">
                          {kpiData.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4">
                      <CollapsibleWindow
                        type="KPI"
                        headers={KPIHeader}
                        dialogTitle="경영진 KPI 입력"
                        data={kpiData.map(item => ({
                          id: item.id,
                          values: [
                            item.executiveName ?? '',
                            item.kpiName ?? '',
                            item.targetValue ?? '',
                            item.achievedValue ?? ''
                          ]
                        }))}
                        formContent={({onClose, rowId, mode}) => (
                          <KPI onClose={onClose} rowId={rowId} mode={mode} />
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="item-4"
                    className="mb-1 overflow-hidden border rounded-md shadow-sm">
                    <AccordionTrigger className="px-4 py-3 text-base font-medium bg-gradient-to-r from-amber-50 to-white">
                      <div className="flex items-center">
                        <GraduationCap className="w-5 h-5 mr-2 text-amber-600" />
                        환경 교육
                        <Badge
                          variant="outline"
                          className="ml-2 bg-amber-50 border-amber-100">
                          {educationData.length}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-4">
                      <CollapsibleWindow
                        type="education"
                        headers={educationHeader}
                        dialogTitle="환경 교육 기록"
                        data={educationData.map(item => ({
                          id: item.id,
                          values: [
                            item.educationDate
                              ? format(item.educationDate, 'yyyy-MM-dd')
                              : '',
                            item.participantCount?.toString() ?? '',
                            item.educationTitle ?? '',
                            item.content ?? ''
                          ]
                        }))}
                        formContent={({onClose, rowId, mode}) => (
                          <Education onClose={onClose} rowId={rowId} mode={mode} />
                        )}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </LoadingState>
    </div>
  )
}
