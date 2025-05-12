'use client'

import {useState, useEffect} from 'react'
import type {JSX} from 'react'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {cn} from '@/lib/utils'
import DashButton from '@/components/tools/dashButton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {fetchEuddResult, updateEuddAnswers} from '@/services/eudd'
import {showError, showSuccess} from '@/util/toast'
import {BadgeCheck, FileQuestion} from 'lucide-react' // 아이콘 추가

/**
 * EU 공급망 실사 지침 자가진단 페이지
 */
export default function EDDForm() {
  // 상태 관리
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [analysisData, setAnalysisData] = useState<Record<string, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // 초기 데이터 로드
  useEffect(() => {
    loadEuddData()

    // 초기에 모든 질문을 '예'로 설정
    const initialAnswers: Record<string, string> = {}
    Object.values(questions).forEach(items => {
      items.forEach(item => {
        if (item.type === 'question' && item.id) {
          initialAnswers[item.id] = 'yes'
        }
      })
    })

    setAnswers(initialAnswers)
  }, [])

  // 데이터 로드 함수
  const loadEuddData = async () => {
    try {
      const result = await fetchEuddResult()
      setAnalysisData(result)

      // 서버에서 가져온 데이터를 바탕으로 답변 업데이트
      if (Array.isArray(result) && result.length > 0) {
        const savedAnswers: Record<string, string> = {}
        result.forEach(item => {
          if (item.id) {
            // 서버에서 가져온 응답은 'no'로 설정 (문제 요구사항에 따라)
            savedAnswers[item.id] = 'no'
          }
        })
        setAnswers(prev => ({...prev, ...savedAnswers}))
      }

      setIsLoaded(true)
    } catch (err: any) {
      // 데이터가 없는 경우는 정상 케이스로 처리 (최초 진단 시)
      if (err?.response?.status === 404) {
        setIsLoaded(true)
        return
      }
      showError('자가진단 데이터를 불러오는데 실패했습니다.')
      setIsLoaded(true)
    }
  }

  // 네비게이션 함수
  const next = () => step < 7 && setStep(step + 1)
  const prev = () => setStep(prev => Math.max(prev - 1, 1))

  // 저장 함수
  const handleSave = async () => {
    try {
      setIsSubmitting(true)

      // 답변 형식 변환 (yes/no 문자열 -> boolean)
      const formattedAnswers: Record<string, boolean> = Object.fromEntries(
        Object.entries(answers).map(([questionId, answer]) => [
          questionId,
          answer === 'yes'
        ])
      )

      // API 호출하여 답변 저장
      await updateEuddAnswers({
        answers: formattedAnswers
      })

      showSuccess('자가진단이 성공적으로 저장되었습니다.')

      // 결과 페이지로 이동
      window.location.href = '/CSDDD/eudd/result'
    } catch (err) {
      showError('자가진단 저장에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 질문 아이템 렌더링 함수
  const renderItem = (
    item: {type: string; text: string; id?: string},
    id: string
  ): JSX.Element => {
    if (item.type === 'title') {
      return (
        <h2 key={id} className="flex items-center text-lg font-bold text-gray-700">
          <BadgeCheck className="w-5 h-5 mr-2 text-customG" />
          {item.text}
        </h2>
      )
    }

    if (item.type === 'question') {
      const isBorderBottom = id !== questions[step.toString()]?.slice(-1)[0]?.id

      return (
        <div
          key={id}
          className={cn(
            'flex flex-col py-4 md:flex-row md:items-start gap-6',
            isBorderBottom ? 'border-b border-gray-100' : ''
          )}>
          <div className="flex md:w-[80%]">
            <FileQuestion className="flex-shrink-0 w-5 h-5 mt-1 mr-3 text-customG" />
            <p className="font-medium text-gray-700">
              <span className="text-sm font-bold text-customG">
                {id.split('-').slice(1).join('-')}
              </span>{' '}
              | {item.text}
            </p>
          </div>

          <div className="ml-auto">
            <RadioGroup
              value={answers[id] || 'yes'} // 기본값은 '예'
              orientation="horizontal"
              className="flex px-4 py-2 space-x-4 rounded-lg bg-gray-50"
              onValueChange={value => setAnswers(prev => ({...prev, [id]: value}))}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="yes"
                  id={`${id}-yes`}
                  className="border-customG text-customG focus:ring-customG"
                />
                <label
                  htmlFor={`${id}-yes`}
                  className={cn(
                    'text-sm font-medium',
                    answers[id] === 'yes' ? 'text-customG' : 'text-gray-600'
                  )}>
                  예
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="no"
                  id={`${id}-no`}
                  className="text-red-400 border-red-400 focus:ring-red-400"
                />
                <label
                  htmlFor={`${id}-no`}
                  className={cn(
                    'text-sm font-medium',
                    answers[id] === 'no' ? 'text-red-500' : 'text-gray-600'
                  )}>
                  아니요
                </label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )
    }

    return <></>
  }

  const questions: Record<
    string,
    {type: 'title' | 'question'; text: string; id?: string}[]
  > = {
    1: [
      {type: 'title', text: '1. 기업 정책 및 리스크 관리 시스템에 실사 내재화'},

      {
        type: 'question',
        id: 'EUDD-1-01',
        text: '실사 지침에는 실사에 대한 회사의 접근 방식에 대한 설명이 포함되어 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-1-02',
        text: '실사 지침에는 자체 운영, 자회사 및 직·간접적인 비즈니스 파트너가 준수해야 하는 행동강령이 포함되어 있습니까? '
      },
      {
        type: 'question',
        id: 'EUDD-1-03',
        text: '실사 지침에는 비즈니스 파트너의 행동강령 준수 여부 확인 및 실사 이행 프로세스에 대한 설명이 포함되어 있습니까? '
      },
      {
        type: 'question',
        id: 'EUDD-1-04',
        text: '실사 지침은 최소 24개월마다 정기적으로 업데이트됩니까?'
      },
      {
        type: 'question',
        id: 'EUDD-1-05',
        text: '중대한 변경 사항(신규 사업/제품 출시, M&A 등) 발생 시, 실사 지침을 업데이트하는 프로세스를 보유하고 있습니까? '
      },
      {
        type: 'question',
        id: 'EUDD-1-06',
        text: '실사 지침(정책) 제정 과정에서 공급망 실사 지침 과 유사한 관련 법령에 대한 지속적인 모니터링을 수행하고 있습니까? '
      },

      {
        type: 'question',
        id: 'EUDD-1-07',
        text: '이해관계자로부터 의견을 수렴하기 위한 의사소통 채널을 마련하고 있습니까? '
      },
      {
        type: 'question',
        id: 'EUDD-1-08',
        text: '이해관계자가 의견을 제시하는 과정에서 발생하는 보복 또는 보상을 방지하기 위한 절차를 마련하고 있습니까?'
      },

      {
        type: 'question',
        id: 'EUDD-1-09',
        text: '고충처리제도는 임직원 뿐만 아니라, 협력사와 고객 등 다양한 이해관계자들이 공개적으로 접근 할 수 있습니까? '
      },
      {
        type: 'question',
        id: 'EUDD-1-10',
        text: '고충을 접수한 제보자에 대한 기밀이 보장됩니까? '
      },
      {
        type: 'question',
        id: 'EUDD-1-11',
        text: '고충을 접수한 제보자에 대한 보복을 방지하기 위한 절차를 마련하고 있습니까? '
      },
      {
        type: 'question',
        id: 'EUDD-1-12',
        text: '고충이 접수되면, 고충에 대한 사실관계 확인, 결과 통보, 조치 등 적절한 사후 조치가 이루어지고 있습니까? '
      },
      {
        type: 'question',
        id: 'EUDD-1-13',
        text: '고충을 접수한 제보자에게 적절한 후속 조치를 요청하거나 기업 대표와 논의할 수 있는 권리가 부여되고 있습니까? '
      },
      {
        type: 'question',
        id: 'EUDD-1-14',
        text: '고충에 대한 구제조치가 마련되면, 향후 동일한 사례가 발생하지 않도록 적절한 개선 조치가 취해집니까? '
      }
    ],
    2: [
      {type: 'title', text: '2. 부정적 영향의 식별 및 우선순위화'},
      {
        type: 'question',
        id: 'EUDD-2-01',
        text: '자체 운영, 자회사 및 직·간접적인 비즈니스 파트너를 포함한 기업의 전체 활동 사슬을 파악하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-2-02',
        text: '중대한 변경 사항(신규 사업/제품 출시, M&A 등) 발생 또는 신규 공급업체 계약 시 활동 사슬을 업데이트합니까?'
      },
      {
        type: 'question',
        id: 'EUDD-2-03',
        text: '전체 활동 사슬 내의 실제·잠재적 부정적 영향을 식별하여 관리하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-2-04',
        text: '활동 사슬 내에서 각 부정적 영향이 발생할 수 있는 위치를 맵핑하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-2-05',
        text: '식별된 부정적 영향에 대한 우선순위를 도출하기 위한 평가 기준을 마련하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-2-06',
        text: '심각성(Severity)과 발생가능성(Likelihood)의 관점에서 각 부정적 영향의 크기를 정량적으로 평가하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-2-07',
        text: '우선순위의 평가 결과가 부정적 영향을 해결하기 위한 해결 방안의 우선순위를 설정하는 과정에 반영됩니까?'
      }
    ],
    3: [
      {type: 'title', text: '3. 실제·잠재적 부정적 영향 완화 및 종료 '},
      {
        type: 'question',
        id: 'EUDD-3-01',
        text: '잠재적인 부정적 영향이 발생할 수 있는 주체를 명확하게 파악하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-3-02',
        text: '잠재적인 부정적 영향이 자사만에 의해 발생한 것인지, 협력 과정에서 발생한 것인지 파악하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-3-03',
        text: '잠재적인 부정적 영향을 예방하고 완화하기 위한 조치를 마련하는 과정에서 부정적 영향을 발생시킨 주체의 상황 및 해당 주체에 대한 기업의 영향력을 고려하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-3-04',
        text: '잠재적인 부정적 영향 완화를 위한 개선 계획을 수립하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-3-05',
        text: '개선 계획 이행을 모니터링하기 위한 질적 또는 양적 지표를 개발하였습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-3-06',
        text: '잠재적인 부정적 영향 완화를 위해 적절한 수준의 투자를 이행하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-3-07',
        text: '직접 협력사와 계약상 보증을 체결하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-3-08',
        text: '직접 협력사와 계약상 보증을 체결하는 과정에서, 직접 협력사에게 하위 협력사와 동일한 계약상 보증을 체결하도록 요구하는 조항을 포함하도록 요구하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-3-09',
        text: '계약상 보증을 획득하기 위한 기업의 노력을 입증할 수 있는 활동을 문서화하여 기록하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-3-10',
        text: '단기간에 부정적 영향을 예방 또는 완화할 수 있을 것으로 예상되는 경우, 일시적으로 사업 관계를 중단하는 조치를 취하는 것을 고려하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-3-11',
        text: '부정적인 영향을 예방 또는 완화하기 어렵다고 판단하는 경우, 최후의 수단으로 협력사와의 거래 관계를 종료하는 것을 고려하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-3-12',
        text: '협력사와의 거래를 종료하는 경우, 거래를 지속하는 과정에서 발생하는 부정적 영향의 크기와 거래 중단 과정에서 발생하는 부정적 영향의 크기를 비교하는 절차를 마련하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-3-13',
        text: '검증 과정의 일환으로 산업 이니셔티브를 활용하거나 제3자 검증을 수행하고 있습니까?'
      }
    ],
    4: [
      {type: 'title', text: '4. 실사 모니터링 및 보고 체계'},
      {
        type: 'question',
        id: 'EUDD-4-01',
        text: '정기적인 모니터링을 통해 부정적 영향이 실제로 완화 및 종료되었는지 확인하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-4-02',
        text: '정기적인 모니터링을 통해 개선 계획의 이행도를 지속적으로 파악하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-4-03',
        text: '모니터링 결과에 따라 실사 지침(정책) 및 실사 수행 프로세스가 업데이트되고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-4-04',
        text: '연 1회 인권 및 환경 실사 보고서를 작성하여 자사의 웹사이트에 공시하고 있습니까?'
      }
    ],
    5: [
      {type: 'title', text: '5. 이해관계자 소통'},
      {
        type: 'question',
        id: 'EUDD-5-01',
        text: '실사 보고서는 해당 회원국에서 통용되는 언어 또는 국제 사회에서 통용되는 영어로 작성되었습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-5-02',
        text: 'EU 역외 소재 기업의 경우, 역내 공식 대표자(대리인)을 지정하고 대리인의 연락처 정보를 함께 제출하고 있습니까?'
      }
    ],
    6: [
      {type: 'title', text: '6. 구제 조치 마련'},
      {
        type: 'question',
        id: 'EUDD-6-01',
        text: '협력사 내에서 부정적 영향이 발생한 경우, 자발적으로 개선책을 제공하거나 구제조치를 마련하도록 요구하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-6-02',
        text: '기후 변화 완화를 위한 전환 계획을 수립하였습니까?'
      }
    ],
    7: [
      {type: 'title', text: '7. 기후 전환 계획'},
      {
        type: 'question',
        id: 'EUDD-7-01',
        text: '전환 계획에는 회사의 비즈니스 모델을 지속가능한 경제로 전환하는 목표가 포함되어 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-7-02',
        text: '전환 계획에는 파리 협정에 따라 지구 온난화를 1.5°C 미만으로 제한한다는 당사의 목표가 포함되어 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-7-03',
        text: '전환 계획에는 2050년까지 기후 중립을 달성하겠다는 당사의 목표가 포함되어 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-7-04',
        text: '과학적 근거에 기반하여, 2050년까지 5년 단위의 Scope 1, 2, 3 절대 배출량 감축 목표를 수립하였습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-7-05',
        text: '전환 계획 및 배출량 감축 목표 달성을 위한 기업의 이행 조치를 마련하고, 이를 이행하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-7-06',
        text: '전환 계획을 실행하기 위한 투자 재원을 마련하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-7-07',
        text: '전환 계획과 관련된 행정, 관리 및 감독의 역할을 수행하는 조직을 마련하고 있습니까?'
      },
      {
        type: 'question',
        id: 'EUDD-7-08',
        text: '이행 조치의 목표 달성도 및 조치의 효과성을 지속적으로 모니터링하고 있습니까?'
      }
    ]
  }

  // 로딩 중 표시
  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen">
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full border-t-customG animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">
          자가진단 데이터를 불러오는 중입니다...
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full h-full p-8">
      {/* 네비게이션 브레드크럼 */}
      <div className="flex flex-row px-2 mb-6 text-base font-medium text-black">
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

      {/* 메인 컨텐츠 */}
      <div className="w-full mx-auto max-w-7xl">
        <div className="p-6 mb-8 text-center bg-white rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-customG">
            EU 공급망 실사 지침 요구사항 이행 자가진단
          </h1>
          <p className="mt-2 text-gray-600">
            기업의 공급망 실사 준비 수준을 확인하고 개선할 수 있도록 도움을 제공합니다.
          </p>
        </div>

        {/* 단계 인디케이터 */}
        <div className="flex justify-center mb-8 space-x-3">
          {Array.from({length: 7}, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => setStep(n)}
              className={cn(
                'w-10 h-10 rounded-full text-sm font-medium border transition-colors flex items-center justify-center',
                step === n
                  ? 'bg-customG text-white border-customG shadow-md'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              )}>
              {n}
            </button>
          ))}
        </div>

        {/* 현재 단계 질문 렌더링 */}
        <div className="mb-8">
          {(() => {
            const stepItems = questions[step.toString()] || []
            const elements = [] as JSX.Element[]
            let section: JSX.Element[] = []

            stepItems.forEach((item, i) => {
              const key =
                item.type === 'question' && item.id ? item.id : `q${step}-title-${i}`

              if (item.type === 'title') {
                if (section.length) {
                  elements.push(
                    <div
                      key={`section-${key}`}
                      className="p-6 mb-8 space-y-4 bg-white border-0 rounded-lg shadow-sm">
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
                  className="p-6 mb-8 space-y-0 bg-white border-0 divide-y divide-gray-100 rounded-lg shadow-sm">
                  {section}
                </div>
              )
            }

            return elements
          })()}
        </div>

        {/* 진행 상태 표시 */}
        <div className="h-2 mb-6 overflow-hidden bg-gray-200 rounded-full">
          <div
            className="h-2 transition-all duration-300 bg-customG"
            style={{width: `${(step / 7) * 100}%`}}></div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-center pt-6 pb-10 gap-x-8">
          {step > 1 && (
            <DashButton
              onClick={prev}
              width="w-32"
              className="text-white bg-gray-600 border-2 border-gray-600 hover:bg-gray-700 hover:border-gray-700">
              이전 단계
            </DashButton>
          )}

          {step < 7 ? (
            <DashButton
              onClick={next}
              width="w-32"
              className="bg-customG hover:bg-customGDark">
              다음 단계
            </DashButton>
          ) : (
            <DashButton
              onClick={handleSave}
              disabled={isSubmitting}
              width="w-32"
              className="bg-customG hover:bg-customGDark">
              {isSubmitting ? '저장 중...' : '평가 완료'}
            </DashButton>
          )}
        </div>
      </div>
    </div>
  )
}
