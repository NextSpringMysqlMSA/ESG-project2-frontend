'use client'

import Committee from './committee'
import KPI from './kpi'
import Education from './education'
import Meeting from './meeting'
import {format} from 'date-fns'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '../../../../components/ui/breadcrumb'
import {useEffect, useState} from 'react'
import CollapsibleWindow from '@/components/tools/collapsibleWindow'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import {useCommitteeStore} from '@/stores/IFRS/governance/useCommitteeStore'
import {fetchCommitteeList} from '@/services/governance'
import {useMeetingStore} from '@/stores/IFRS/governance/useMeetingStore'
import {fetchMeetingList} from '@/services/governance'
import {useKPIStore} from '@/stores/IFRS/governance/useKPIStore'
import {fetchKpiList} from '@/services/governance'
import {useEducationStore} from '@/stores/IFRS/governance/useEducationStore'
import {fetchEducationList} from '@/services/governance'

export default function Governance() {
  const [loading, setLoading] = useState(true)
  const {data: committeeData, setData} = useCommitteeStore()
  const {data: meetingData, setData: setMeetingData} = useMeetingStore()
  const {data: kpiData, setData: setKpiData} = useKPIStore()
  const {data: educationData, setData: setEducationData} = useEducationStore()

  useEffect(() => {
    const loadData = async () => {
      try {
        const committeeData = await fetchCommitteeList()
        setData(committeeData)

        const meetingData = await fetchMeetingList()
        const parsedMeetingData = meetingData.map(item => ({
          ...item,
          meetingDate: new Date(item.meetingDate)
        }))
        setMeetingData(parsedMeetingData)

        const kpiList = await fetchKpiList()
        setKpiData(kpiList)

        const educationList = await fetchEducationList()
        const parsedEducationList = educationList.map(item => ({
          ...item,
          educationDate: new Date(item.educationDate)
        }))
        setEducationData(parsedEducationList)
      } catch (e) {
        console.error('데이터 불러오기 실패:', e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [setData, setMeetingData, setKpiData, setEducationData])

  const committeeHeader = [
    '위원회 이름',
    '구성원 이름 / 직책 / 소속',
    '기후 관련 역할 및 책임 설명'
  ]
  const meetingHeader = ['회의 날짜', '회의 제목', '주요 안건 및 의결 내용']
  const KPIHeader = ['경영진 이름', 'KPI명', '목표율/목표값', '달성률/달성값']
  const educationHeader = ['교육 일자', '참석자 수', '교육 제목', '교육 주요 내용']

  return (
    <div className="flex flex-col w-full h-full p-8">
      <div className="flex flex-row px-4 mb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/official">ESG 공시</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/official">IFRS S2</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>거버넌스</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-row items-center w-full px-4 mb-4 gap-x-4">
        <span className="text-xl font-bold">IFRS S2</span>
        <span className="text-gray-500">TCFD</span>
      </div>

      <div className="flex flex-row items-center justify-between w-full h-12 px-4 py-2 bg-white border border-b-2 rounded">
        <span className="text-xl font-bold">거버넌스</span>
      </div>

      <div className="flex flex-col w-full h-full px-4 pb-2 bg-white border rounded">
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base">위원회 구성</AccordionTrigger>
            <AccordionContent>
              <CollapsibleWindow
                type="committee"
                headers={committeeHeader}
                dialogTitle="위원회 및 조직 입력"
                data={
                  loading
                    ? []
                    : committeeData.map(item => [
                        item.committeeName,
                        `${item.memberName} / ${item.memberPosition} / ${item.memberAffiliation}`,
                        item.climateResponsibility
                      ])
                }
                formContent={({onClose, row, mode}) => (
                  <Committee onClose={onClose} row={row} mode={mode} />
                )}
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base">회의 관리</AccordionTrigger>
            <AccordionContent>
              <CollapsibleWindow
                type="meeting"
                headers={meetingHeader}
                formContent={({onClose}) => <Meeting onClose={onClose} />}
                dialogTitle="회의관리"
                data={
                  loading
                    ? []
                    : meetingData.map(item => [
                        item.meetingDate ? format(item.meetingDate, 'yyyy-MM-dd') : '',
                        item.meetingName ?? '',
                        item.agenda ?? ''
                      ])
                }
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger className="text-base">경영진 KPI</AccordionTrigger>
            <AccordionContent>
              <CollapsibleWindow
                type="KPI"
                headers={KPIHeader}
                formContent={({onClose}) => <KPI onClose={onClose} />}
                dialogTitle="경영진 KPI 입력"
                data={
                  loading
                    ? []
                    : kpiData.map(item => [
                        item.executiveName ?? '',
                        item.kpiName ?? '',
                        item.targetValue ?? '',
                        item.achievedValue ?? ''
                      ])
                }
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger className="text-base">환경 교육</AccordionTrigger>
            <AccordionContent>
              <CollapsibleWindow
                type="education"
                headers={educationHeader}
                formContent={({onClose}) => <Education onClose={onClose} />}
                dialogTitle="환경 교육 기록"
                data={
                  loading
                    ? []
                    : educationData.map(item => [
                        item.educationDate
                          ? format(item.educationDate, 'yyyy-MM-dd')
                          : '',
                        item.participantCount?.toString() ?? '',
                        item.educationTitle ?? '',
                        item.content ?? ''
                      ])
                }
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
