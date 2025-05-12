'use client'

import axios from 'axios'

import {useState, useEffect} from 'react'
import type {JSX} from 'react'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import DashButton from '@/components/tools/dashButton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'

export default function EDDForm() {
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [analysisData, setAnalysisData] = useState<Record<string, any>>({})

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/v1/csdd/eudd', {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      .then(res => setAnalysisData(res.data))
      .catch(err => console.error('❌ 분석 데이터 불러오기 실패:', err))
  }, [])

  useEffect(() => {
    console.log('🧠 answers 상태:', answers)
  }, [answers])

  const next = () => {
    if (step < 7) setStep(step + 1)
  }
  const prev = () => setStep(prev => Math.max(prev - 1, 1))

  const renderItem = (item: {type: string; text: string}, id: string): JSX.Element => {
    if (item.type === 'title') {
      return (
        <h2 key={id} className="text-base font-semibold text-gray-600">
          {item.text}
        </h2>
      )
    }
    if (item.type === 'subject') {
      return (
        <p key={id} className="font-semibold text-customG">
          {item.text}
        </p>
      )
    }

    if (item.type === 'question') {
      return (
        <div
          key={id}
          className="flex flex-col justify-between gap-4 py-2 border-b md:flex-row md:items-center">
          <p className="font-medium md:max-w-[80%]">{item.text}</p>
          <RadioGroup
            orientation="horizontal"
            className="flex space-x-1"
            onValueChange={value => setAnswers(prev => ({...prev, [id]: value}))}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id={`${id}-yes`} />
              <label htmlFor={`${id}-yes`}>예</label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id={`${id}-no`} />
              <label htmlFor={`${id}-no`}>아니요</label>
            </div>
          </RadioGroup>
        </div>
      )
    }

    return <></>
  }

  const questions: Record<
    string,
    {type: 'title' | 'subject' | 'question'; text: string}[]
  > = {
    1: [
      {type: 'title', text: '1. 기업 정책 및 리스크 관리 시스템에 실사 내재화'},
      {
        type: 'subject',
        text: 'EU 공급망 지침에서 요구한 인권 및 환경과 관련된 실사 지침(정책)을 보유하고 있습니까?'
      },
      {
        type: 'question',
        text: '실사 지침에는 실사에 대한 회사의 접근 방식에 대한 설명이 포함되어 있습니까?'
      },
      {
        type: 'question',
        text: '실사 지침에는 자체 운영, 자회사 및 직·간접적인 비즈니스 파트너가 준수해야 하는 행동강령이 포함되어 있습니까? '
      },
      {
        type: 'question',
        text: '실사 지침에는 비즈니스 파트너의 행동강령 준수 여부 확인 및 실사 이행 프로세스에 대한 설명이 포함되어 있습니까? '
      },
      {type: 'question', text: '실사 지침은 최소 24개월마다 정기적으로 업데이트됩니까?'},
      {
        type: 'question',
        text: '중대한 변경 사항(신규 사업/제품 출시, M&A 등) 발생 시, 실사 지침을 업데이트하는 프로세스를 보유하고 있습니까? '
      },
      {
        type: 'question',
        text: '실사 지침(정책) 제정 과정에서 공급망 실사 지침 과 유사한 관련 법령에 대한 지속적인 모니터링을 수행하고 있습니까? '
      },
      {
        type: 'subject',
        text: '실사 지침의 이행 전 과정에 걸쳐 다양한 이해관계자(임직원, 고객, 협력사, 주주·투자자, 정부 등)를 참여시키고 있습니까?'
      },
      {
        type: 'question',
        text: '이해관계자로부터 의견을 수렴하기 위한 의사소통 채널을 마련하고 있습니까? '
      },
      {
        type: 'question',
        text: '이해관계자가 의견을 제시하는 과정에서 발생하는 보복 또는 보상을 방지하기 위한 절차를 마련하고 있습니까?'
      },
      {
        type: 'subject',
        text: '인권 및 환경과 관련된 고충을 접수할 수 있는 고충처리제도를 운영하고 있습니까?'
      },
      {
        type: 'question',
        text: '고충처리제도는 임직원 뿐만 아니라, 협력사와 고객 등 다양한 이해관계자들이 공개적으로 접근 할 수 있습니까? '
      },
      {type: 'question', text: '고충을 접수한 제보자에 대한 기밀이 보장됩니까? '},
      {
        type: 'question',
        text: '고충을 접수한 제보자에 대한 보복을 방지하기 위한 절차를 마련하고 있습니까? '
      },
      {
        type: 'question',
        text: '고충이 접수되면, 고충에 대한 사실관계 확인, 결과 통보, 조치 등 적절한 사후 조치가 이루어지고 있습니까? '
      },
      {
        type: 'question',
        text: '고충을 접수한 제보자에게 적절한 후속 조치를 요청하거나 기업 대표와 논의할 수 있는 권리가 부여되고 있습니까? '
      },
      {
        type: 'question',
        text: '고충에 대한 구제조치가 마련되면, 향후 동일한 사례가 발생하지 않도록 적절한 개선 조치가 취해집니까? '
      }
    ],
    2: [
      {type: 'title', text: '2. 위험 평가 및 실사 프로세스'},
      {
        type: 'subject',
        text: '기업은 인권 및 환경 위험에 대한 체계적인 위험 평가 프로세스를 보유하고 있습니까?'
      },
      {
        type: 'question',
        text: '위험 평가는 자체 운영, 자회사 및 직간접적인 비즈니스 파트너를 포함합니까?'
      },
      {
        type: 'question',
        text: '위험 평가는 정기적으로(예: 연 1회 이상) 수행됩니까?'
      },
      {
        type: 'question',
        text: '위험 평가 결과는 실사 계획 및 우선순위 결정에 반영됩니까?'
      },
      {
        type: 'subject',
        text: '실사 프로세스는 위험 평가 결과에 기반하여 위험이 높은 영역에 집중되어 있습니까?'
      },
      {
        type: 'question',
        text: '실사 프로세스는 자체 운영, 자회사 및 비즈니스 파트너를 모두 포함합니까?'
      },
      {
        type: 'question',
        text: '실사 결과는 문서화되고, 이해관계자와 공유됩니까?'
      },
      {
        type: 'question',
        text: '실사 과정에서 발견된 문제에 대해 시정 조치 계획이 수립되고 이행됩니까?'
      }
    ],
    3: [
      {type: 'title', text: '3. 시정 조치 및 개선 활동'},
      {
        type: 'subject',
        text: '기업은 실사 과정에서 확인된 인권 및 환경 문제에 대해 시정 조치를 취하고 있습니까?'
      },
      {
        type: 'question',
        text: '시정 조치 계획은 명확한 목표와 기한을 포함합니까?'
      },
      {
        type: 'question',
        text: '시정 조치의 이행 여부를 모니터링하고 있습니까?'
      },
      {
        type: 'question',
        text: '시정 조치의 효과를 평가하고 필요한 경우 추가 조치를 취합니까?'
      },
      {
        type: 'subject',
        text: '개선 활동은 지속 가능하고 장기적인 변화를 목표로 하고 있습니까?'
      },
      {
        type: 'question',
        text: '협력사 및 공급망 전반에 걸친 역량 강화 프로그램을 운영하고 있습니까?'
      },
      {
        type: 'question',
        text: '이해관계자와의 협력을 통해 문제 해결을 촉진하고 있습니까?'
      }
    ],
    4: [
      {type: 'title', text: '4. 이해관계자 참여 및 커뮤니케이션'},
      {
        type: 'subject',
        text: '기업은 다양한 이해관계자와의 소통 채널을 운영하고 있습니까?'
      },
      {
        type: 'question',
        text: '이해관계자의 의견 수렴 절차가 명확히 정의되어 있습니까?'
      },
      {
        type: 'question',
        text: '이해관계자의 피드백이 실사 및 시정 조치에 반영됩니까?'
      },
      {
        type: 'question',
        text: '기업은 이해관계자와의 정기적인 대화 및 협력 활동을 수행하고 있습니까?'
      },
      {
        type: 'subject',
        text: '투명한 정보 공개를 통해 신뢰 구축에 노력하고 있습니까?'
      },
      {
        type: 'question',
        text: '실사 결과 및 시정 조치 현황을 공개하고 있습니까?'
      },
      {
        type: 'question',
        text: '연례 보고서 또는 지속가능성 보고서를 통해 관련 정보를 제공하고 있습니까?'
      }
    ],
    5: [
      {type: 'title', text: '5. 교육 및 역량 강화'},
      {
        type: 'subject',
        text: '기업은 임직원 및 협력사를 대상으로 인권 및 환경 관련 교육을 실시하고 있습니까?'
      },
      {
        type: 'question',
        text: '교육 프로그램은 정기적으로 업데이트되고 있습니까?'
      },
      {
        type: 'question',
        text: '교육 내용은 기업의 실사 정책과 연계되어 있습니까?'
      },
      {
        type: 'question',
        text: '교육 참여율 및 효과를 평가하고 있습니까?'
      },
      {
        type: 'subject',
        text: '협력사 및 공급망 전반에 걸친 역량 강화 활동을 지원하고 있습니까?'
      },
      {
        type: 'question',
        text: '협력사 대상 교육 및 워크숍을 운영하고 있습니까?'
      },
      {
        type: 'question',
        text: '역량 강화 활동의 성과를 모니터링하고 있습니까?'
      }
    ],
    6: [
      {type: 'title', text: '6. 내부 관리 및 책임 체계'},
      {
        type: 'subject',
        text: '기업 내에서 실사 관련 책임과 권한이 명확히 정의되어 있습니까?'
      },
      {
        type: 'question',
        text: '실사 업무를 담당하는 전담 조직이나 부서가 있습니까?'
      },
      {
        type: 'question',
        text: '경영진이 실사 활동에 적극적으로 참여하고 있습니까?'
      },
      {
        type: 'question',
        text: '실사 결과 및 시정 조치 현황을 경영진에게 정기적으로 보고하고 있습니까?'
      },
      {
        type: 'subject',
        text: '내부 감사 및 평가를 통해 실사 활동의 효과성을 점검하고 있습니까?'
      },
      {
        type: 'question',
        text: '내부 감사 결과에 따라 개선 조치를 취하고 있습니까?'
      },
      {
        type: 'question',
        text: '실사 관련 문서 및 기록을 체계적으로 관리하고 있습니까?'
      }
    ],
    7: [
      {type: 'title', text: '7. 지속 가능성 및 개선 노력'},
      {
        type: 'subject',
        text: '기업은 지속 가능한 공급망 관리를 위해 노력하고 있습니까?'
      },
      {
        type: 'question',
        text: '장기적인 목표와 전략을 수립하고 있습니까?'
      },
      {
        type: 'question',
        text: '지속 가능성 목표 달성을 위한 구체적인 계획을 가지고 있습니까?'
      },
      {
        type: 'question',
        text: '지속 가능성 관련 성과를 정기적으로 평가하고 있습니까?'
      },
      {
        type: 'subject',
        text: '기업은 지속적인 개선을 위해 외부 전문가 및 이해관계자와 협력하고 있습니까?'
      },
      {
        type: 'question',
        text: '외부 감사 및 평가를 수용하고 있습니까?'
      },
      {
        type: 'question',
        text: '지속 가능성 관련 최신 동향과 법규를 모니터링하고 있습니까?'
      }
    ]
  }

  return (
    <div className="flex flex-col w-full h-full p-8">
      <div className="flex flex-row px-2 mb-4 text-base font-medium text-black">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/csddd">공급망 실사</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>EU 공급망 실사</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="w-full mx-auto max-w-7xl">
        <h1 className="text-lg font-bold text-center">
          환경 실사 지침 요구사항 이행 자가진단
        </h1>

        {(() => {
          const stepItems = questions[step.toString()] || []
          const elements = [] as JSX.Element[]
          let section: JSX.Element[] = []

          stepItems.forEach((item, i) => {
            const key = `q${step}-${i}`
            if (item.type === 'title') {
              if (section.length) {
                elements.push(
                  <div
                    key={`section-${key}`}
                    className="p-4 mb-6 space-y-4 bg-white border rounded-lg">
                    {section}
                  </div>
                )
                section = []
              }
              elements.push(renderItem(item, key))
            } else if (item.type === 'subject') {
              if (section.length) {
                elements.push(
                  <div
                    key={`section-${key}`}
                    className="p-4 mb-6 space-y-4 bg-white border rounded-lg">
                    {section}
                  </div>
                )
                section = []
              }
              section.push(renderItem(item, key))
            } else if (item.type === 'question') {
              section.push(renderItem(item, key))
            }
          })

          if (section.length) {
            elements.push(
              <div
                key={`section-final`}
                className="p-4 mb-6 space-y-4 bg-white border rounded-lg">
                {section}
              </div>
            )
          }

          return elements
        })()}
      </div>
      <div className="flex justify-center pt-6 pb-10 gap-x-8">
        {step > 1 ? (
          <DashButton onClick={prev} width="w-24">
            이전
          </DashButton>
        ) : null}
        {step < 7 ? (
          <DashButton onClick={next} width="w-24">
            다음
          </DashButton>
        ) : (
          <DashButton
            onClick={async () => {
              const noAnswers = Object.entries(answers)
                .filter(([, v]) => v === 'no')
                .map(([k]) => k)

              localStorage.setItem('euddResults', JSON.stringify(noAnswers))

              try {
                await Promise.all(
                  noAnswers.map(async id => {
                    await axios.post(
                      'http://localhost:8080/api/v1/csdd/eudd',
                      {id, ...analysisData[id]},
                      {
                        headers: {'X-MEMBER-ID': '1'},
                        withCredentials: true
                      }
                    )
                  })
                )
              } catch (err) {
                console.error('API 저장 실패:', err)
              }
              window.location.href = '/eudd/result'
            }}
            width="w-24">
            저장
          </DashButton>
        )}
      </div>
    </div>
  )
}
