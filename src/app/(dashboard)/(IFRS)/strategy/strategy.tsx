'use client'

import Scenario from './scenario'
import Risk from './risk'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
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
import {useEffect, useState} from 'react'

export default function Strategy() {
  const [loading, setLoading] = useState(true)
  const {data: RiskData, setData} = useRiskStore()
  const {data: ScenarioData, setData: setScenarioData} = useScenarioStore()

  const loadData = async () => {
    try {
      const RiskData = await fetchRiskList()
      setData(RiskData)

      const ScenarioData = await fetchScenarioList()
      setScenarioData(ScenarioData)
    } catch (e) {
      console.error('데이터 불러오기 실패:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [setData, setScenarioData])

  // 시나리오 테이블 헤더 (순서 업데이트)
  const scenarioHeader = [
    '분석 기준 연도',
    '행정구역',
    '시나리오',
    '위도/경도',
    '기후 지표',
    '산업 분야',
    '자산 유형',
    '자산 가치',
    '예상 피해액'
  ]

  // 리스크 테이블 헤더 (유지)
  const riskHeader = [
    '리스크 종류',
    '리스크 요인',
    '영향도',
    '사업 모헙 및 가치 사슬에 대한 영향',
    '시점',
    '잠재적 재무 영향',
    '내용 현황 및 계획'
  ]

  return (
    <div className="flex flex-col w-full h-full bg-[#F9FBFF] p-8">
      {/* Breadcrumb 부분 */}
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
              <BreadcrumbPage>전략</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-row items-center w-full px-4 mb-4 gap-x-4">
        <span className="text-xl font-bold">IFRS S2</span>
        <span className="text-gray-500">TCFD</span>
      </div>

      <div className="flex flex-row items-center justify-between w-full h-12 px-4 py-2 bg-white border border-b-2">
        <span className="text-xl font-bold">전략</span>
      </div>
      <div className="flex flex-col w-full h-full px-4 pb-2 bg-white border rounded">
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base">
              SSP 시나리오 분석 결과
            </AccordionTrigger>
            <AccordionContent>
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
                          String(item.estimatedDamage ?? '0') // 예상 피해액 (단위 추가)
                        ]
                      }))
                }
                formContent={({onClose, rowId, mode}) => (
                  <Scenario onClose={onClose} rowId={rowId} mode={mode} />
                )}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-base">
              물리/전환 리스크 및 기회요인
            </AccordionTrigger>
            <AccordionContent>
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
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
