'use client'

import {useState, useEffect} from 'react'
import type {JSX} from 'react'
import {motion, AnimatePresence} from 'framer-motion' // Framer Motion 추가
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
import {fetchEddResult, updateEddAnswers} from '@/services/csddd'
import {useRouter} from 'next/navigation'
import type {EddViolationDto} from '@/types/IFRS/csddd'
import {AxiosError} from 'axios'
const questions: Record<
  string,
  {type: 'title' | 'question'; text: string; id?: string}[]
> = {
  1: [
    {type: 'title', text: '1. 환경경영 시스템 구축'},

    {
      type: 'question',
      id: 'EDD-1-01',
      text: '전사가 추진하고 지향해야 할 환경 정책을 수립하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-1-02',
      text: '환경경영을 담당하는 별도의 조직을 마련하고 있으며, 환경경영과 관련된 안건은 최고경영진에게까지 보고되고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-1-03',
      text: '신규 사업을 수행하기에 앞서, 해당 사업의 환경에 대한 리스크 평가(환경영향평가, 환경 인허가 획득 등)를 수행하고 있습니까?'
    }
  ],
  2: [
    {type: 'title', text: '2. 에너지 사용 및 온실가스 관리'},
    {
      type: 'question',
      id: 'EDD-2-01',
      text: '온실가스 감축과 관련된 단기/중기/장기 목표를 수립하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-2-02',
      text: '온실가스 배출량(Scope 1, 2, 3)을 산정하고, 제3자를 통해 배출량을 검증받고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-2-03',
      text: '에너지 소비량과 관련된 단기/중기/장기 목표를 수립하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-2-04',
      text: '에너지 소비량을 관리하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-2-05',
      text: '임직원을 대상으로 온실가스 감축 및 에너지 절약과 관련된 교육을 제공하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-2-06',
      text: '에너지 소비량 및 온실가스 배출량을 감축하기 위해 자체적으로 수행하고 있는 활동(공정 개선, 탄소 감축기술 도입, 재생에너지 사용 등)이 있습니까?'
    }
  ],
  3: [
    {type: 'title', text: '3. 물 관리'},
    {
      type: 'question',
      id: 'EDD-3-01',
      text: '용수 사용량 및 폐수 배출량을 관리하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-3-02',
      text: '용수 사용량을 감축하기 위해 자체적으로 수행하는 활동(빗물 수집 시스템, 폐수 재활용 시스템 등)이 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-3-03',
      text: '사업장에서 배출되는 폐수의 품질을 평가하고 있으며, 폐수 내 오염물질을 저감시키기 위해 수행하고 있는 활동이 있습니까?'
    }
  ],
  4: [
    {type: 'title', text: '4. 오염물질 관리'},
    {
      type: 'question',
      id: 'EDD-4-01',
      text: '사업장에서 배출되는 대기오염물질(NOx, SOx, PM 등)의 배출량을 관리하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-4-02',
      text: '사업장에서 배출되는 수질오염물질(COD, BOD, SS 등) 배출량을 관리하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-4-03',
      text: '사업장에서 배출되는 대기, 수질오염물질을 저감하기 위해 자체적으로 수행하는 활동(정기적인 소음 및 악취 측정, 바이오필터 도입 등)이 있습니까?'
    }
  ],
  5: [
    {type: 'title', text: '5. 유해화학물질 관리'},
    {
      type: 'question',
      id: 'EDD-5-01',
      text: '오존층 파괴물질 등을 포함한 유해화학물질을 사용하는 경우, 해당 물질의 라벨을 지정하고 보관, 취급 및 운송에 대한 전 과정을 모니터링하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-5-02',
      text: '사업을 영위하는 과정에서 수은 첨가제품, 잔류성 유기 오염물질을 생산, 수입 또는 수출하는 경우, 해당물질의 사용을 대체 및 제거하기 위해 뚜렷한 시점을 포함한 계획을 수립하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-5-03',
      text: '보관 또는 사용 허가가 필요한 유해화학물질을 사용, 수입 또는 수출하는 경우, 해당 관할 당국으로부터 승인된 법적 절차에 따라 처리하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-5-04',
      text: '유해화학물질 관리에 대한 책임자를 지정하고, 해당 책임자를 대상으로 유해물질을 안전하게 취급 및 관리할 수 있도록 관련 교육을 제공하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-5-05',
      text: '유해화학물질을 사용하는 경우, 화평법, 화관법 또는 EU REACH 규정에 따라, 등록이 필요한 모든 화학물질에 대한 등록을 수행하였습니까?'
    },
    {
      type: 'question',
      id: 'EDD-5-06',
      text: '유해화학물질을 사용하는 경우, 화평법, 화관법 또는 EU REACH 규정에 따라, 이해관계자를 대상으로 안전보건자료를 제공하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-5-07',
      text: '사업을 영위하는 과정에서 선박을 운영하는 경우, 선박으로부터 기름 또는 유성혼합물, 유독성 액체물질, 하수에 대한 해양 배출을 방지하기 위해 수행되는 활동이 있습니까?'
    }
  ],
  6: [
    {type: 'title', text: '6. 폐기물 관리'},
    {
      type: 'question',
      id: 'EDD-6-01',
      text: '사업장에서 발생하는 폐기물을 감축하기 위해 자체적으로 수행하는 활동(폐기물 재활용 체계 구축 등)이 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-6-02',
      text: '사업장 내의 폐기물 흐름에 따른 폐기물 발생 위치를 파악하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-6-03',
      text: '현지 당국으로부터 승인을 받은 제3자 폐기물 관리/처리 회사를 통해 일반폐기물을 처리하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-6-04',
      text: '바젤 협약에 비준한 국가를 대상으로 수출입이 규제되는 폐기물을 수출하는 경우, 수입국의 사전 서면 동의를 획득하기 위한 절차를 마련하고 있습니까?'
    }
  ],
  7: [
    {type: 'title', text: '7. 친환경 제품'},
    {
      type: 'question',
      id: 'EDD-7-01',
      text: '친환경 제품 인증을 획득하였거나, 친환경 제품 개발을 위한 투자가 이루어지고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-7-02',
      text: '제품의 원부자재 사용량을 관리하고 있습니까?'
    }
  ],
  8: [
    {type: 'title', text: '8. 생물다양성 보호'},
    {
      type: 'question',
      id: 'EDD-8-01',
      text: '세계문화유산, 람사르습지 등 생물다양성에 민감한 지역 근처에 사업장을 보유하고 있지 않습니까?'
    },
    {
      type: 'question',
      id: 'EDD-8-02',
      text: '야생 동식물을 수입 또는 수출하는 경우, 수입허가서 또는 수출허가서를 획득하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-8-03',
      text: '사업을 영위하는 과정에서 자국 외 유전자원에 접근하는 경우, 유전자원 제공국으로부터 사전승인을 획득하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-8-04',
      text: '자국 외 국가의 유전자원으로부터 유전자원을 획득하는 경우, 해당 과정에서 발생하는 이익을 제공국과 공유하고 있습니까?'
    },
    {
      type: 'question',
      id: 'EDD-8-05',
      text: '유전자변형생물체(LMOs)를 생산하는 경우, LMOs에 대한 위해성 평가를 수행하고 있습니까?'
    }
  ]
}

