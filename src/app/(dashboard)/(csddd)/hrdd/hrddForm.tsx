'use client'

import {useState} from 'react'
import type {JSX} from 'react'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import DashButton from '@/components/dashButton'

export default function HRDDForm() {
  const [step, setStep] = useState(1)

  const next = () => setStep(prev => Math.min(prev + 1, 9))
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
      return (
        <div
          key={id}
          className="flex flex-wrap md:flex-nowrap items-start justify-between gap-4 py-2 border-b">
          <p className="font-medium md:max-w-[75%]">{item.text}</p>
          <RadioGroup orientation="horizontal" className="flex space-x-3 md:pt-1">
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="yes" id={`${id}-yes`} />
              <label htmlFor={`${id}-yes`}>예</label>
            </div>
            <div className="flex items-center space-x-1">
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
      {type: 'title', text: '1. 생명과 안전에 대한 관리'},
      {
        type: 'question',
        text: '안전보건 정책(안전보건 지침 포함)을 보유하고 있으며, 해당 정책은 자체 운영 뿐만 아니라 하청업체에 의해 수행되는 모든 활동을 포함하고 있습니까?'
      },
      {
        type: 'question',
        text: '사업장 내 안전보건관리 책임자를 별도로 지정 하고 있습니까?'
      },
      {
        type: 'question',
        text: '임직원이 작업 안전 및 건강 사고와 관련된 우려 사항을 제기할 수 있는 신고 채널을 마련하고 있습니까?'
      },
      {
        type: 'question',
        text: '임직원을 대상으로 산업안전에 관한 교육을 정기적으로 실시하고 있습니까?'
      },
      {
        type: 'question',
        text: '근로자들의 안전 및 보건에 영향을 미칠 수 있는 유해인자(유해물질, 소음 등)를 해소하기 위한 목적으로 사업장 내에서 수행되고 있는 프로그램이 있습니까?'
      },
      {
        type: 'question',
        text: '사업장 내 안정장구 및 안전시설에 대한 정기적인 점검을 시행하고 있습니까?'
      },
      {
        type: 'question',
        text: '근로자의 직무수행에 필요한 안전보호장구를 제공하고 있습니까?'
      },
      {type: 'question', text: '사업장 내 비상대응체계를 구축하고 있습니까?'},
      {
        type: 'question',
        text: '사업장 내 안전 관련 지침을 게시하고 있으며, 외국인 근로자가 존재하는 경우 해당 근로자의 국적에 맞는 언어로 작성되어 있습니까?'
      },
      {type: 'question', text: '전체 임직원을 대상으로 건강진단을 실시하고 있습니까?'},
      {
        type: 'question',
        text: '정기적으로 사업장의 위험성 평가*를 수행하고 있습니까?'
      },
      {
        type: 'question',
        text: '근로자가 업무상 부상을 당하거나 질병에 걸린 경우, 요양비를 부담하고 있습니까?'
      }
    ],

    2: [
      {type: 'title', text: '2. 차별 및 괴롭힘 금지'},
      {
        type: 'question',
        text: '인권 정책 또는 인권 정책에 상응하는 지침을 보유하고 있으며, 인권 정책은 성별, 종교, 장애, 나이, 사회적 신분, 출신 등을 이유로 차별을 금지 하는 조항을 포함하고 있습니까?'
      },
      {
        type: 'question',
        text: '인권 정책 또는 인권 정책에 상응하는 지침을 보유하고 있으며, 인권 정책은 괴롭힘, 성희롱, 신체적 차별 등 직장 내 괴롭힘을 금지하는 조항을 포함하고 있습니까?'
      },
      {
        type: 'question',
        text: '임직원을 대상으로 다양성, 차별 및 괴롭힘 문제에 대한 인식 교육을 수행하고 있습니까?'
      },
      {
        type: 'question',
        text: '장애인 근로자 고용에 대한 법적 기준을 충족하고 있습니까?'
      },
      {
        type: 'question',
        text: '직장 내 소수자/취약계층을 지원하기 위한 별도의 조직을 마련하여 운영하고 있습니까?'
      },
      {
        type: 'question',
        text: '고충처리제도를 운영하고 있으며, 신고자에 대한 보복을 방지하기 위한 프로세스를 마련하고 있습니까?'
      }
    ],

    3: [
      {type: 'title', text: '3. 아동 노동 금지'},
      {
        type: 'question',
        text: '회사는 근로기준법에 따른 연소자*를 고용하지 않으며, 근로자의 고용 과정에서 근로자의 나이를 확인하는 절차를 마련하고 있습니까?'
      },
      {
        type: 'question',
        text: '취직인허증을 발급 받은 연소자를 고용하는 경우, 해당 연소자가 건강이나 안전, 도덕의식에 해로운 일을 수행하지 않도록 근로계약서를 통해 보장 하고 있습니까?'
      },
      {
        type: 'question',
        text: '취직인허증을 발급 받은 연소자를 고용하는 경우, 해당 연소자의 근무환경과 근무현황을 정기적 으로 모니터링하고 있습니까?'
      }
    ],

    4: [
      {type: 'title', text: '4. 강제 노동 금지'},
      {
        type: 'question',
        text: '인권 정책 또는 인권 정책에 상응하는 지침을 보유 하고 있으며, 인권 정책은 모든 종류/형태의 강제 노동을 금지하는 조항을 포함하고 있습니까?'
      },
      {
        type: 'question',
        text: '회사는 특히 외국인 노동자를 포함하여, 근로자의 행동을 제약할 목적으로 신분증명서, 여행문서 등 중요한 개인문서롤 보관하지 않고 있습니까?'
      }
    ],

    5: [
      {type: 'title', text: '5. 근로 조건'},
      {
        type: 'question',
        text: '근로조건과 관련하여 노사간 자유로운 의견 개진 이 가능한 소통 채널(타운홀 미팅 등)을 운영하고 있습니까?'
      },
      {
        type: 'question',
        text: '전체 임직원(정규직 근로자, 비정규직 근로자, 시간제 근로자 등)을 대상으로 근로계약서를 작성하고 있습니까?'
      },
      {type: 'question', text: '근로계약서 내, 필수 기재사항*이 모두 포함되어 있습니까?'},
      {
        type: 'question',
        text: '외국인 임직원에게 모국어로 작성된 근로계약서를 제공하고 있습니까?'
      },
      {
        type: 'question',
        text: '근로자 임금산정에 대한 기준을 마련하고 있으며, 해당 기준은 모든 임직원에게 적용되고 있습니까?'
      },
      {
        type: 'question',
        text: '전체 임직원을 대상으로 관계법령에서 요구하는 법정 최저임금을 보장하고 있습니까?'
      },
      {
        type: 'question',
        text: '성별 등 근로자의 조건과 관계 없이, 동일 노동에 대한 동일 수준의 임금을 제공하고 있습니까?'
      },
      {
        type: 'question',
        text: '근로자들의 정규 및 초과근무 시간을 기록하고 관리할 수 있는 내부 프로세스(근태관리시스템 등)를 마련하고 있습니까?'
      },
      {
        type: 'question',
        text: '근로자의 연장근로에 따른 적법한 보상 체계*를 마련하고 있습니까?'
      },
      {
        type: 'question',
        text: '전체 임직원을 대상으로 근로시간 4시간마다 30분 이상의 휴게시간을 보장하고 있습니까?'
      },
      {
        type: 'question',
        text: '임산부 또는 출산 후 1년 미만의 여성근로자에 대한 근로시간 제한 정책을 마련하고 있습니까?'
      },
      {
        type: 'question',
        text: '전체 임직원을 대상으로 근로기준법에 명시되어 있는 유급휴가 기준에 따른 유급 휴가를 제공하고 있습니까?'
      },
      {
        type: 'question',
        text: '직장 내 소수자/취약계층을 지원하기 위한 별도의 조직을 마련하여 운영하고 있습니까?'
      },
      {
        type: 'question',
        text: '고충처리제도를 운영하고 있으며, 신고자에 대한 보복을 방지하기 위한 프로세스를 마련하고 있습니까?'
      },
      {type: 'question', text: '근로자 권리 보호를 위한 교육을 실시하고 있습니까?'}
    ],

    6: [
      {type: 'title', text: '6. 결사 및 단체교섭의 자유 보장'},
      {
        type: 'question',
        text: '회사는 근로계약서 또는 이에 상응하는 지침을 통해, 근로자들의 결사의 자유와 단체교섭의 자유*를 보장하고 있습니까?'
      },
      {
        type: 'question',
        text: '회사는 근로계약서 또는 이에 상응하는 지침을 통해, 근로자가 노동조합 조직 또는 노동조합 활동을 이유로 불이익을 주지 않는다는 점을 명시하고 있습니까?'
      },
      {
        type: 'question',
        text: '회사는 단체협상을 시작하기에 앞서, 근로자 대표에게 단체협상에 필요한 정보(기업의 실적과 현황 등)를 제공하고 있습니까?'
      },
      {
        type: 'question',
        text: '경영상의 이유로 불가피한 해고를 해야 하는 경우, 노동조합 또는 근로자 대표에게 사전에 통보하고 있습니까?'
      },
      {
        type: 'question',
        text: '노동자 대표가 단체협상을 요구하는 경우, 실질적 으로 의사결정권이 있는 회사의 대표와 협상하고 있습니까?'
      }
    ],

    7: [
      {type: 'title', text: '7. 개인정보 침해 금지'},
      {
        type: 'question',
        text: '제3자가 회사에게 고객 및 임직원에 대한 개인 정보를 요청한 경우, 해당 인원을 대상으로 사전 동의를 획득하고 있습니까?'
      },
      {type: 'question', text: '임직원을 대상으로 정보보안 교육을 실시하고 있습니까?'},
      {
        type: 'question',
        text: '정기적으로 개인정보 리스크에 대한 보안 점검을 실시하고 있습니까?'
      },
      {
        type: 'question',
        text: '개인정보의 처리, 공유 및 보관에 대해, 해당 당사자 로부터 동의를 얻는 절차를 마련하고 있습니까?'
      }
    ],
    8: [
      {type: 'title', text: '8. 환경 악화를 초래하는 행위 금지'},
      {
        type: 'question',
        text: '사업장 주변의 환경과 관련된 정보를 수집하고 평가하기 위한 프로세스를 마련하고 있습니까?'
      },
      {
        type: 'question',
        text: '환경개선을 위해 관계 법령을 고려한 측정 가능한 목표를 설정하고, 해당 목표의 이행 정도를 모니터링하고 있습니까?'
      },
      {
        type: 'question',
        text: '전체 임직원을 대상으로 환경과 관련된 교육을 제공하고 있습니까?'
      },
      {
        type: 'question',
        text: '새로운 제품 또는 사업의 확장을 고려하는 경우, 환경에 미치는 영향을 고려하기 위해 환경영향 평가를 실시하고 있습니까?'
      },
      {
        type: 'question',
        text: '임직원을 대상으로 비상사태 대응지침에 대한 훈련을 정기적으로 실시하고 있습니까?'
      }
    ],
    9: [
      {type: 'title', text: '9. 토지 및 자원 이용에 대한 지역사회 권리 보장'},
      {
        type: 'question',
        text: '회사는 부지를 구매하기 이전에, 해당 부지의 법률상 소유자와 토지 소유권 이전에 따라 피해를 입을 수 있는 이해관계자를 확인하는 절차를 보유하고 있습니까?'
      },
      {
        type: 'question',
        text: '회사는 부지를 구매하는 과정에서 이주를 해야 하는 주민들이 발생한 경우, 해당 주민들에게 피해에 상응하는 수준의 보상을 제공하고 있습니까?'
      },
      {
        type: 'question',
        text: '회사는 타인의 지식을 이용하기 이전에, 해당 지식이 지적재산권 또는 관습적으로 보호되는 대상인지 사전에 검토하고 있습니까?'
      },
      {
        type: 'question',
        text: '회사는 지적재산권의 소유자와 협상하는 경우 소유자로부터 설명 있는 동의를 얻으며, 지적 재산권 사용에 따른 보상을 제공하고 있습니까?'
      }
    ]
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#F9FBFF] p-8">
      <div className="w-full mx-auto max-w-7xl">
        <h1 className="text-lg font-bold text-center">
          인권 실사 지침 요구사항 이행 자가진단
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
                {step === 1 && (
                  <p className="pt-2 text-xs text-left text-gray-500">
                    * 위험성평가: &lt;사전준비-유해·위험요인파악-위험성결정- 위험성
                    감소대책 수립 및 실시 - 공유·기록&gt;의 순으로 수행되는 사업주가
                    스스로 유해ᆞ위험요인을 파악하고 해당 유해ᆞ위험요인의 위험성 수준을
                    결정하여, 위험성을 낮추기 위한 적절한 조치를 마련하고 실행하는 과정
                  </p>
                )}
                {step === 3 && (
                  <p className="pt-2 text-xs text-left text-gray-500">
                    * 연소자: 15세 미만인 자(「초·중등교육법」에 따른 중학교에 재학 중인
                    18세 미만인 자를 포함)
                  </p>
                )}
                {step === 5 && (
                  <>
                    <p className="pt-2 text-xs text-left text-gray-500">
                      * 필수 기재사항: 임금의 구성항목, 임금 지급방법, 소정근로 시간,
                      주휴일과 공휴적용휴일, 연차 유급휴가, 취업장소와 종사업무
                    </p>
                    <p className="pt-2 text-xs text-left text-gray-500">
                      * 연장근로에 대한 보상: 보상휴가 제공, 추가수당 제공 등
                    </p>
                  </>
                )}
                {step === 6 && (
                  <p className="pt-2 text-xs text-left text-gray-500">
                    * 결사의 자유와 단체교섭의 자유: 노동조합 설립 허용, 노동조합 부재 시
                    독립적인 노동관련 문제를 토론할 수 있는 대안적인 조치 허용 등
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
        {step < 9 ? (
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
