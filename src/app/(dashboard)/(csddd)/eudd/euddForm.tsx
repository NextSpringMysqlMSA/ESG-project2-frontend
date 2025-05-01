'use client'

import {useState} from 'react'
import type {JSX} from 'react'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import DashButton from '@/components/dashButton'

export default function EDDForm() {
  const [step, setStep] = useState(1)

  const next = () => setStep(prev => Math.min(prev + 1, 7))
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
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2 border-b">
          <p className="font-medium md:max-w-[80%]">{item.text}</p>
          <RadioGroup orientation="horizontal" className="flex space-x-1">
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
      {type: 'title', text: '2. 부정적 영향의 식별 및 우선순위화'},
      {
        type: 'subject',
        text: 'EU 공급망 실사 지침에서 요구하는 전체 실사 범위에 대한 부정적 영향을 파악하고 있습니까?'
      },
      {
        type: 'question',
        text: '자체 운영, 자회사 및 직·간접적인 비즈니스 파트너를 포함한 기업의 전체 활동 사슬을 파악 하고 있습니까? '
      },
      {
        type: 'question',
        text: '중대한 변경 사항(신규 사업/제품 출시, M&A 등) 발생 또는 신규 공급업체 계약 시 활동 사슬을 업데이트합니까? '
      },
      {
        type: 'question',
        text: '전체 활동 사슬 내의 실제·잠재적 부정적 영향을 식별하여 관리하고 있습니까? '
      },
      {
        type: 'question',
        text: '활동 사슬 내에서 각 부정적 영향이 발생할 수 있는 위치를 맵핑하고 있습니까? '
      },

      {type: 'subject', text: '식별된 부정적 영향에 대한 우선순위를 평가하고 있습니까?'},
      {
        type: 'question',
        text: '식별된 부정적 영향에 대한 우선순위를 도출하기 위한 평가 기준을 마련하고 있습니까?'
      },
      {
        type: 'question',
        text: '심각성(Severity)과 발생가능성(Likelihood)의 관점에서 각 부정적 영향의 크기를 정량적으로 평가하고 있습니까?'
      },
      {
        type: 'question',
        text: '우선순위의 평가 결과가 부정적 영향을 해결하기 위한 해결 방안의 우선순위를 설정하는 과정에 반영됩니까?'
      }
    ],

    3: [
      {type: 'title', text: '3. 실제·잠재적 부정적 영향 완화 및 종료'},

      {
        type: 'subject',
        text: '실사 지침의 이행 전 과정에 걸쳐 다양한 이해관계자(임직원, 고객, 협력사, 주주·투자자, 정부 등)를 참여시키고 있습니까?'
      },
      {
        type: 'question',
        text: '잠재적인 부정적 영향이 발생할 수 있는 주체를 명확하게 파악하고 있습니까?'
      },
      {
        type: 'question',
        text: '잠재적인 부정적 영향이 자사만에 의해 발생한 것인지, 협력 과정에서 발생한 것인지 파악하고 있습니까?'
      },
      {
        type: 'question',
        text: '잠재적인 부정적 영향을 예방하고 완화하기 위한 조치를 마련하는 과정에서 부정적 영향을 발생 시킨 주체의 상황 및 해당 주체에 대한 기업의 영향력을 고려하고 있습니까?'
      },
      {
        type: 'question',
        text: '잠재적인 부정적 영향 완화를 위한 개선 계획을 수립하고 있습니까?'
      },
      {
        type: 'question',
        text: '개선 계획 이행을 모니터링하기 위한 질적 또는 양적 지표를 개발하였습니까?'
      },
      {
        type: 'question',
        text: '잠재적인 부정적 영향 완화를 위해 적절한 수준의 투자를 이행하고 있습니까?'
      },

      {type: 'subject', text: '협력사를 대상으로 계약상 보증을 체결하고 있습니까?'},
      {type: 'question', text: '직접 협력사와 계약상 보증을 체결하고 있습니까?'},
      {
        type: 'question',
        text: '직접 협력사와 계약상 보증을 체결하는 과정에서, 직접 협력사에게 하위 협력사와 동일한 계약상 보증을 체결하도록 요구하는 조항을 포함하도록 요구하고 있습니까?'
      },
      {
        type: 'question',
        text: '계약상 보증을 획득하기 위한 기업의 노력을 입증할 수 있는 활동을 문서화하여 기록하고 있습니까?'
      },

      {
        type: 'subject',
        text: '부정적 영향에 대한 예방 또는 완화 가능성 여부에 따라, 협력사와의 거래 관계를 조정하고 있습니까?'
      },
      {
        type: 'question',
        text: '단기간에부정적영향을예방또는완화할수있을 것으로 예상되는 경우, 일시적으로 사업 관계를 중단하는 조치를 취하는 것을 고려하고 있습니까?'
      },
      {
        type: 'question',
        text: '부정적인 영향을 예방 또는 완화하기 어렵다고 판단하는 경우, 최후의 수단으로 협력사와의 거래 관계를 종료하는 것을 고려하고 있습니까?'
      },
      {
        type: 'question',
        text: '협력사와의 거래를 종료하는 경우, 거래를 지속 하는 과정에서 발생하는 부정적 영향의 크기와 거래 중단 과정에서 발생하는 부정적 영향의 크기를 비교하는 절차를 마련하고 있습니까?'
      },

      {
        type: 'subject',
        text: '부정적 영향에 대한 조치(계약상 보증 포함)를 마련하는 과정에서 검증을 활용하고 있습니까?'
      },
      {
        type: 'question',
        text: '검증 과정의 일환으로 산업 이니셔티브를 활용 하거나 제3자 검증을 수행하고 있습니까?'
      }
    ],

    4: [
      {type: 'title', text: '4. 부정적 영향의 식별 및 우선순위화'},
      {
        type: 'subject',
        text: '실사 프로세스, 부정적 영향 완화 및 종료를 위해 시행되는 조치에 대한 정기적 모니터링을 수행하고 있습니까?'
      },
      {
        type: 'question',
        text: '정기적인 모니터링을 통해 부정적 영향이 실제로 완화 및 종료되었는지 확인하고 있습니까?'
      },
      {
        type: 'question',
        text: '정기적인 모니터링을 통해 개선 계획의 이행도를 지속적으로 파악하고 있습니까?'
      },
      {
        type: 'question',
        text: '모니터링 결과에 따라 실사 지침(정책) 및 실사 수행 프로세스가 업데이트되고 있습니까?'
      }
    ],
    5: [
      {type: 'title', text: '5. 이해관계자 소통'},
      {
        type: 'subject',
        text: '연 1회 인권 및 환경 실사 보고서를 작성하여 자사의 웹사이트에 공시하고 있습니까?'
      },
      {
        type: 'question',
        text: '실사 보고서는 해당 회원국에서 통용되는 언어 또는 국제 사회에서 통용되는 영어로 작성 되었습니까?'
      },
      {
        type: 'question',
        text: 'EU 역외 소재 기업의 경우, 역내 공식 대표자 (대리인)을 지정하고 대리인의 연락처 정보를 함께 제출하고 있습니까?'
      }
    ],

    6: [
      {type: 'title', text: '6. 구제조치 마련'},
      {
        type: 'subject',
        text: '활동 사슬 내에서 실제로 발생한 부정적 영향에 대한 구제조치를 제공하고 있습니까?'
      },
      {
        type: 'question',
        text: '협력사 내에서 부정적 영향이 발생한 경우, 자발적으로 개선책을 제공하거나 구제조치를 마련하도록 요구하고 있습니까?'
      }
    ],

    7: [
      {type: 'title', text: '7. 기후 전환 계획'},
      {
        type: 'subject',
        text: '전환 계획에는 회사의 비즈니스 모델을 지속가능한 경제로 전환하는 목표가 포함되어 있습니까?'
      },
      {
        type: 'question',
        text: '전환 계획에는 파리 협정에 따라 지구 온난화를 1.5oC 미만으로 제한한다는 당사의 목표가 포함 되어 있습니까?'
      },
      {
        type: 'question',
        text: '전환 계획에는 2050년까지 기후 중립을 달성 하겠다는 당사의 목표가 포함되어 있습니까?'
      },
      {
        type: 'question',
        text: '과학적 근거에 기반하여, 2050년까지 5년 단위 의 Scope 1, 2, 3 절대 배출량 감축 목표를 수립 하였습니까?'
      },
      {
        type: 'question',
        text: '전환계획및배출량감축목표달성을위한기업의 이행 조치를 마련하고, 이를 이행하고 있습니까?'
      },
      {
        type: 'question',
        text: '전환 계획을 실행하기 위한 투자 재원을 마련하고 있습니까?'
      },
      {
        type: 'question',
        text: '전환 계획과 관련된 행정, 관리 및 감독의 역할을 수행하는 조직을 마련하고 있습니까?'
      },
      {
        type: 'question',
        text: '이행 조치의 목표 달성도 및 조치의 효과성을 지속적으로 모니터링하고 있습니까?'
      }
    ]
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#F9FBFF] p-8">
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
              // Flush any open section before a new title
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
              // Flush any open section before a new subject
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
        ) : (
          <div className="w-24" />
        )}
        {step < 7 ? (
          <DashButton onClick={next} width="w-24">
            다음
          </DashButton>
        ) : (
          <DashButton onClick={() => alert('제출 완료')} width="w-24">
            저장
          </DashButton>
        )}
      </div>
    </div>
  )
}
