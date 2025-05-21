'use client'

import {useState, useEffect} from 'react'
import type {JSX} from 'react'
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
import {showError, showSuccess} from '@/util/toast'
import {BadgeCheck, ChevronRight, FileQuestion, Home} from 'lucide-react'
import {useRouter} from 'next/navigation'
import {fetchEuddResult, updateEuddAnswers} from '@/services/csddd'
import type {EuddViolationDto} from '@/types/IFRS/csddd'
import {AxiosError} from 'axios'
import {AnimatePresence, motion} from 'framer-motion'

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

/**
 * EU 공급망 실사 지침 자가진단 페이지
 */
export default function EuddForm() {
  // 상태 관리
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [analysisData, setAnalysisData] = useState<Record<string, EuddViolationDto>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // 초기 데이터 로드
  useEffect(() => {
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
    loadEuddData()
  }, [])

  /**
   * 데이터 로드 함수
   * - 기존 저장된 결과가 있으면 가져와서 표시
   * - 서버 응답에서 'no' 응답(위반 항목)만 가져옴
   * - 데이터를 ID 기준 객체로 변환하여 효율적인 참조 가능
   */
  const loadEuddData = async () => {
    try {
      // 서버에서 기존 저장된 결과 가져오기
      const result = await fetchEuddResult()

      // 결과 데이터를 ID 기반 객체로 변환
      const mappedData: Record<string, EuddViolationDto> = {}

      if (Array.isArray(result) && result.length > 0) {
        // 초기화된 응답 객체 생성
        const savedAnswers: Record<string, string> = {}

        // 서버 데이터 처리
        result.forEach(item => {
          if (item.id) {
            // ID 기반 객체로 변환
            mappedData[item.id] = item

            // 서버에서 가져온 항목은 'no' 응답 (위반 항목)
            savedAnswers[item.id] = 'no'
          }
        })

        // 응답 상태 업데이트 (기존 상태와 통합)
        setAnswers(prev => ({...prev, ...savedAnswers}))
      }

      // 분석 데이터 상태 업데이트
      setAnalysisData(mappedData)
      setIsLoaded(true)
    } catch (err) {
      const error = err as AxiosError
      // 데이터가 없는 경우는 정상 케이스로 처리 (최초 진단 시)
      if (error.response?.status === 404) {
        setIsLoaded(true)
        return
      }
      console.error('데이터 로드 오류:', err)
      showError('자가진단 데이터를 불러오는데 실패했습니다.')
      setIsLoaded(true)
    }
  }

  const router = useRouter()

  // 네비게이션 함수
  const next = () => step < 7 && setStep(step + 1)
  const prev = () => setStep(prevStep => Math.max(prevStep - 1, 1))

  /**
   * 자가진단 저장 함수
   * - '아니요'로 응답한 항목만 필터링하여 서버에 전송
   * - 응답은 저장 후 결과 페이지로 이동
   * - EU 공급망 실사 지침에서는 부정적 응답(위반 항목)만 저장하므로 'no' 응답만 서버에 전송
   */
  const handleSave = async (): Promise<void> => {
    try {
      setIsSubmitting(true)

      // '아니요' 응답만 필터링하여 서버에 전송
      const noAnswersOnly: Record<string, boolean> = Object.fromEntries(
        Object.entries(answers)
          .filter(([_, answer]) => answer === 'no')
          .map(([questionId, _]) => [questionId, false])
      )

      // API 호출하여 '아니요' 답변만 저장 (위반 항목)
      const result = await updateEuddAnswers({
        answers: noAnswersOnly
      })

      // 서버 응답 확인 후 성공 처리
      if (result) {
        showSuccess('자가진단이 성공적으로 저장되었습니다.')
        // 결과 페이지로 이동
        router.push('/CSDDD/eudd/result')
      }
    } catch (err) {
      console.error('저장 오류:', err)
      showError('자가진단 저장에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * 질문 아이템 렌더링 함수
   * - 아이템 타입에 따라 제목 또는 질문 형태로 렌더링
   * - 질문 항목에는 라디오 버튼 그룹 제공 (예/아니오 선택)
   *
   * @param item - 렌더링할 항목 객체 (제목 또는 질문)
   * @param id - 항목 식별자
   * @returns JSX.Element - 렌더링된 항목 컴포넌트
   */
  // renderItem 함수 개선
  const renderItem = (
    item: {type: string; text: string; id?: string},
    id: string
  ): JSX.Element => {
    if (item.type === 'title') {
      return (
        <motion.h2
          key={id}
          initial={{opacity: 0, y: -5}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.4}}
          className="flex items-center mb-3 text-lg text-gray-700 font-gmBold">
          <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-customG/10">
            <BadgeCheck className="w-5 h-5 text-customG" />
          </div>
          {item.text}
        </motion.h2>
      )
    }

    if (item.type === 'question') {
      // 마지막 항목인지 확인하여 구분선 적용 여부 결정
      const isBorderBottom = id !== questions[step.toString()]?.slice(-1)[0]?.id

      return (
        <motion.div
          key={id}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.3}}
          className={cn(
            'flex flex-col py-4 md:flex-row md:items-start gap-4',
            isBorderBottom ? 'border-b border-gray-100' : ''
          )}>
          {/* 질문 내용 */}
          <div className="flex md:w-[80%] group">
            <div className="flex-shrink-0 mt-0.5 mr-3">
              <div className="flex items-center justify-center w-6 h-6 transition-colors rounded-full bg-customG/5 group-hover:bg-customG/10">
                <FileQuestion className="w-3.5 h-3.5 text-customG" />
              </div>
            </div>

            <p className="font-medium text-gray-700">
              <span className="mr-1 text-sm font-gmBold text-customG">
                {id.split('-').slice(1).join('-')}
              </span>
              <span className="mx-1 text-gray-500">|</span>
              {item.text}
            </p>
          </div>

          {/* 응답 선택 - EddForm과 동일한 스타일 적용 */}
          <div className="ml-auto">
            <div className="flex bg-gray-100 rounded-full shadow-sm">
              <button
                type="button"
                onClick={() => {
                  setAnswers(prev => ({...prev, [id]: 'yes'}))
                  // 클릭 효과 추가
                  const elem = document.getElementById(`btn-yes-${id}`)
                  if (elem) {
                    elem.classList.add('scale-105')
                    setTimeout(() => elem.classList.remove('scale-105'), 200)
                  }
                }}
                id={`btn-yes-${id}`}
                className={cn(
                  'w-[70px] h-[40px] rounded-full text-sm font-medium transition-all duration-200',
                  answers[id] === 'yes'
                    ? 'bg-customG text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600'
                )}>
                <span className="flex items-center justify-center">
                  {answers[id] === 'yes' && (
                    <motion.svg
                      initial={{scale: 0, opacity: 0}}
                      animate={{scale: 1, opacity: 1}}
                      transition={{duration: 0.2}}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-1">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  )}
                  예
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAnswers(prev => ({...prev, [id]: 'no'}))
                  // 클릭 효과 추가
                  const elem = document.getElementById(`btn-no-${id}`)
                  if (elem) {
                    elem.classList.add('scale-105')
                    setTimeout(() => elem.classList.remove('scale-105'), 200)
                  }
                }}
                id={`btn-no-${id}`}
                className={cn(
                  'w-[70px] h-[40px] rounded-full text-sm font-medium transition-all duration-200',
                  answers[id] === 'no'
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600'
                )}>
                <span className="flex items-center justify-center">
                  {answers[id] === 'no' && (
                    <motion.svg
                      initial={{scale: 0, opacity: 0}}
                      animate={{scale: 1, opacity: 1}}
                      transition={{duration: 0.2}}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 mr-1">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </motion.svg>
                  )}
                  아니요
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      )
    }

    return <></>
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

  // filepath: /Users/donghwan/Documents/code/ESGProject_2/frontend/src/app/(dashboard)/CSDDD/eudd/euddForm.tsx
  // main return 부분 개선
  return (
    <div className="flex flex-col w-full h-full p-8">
      {/* 네비게이션 브레드크럼 */}
      <motion.div
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.3}}
        className="flex flex-row items-center p-2 px-2 mb-6 text-sm text-gray-500 bg-white rounded-lg shadow-sm">
        <Home className="w-4 h-4 mr-1" />
        <span>공급망 실사</span>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="font-medium text-customG">EU 공급망 실사 진단</span>
      </motion.div>

      <div className="w-full mx-auto max-w-7xl">
        {/* 헤더 섹션 - 컴팩트 버전으로 개선 */}
        <motion.div
          initial={{opacity: 0, scale: 0.98}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.4}}
          className="p-5 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex items-center">
            <div className="p-2 mr-4 rounded-full bg-customG/10">
              <BadgeCheck className="w-6 h-6 text-customG" />
            </div>
            <div>
              <h1 className="text-xl font-gmBold text-customG">
                EU 공급망 실사 지침 요구사항 이행 자가진단
              </h1>
              <p className="text-sm text-gray-600">
                기업의 EU 공급망 실사 준비 수준을 확인하고 개선할 수 있도록 도움을
                제공합니다.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 단계 인디케이터 */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.5, delay: 0.2}}
          className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              {Array.from({length: 7}, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setStep(n)}
                  className={cn('relative flex flex-col items-center justify-center')}>
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      step === n
                        ? 'bg-customG text-white' // 현재 단계는 테두리 없이 배경색만
                        : n < step
                        ? 'bg-white text-customG' // 완료 단계의 테두리 제거 (border-2 border-customG 제거)
                        : 'bg-gray-100 text-gray-400'
                    )}>
                    {n < step ? <BadgeCheck className="w-5 h-5" /> : n}
                  </div>
                  <span
                    className={cn(
                      'mt-1 text-xs',
                      step === n ? 'font-medium text-customG' : 'text-gray-500'
                    )}>
                    {n === 1 && '기업 정책'}
                    {n === 2 && '영향 식별'}
                    {n === 3 && '영향 완화'}
                    {n === 4 && '모니터링'}
                    {n === 5 && '이해관계자'}
                    {n === 6 && '구제 조치'}
                    {n === 7 && '기후 전환'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 현재 단계 질문 렌더링 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{opacity: 0, x: 20}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, x: -20}}
            transition={{duration: 0.3}}
            className="mb-8">
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
                      <motion.div
                        key={`section-${key}`}
                        initial={{opacity: 0, y: 10}}
                        animate={{opacity: 1, y: 0}}
                        transition={{duration: 0.3, delay: 0.1}}
                        className="p-6 mb-6 space-y-4 bg-white border border-gray-100 rounded-lg shadow-sm">
                        {section}
                      </motion.div>
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
                  <motion.div
                    key={`section-final`}
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.3, delay: 0.2}}
                    className="p-6 mb-6 space-y-0 transition-shadow duration-300 bg-white border border-gray-100 divide-y divide-gray-100 rounded-lg shadow-sm">
                    {section}
                  </motion.div>
                )
              }

              return elements
            })()}
          </motion.div>
        </AnimatePresence>

        {/* 진행 상태 표시 */}
        <div className="h-2 mb-6 overflow-hidden bg-gray-200 rounded-full">
          <div
            className="h-2 transition-all duration-300 bg-customG"
            style={{width: `${(step / 7) * 100}%`}}></div>
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-center pt-4 pb-8 gap-x-6">
          {step > 1 && (
            <DashButton
              onClick={prev}
              width="w-32"
              className="text-white bg-gray-600 border-2 border-gray-600 hover:bg-gray-700 hover:border-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              이전 단계
            </DashButton>
          )}

          {step < 7 ? (
            <DashButton
              onClick={next}
              width="w-32"
              className="text-white shadow-sm bg-customG hover:bg-customGDark">
              다음 단계
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </DashButton>
          ) : (
            <DashButton
              onClick={handleSave}
              disabled={isSubmitting}
              width="w-32"
              className="text-white shadow-sm bg-customG hover:bg-customGDark">
              {isSubmitting ? (
                <>
                  <svg
                    className="w-4 h-4 mr-2 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  저장 중...
                </>
              ) : (
                <>
                  <BadgeCheck className="w-4 h-4 mr-2" />
                  평가 완료
                </>
              )}
            </DashButton>
          )}
        </div>
      </div>
    </div>
  )
}
