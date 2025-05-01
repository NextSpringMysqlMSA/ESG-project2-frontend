'use client'

import {useState} from 'react'
import type {JSX} from 'react'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import DashButton from '@/components/dashButton'

export default function EDDForm() {
  const [step, setStep] = useState(1)

  const next = () => setStep(prev => Math.min(prev + 1, 8))
  const prev = () => setStep(prev => Math.max(prev - 1, 1))

  const renderItem = (item: {type: string; text: string}, id: string) => {
    if (item.type === 'title') {
      return (
        <h2 key={id} className="text-base font-semibold text-gray-600">
          {item.text}
        </h2>
      )
    }

    if (item.type === 'question') {
      const isLMOQuestion = item.text.includes('생명공학에 의해 생산된 유전자변형생물체')
      return (
        <div
          key={id}
          className={`flex flex-wrap items-center justify-between gap-6 py-2 ${
            isLMOQuestion ? '' : 'border-b'
          } md:flex-nowrap`}>
          <p className="font-medium max-w-[75%] break-words whitespace-pre-wrap">
            {item.text}
          </p>
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

    return null
  }

  const questions: Record<string, {type: 'title' | 'question'; text: string}[]> = {
    1: [
      {type: 'title', text: '1. 환경경영 시스템 구축'},
      {
        type: 'question',
        text: '전사가 추진하고 지향해야 할 환경 정책을 수립 하고 있습니까?'
      },
      {
        type: 'question',
        text: '환경경영을 담당하는 별도의 조직을 마련하고 있으며, 환경경영과 관련된 안건은 최고경영진에게까지 보고되고 있습니까?'
      },
      {
        type: 'question',
        text: '신규 사업을 수행하기에 앞서, 해당 사업의 환경 에 대한 리스크 평가(환경영향평가, 환경 인허가 획득 등)를 수행하고 있습니까?'
      }
    ],

    2: [
      {type: 'title', text: '2. 온실가스 및 에너지 관리'},
      {
        type: 'question',
        text: '온실가스 감축 관련 단기/중기/장기 목표를 수립하고 있습니까?'
      },
      {
        type: 'question',
        text: '온실가스 배출량(Scope 1, 2, 3)을 산정하고, 제3자를 통해 배출량을 검증받고 있습니까?'
      },
      {
        type: 'question',
        text: '에너지 소비량 관련 단기/중기/장기 목표를 수립하고 있습니까?'
      },
      {type: 'question', text: '에너지 소비량을 관리하고 있습니까?'},
      {
        type: 'question',
        text: '임직원 대상 온실가스 감축 및 에너지 절약 교육을 실시하고 있습니까?'
      },
      {
        type: 'question',
        text: '에너지 소비량 및 온실가스 배출량을 감축하기 위해 자체적으로 수행하고 있는 활동(공정 개선, 탄소 감축기술 도입, 재생에너지 사용 등)이 있습니까?'
      }
    ],

    3: [
      {type: 'title', text: '3. 물 관리'},
      {type: 'question', text: '용수 사용량 및 폐수 배출량을 관리하고 있습니까?'},
      {
        type: 'question',
        text: '용수 사용량을 감축하기 위해 자체적으로 수행 하는 활동(빗물 수집 시스템, 폐수 재활용 시스템 등)이 있습니까?'
      },
      {
        type: 'question',
        text: '사업장에서 배출되는 폐수의 품질을 평가하고 있으며, 폐수 내 오염물질을 저감시키기 위해 수행하고 있는 활동이 있습니까?'
      }
    ],
    4: [
      {type: 'title', text: '4. 오염물질 관리'},
      {
        type: 'question',
        text: '사업장에서 배출되는 대기오염물질(NOx, SOx, PM 등) 의 배출량을 관리하고 있습니까?'
      },
      {
        type: 'question',
        text: '사업장에서 배출되는 수질오염물질(COD, BOD, SS 등) 배출량을 관리하고 있습니까?'
      },
      {
        type: 'question',
        text: '사업장에서 배출되는 대기, 수질오염물질을 저감 하기 위해 자체적으로 수행하는 활동(정기적인 소음 및 악취 측정, 바이오필터 도입 등)이 있습니까?'
      }
    ],
    5: [
      {type: 'title', text: '5. 유해화학물질 관리'},
      {
        type: 'question',
        text: '오존층 파괴물질 등을 포함한 유해화학물질을 사용하는 경우, 해당 물질의 라벨을 지정하고 보관, 취급 및 운송에 대한 전 과정을 모니터링 하고 있습니까?'
      },
      {
        type: 'question',
        text: '사업을 영위하는 과정에서 수은 첨가제품, 잔류성 유기 오염물질을 생산, 수입 또는 수출하는 경우, 해당물질의사용을대체및제거하기위해뚜렷한 시점을 포함한 계획을 수립하고 있습니까?'
      },
      {
        type: 'question',
        text: '보관 또는 사용 허가가 필요한 유해화학물질을 사용, 수입 또는 수출하는 경우, 해당 관할 당국 으로부터 승인된 법적 절차에 따라 처리하고 있습니까?'
      },
      {
        type: 'question',
        text: '유해화학물질 관리에 대한 책임자를 지정하고, 해당 책임자를 대상으로 유해물질을 안전하게 취급 및 관리할 수 있도록 관련 교육을 제공하고 있습니까?'
      },
      {
        type: 'question',
        text: '유해화학물질을 사용하는 경우, 화평법, 화관법 또는 EU REACH 규정에 따라, 등록이 필요한 모든 화학물질에 대한 등록을 수행하였습니까?'
      },
      {
        type: 'question',
        text: '유해화학물질을 사용하는 경우, 화평법, 화관법 또는 EU REACH 규정에 따라, 이해관계자를 대상으로 안전보건자료를 제공하고 있습니까?'
      },
      {
        type: 'question',
        text: '사업을 영위하는 과정에서 선박을 운영하는 경우, 선박으로부터 기름 또는 유성혼합물, 유독성 액체물질, 하수에 대한 해양 배출을 방지하기 위해 수행되는 활동이 있습니까?'
      }
    ],
    6: [
      {type: 'title', text: '6. 폐기물 관리'},
      {
        type: 'question',
        text: '사업장에서 발생하는 폐기물을 감축하기 위해 자체적으로 수행하는 활동(폐기물 재활용 체계 구축 등)이 있습니까?'
      },
      {
        type: 'question',
        text: '사업장 내의 폐기물 흐름에 따른 폐기물 발생 위치를 파악하고 있습니까?'
      },
      {
        type: 'question',
        text: '현지 당국으로부터 승인을 받은 제3자 폐기물 관리/처리 회사를 통해 일반폐기물을 처리하고 있습니까?'
      },
      {
        type: 'question',
        text: '바젤 협약에 비준한 국가를 대상으로 수출입이 규제 되는 폐기물을 수출하는 경우, 수입국의 사전 서면 동의를 획득하기 위한 절차를 마련하고 있습니까?'
      }
    ],
    7: [
      {type: 'title', text: '7. 친환경 제품'},
      {
        type: 'question',
        text: '친환경 제품 인증을 획득하였거나, 친환경 제품 개발을 위한 투자가 이루어지고 있습니까?'
      },
      {type: 'question', text: '제품 원부자재 사용량을 관리하고 있습니까?'}
    ],
    8: [
      {type: 'title', text: '8. 생물다양성 보호'},
      {
        type: 'question',
        text: '세계문화유산, 람사르습지 등 생물다양성에 민감한 지역 근처에 사업장을 보유하고 있지 않습니까?'
      },
      {
        type: 'question',
        text: '야생 동식물을 수입 또는 수출하는 경우, 수입허가서 또는 수출허가서를 획득하고 있습니까?'
      },
      {
        type: 'question',
        text: '사업을 영위하는 과정에서 자국 외 유전자원에 접근하는 경우, 유전자원 제공국으로부터 사전승인을 획득하고 있습니까?'
      },
      {
        type: 'question',
        text: '자국 외 국가의 유전자원으로부터 유전자원을 획득하는 경우, 해당 과정에서 발생하는 이익을 제공국과 공유하고 있습니까?'
      },
      {
        type: 'question',
        text: '유전자변형생물체(LMOs)*를 생산하는 경우, LMOs에 대한 위해성 평가를 수행하고 있습니까? '
      }
    ]
  }

  return (
    <div className="flex flex-col w-full h-full p-8">
      <div className="w-full mx-auto max-w-7xl">
        <h1 className="text-lg font-bold text-center">
          환경 실사 지침 요구사항 이행 자가진단
        </h1>

        {(() => {
          const stepItems = questions[step.toString()] || []
          const elements: JSX.Element[] = []
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
            } else if (item.type === 'question') {
              section.push(renderItem(item, key))
            }
          })

          if (section.length) {
            elements.push(
              <div
                key="section-final"
                className="p-4 mb-6 space-y-4 bg-white border rounded-lg">
                {section}
                {step === 8 && (
                  <p className="pt-2 text-xs text-left text-gray-500">
                    * 생명공학에 의해 생산된 유전자변형생물체(LMOs, Living Modified
                    Organisms)
                  </p>
                )}
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
        {step < 8 ? (
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