/**
 * 환경 실사 지침 자가진단 페이지
 * 환경 실사 요구사항에 대한 자가진단을 제공합니다.
 */
export default function EddForm() {
  // 상태 관리
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [analysisData, setAnalysisData] = useState<Record<string, EddViolationDto>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // 중요: 컴포넌트 최상위 레벨에서 라우터 초기화
  const router = useRouter()

  /**
   * 초기 데이터 로드 및 답변 초기화
   * - 모든 질문을 기본값 '예'로 설정
   * - 서버에서 가져온 위반 항목은 '아니요'로 설정
   */
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

    // 기본 응답 설정 후 서버 데이터 로드
    setAnswers(initialAnswers)
    loadEddData()
  }, [])

  /**
   * 서버에서 저장된 EDD 결과 데이터 로드
   * - 기존 저장된 결과가 있으면 가져와서 표시
   * - 서버 응답에서 'no' 응답(위반 항목)만 가져옴
   * - 데이터를 ID 기준 객체로 변환하여 효율적인 참조 가능
   */
  const loadEddData = async (): Promise<void> => {
    try {
      // 서버에서 기존 저장된 결과 가져오기
      const result = await fetchEddResult()

      // 결과 데이터를 ID 기반 객체로 변환
      const mappedData: Record<string, EddViolationDto> = {}

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

  /**
   * 네비게이션 함수
   */
  const next = () => step < 7 && setStep(step + 1)
  const prev = () => setStep(prevStep => Math.max(prevStep - 1, 1))

  /**
   * 저장 함수
   * '아니요' 응답만 필터링하여 서버에 전송
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

      // API 호출하여 답변 저장
      const result = await updateEddAnswers({
        answers: noAnswersOnly
      })

      // 서버 응답 확인 후 성공 처리
      if (result) {
        showSuccess('자가진단이 성공적으로 저장되었습니다.')
        // 결과 페이지로 이동
        router.push('/CSDDD/edd/result')
      }
    } catch (error) {
      console.error('저장 오류:', error)
      showError('자가진단 저장에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

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

          {/* 응답 선택 - 사이즈 통일 및 대칭성 개선 */}
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
        <span className="font-medium text-customG">환경 실사 진단</span>
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
                환경 실사 지침 요구사항 이행 자가진단
              </h1>
              <p className="text-sm text-gray-600">
                기업의 환경 실사 준비 수준을 확인하고 개선할 수 있도록 도움을 제공합니다.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 단계 인디케이터 - 원래 버전으로 복원 */}
        <motion.div
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.5, delay: 0.2}}
          className="p-4 mb-6 bg-white border border-gray-100 shadow-sm rounded-xl">
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-2 mb-2"></div>

            {/* 원래 버전의 단계 인디케이터 */}
            <div className="flex items-center justify-between">
              {Array.from({length: 8}, (_, i) => i + 1).map(n => (
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
                    {n === 1 && '환경경영'}
                    {n === 2 && '온실가스'}
                    {n === 3 && '물 관리'}
                    {n === 4 && '오염물질'}
                    {n === 5 && '화학물질'}
                    {n === 6 && '폐기물'}
                    {n === 7 && '친환경제품'}
                    {n === 8 && '생물다양성'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 현재 단계 질문 렌더링 - 흰색 테두리 적용 */}
        <AnimatePresence mode="wait">
          {' '}
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
            style={{width: `${(step / 8) * 100}%`}}></div>
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

          {step < 8 ? (
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
