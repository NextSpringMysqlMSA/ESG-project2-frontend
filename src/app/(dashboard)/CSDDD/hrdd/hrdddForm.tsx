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
import {fetchHrddResult, updateHrddAnswers} from '@/services/csddd'
import {useRouter} from 'next/navigation'
import type {HrddViolationDto} from '@/types/IFRS/csddd'
import type {AxiosError} from 'axios'
import {AnimatePresence, motion} from 'framer-motion'

// HRDD-specific questions
const questions: Record<
  string,
  {type: 'title' | 'question'; text: string; id?: string}[]
> = {
  1: [
    {type: 'title', text: '1. 생명과 안전에 대한 관리'},
    {
      type: 'question',
      id: 'HRDD-1-01',
      text: '안전보건 정책(안전보건 지침 포함)을 보유하고 있으며, 해당 정책은 자체 운영 뿐만 아니라 하청업체에 의해 수행되는 모든 활동을 포함하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-1-02',
      text: '사업장 내 안전보건관리 책임자를 별도로 지정 하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-1-03',
      text: '임직원이 작업 안전 및 건강 사고와 관련된 우려 사항을 제기할 수 있는 신고 채널을 마련하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-1-04',
      text: '임직원을 대상으로 산업안전에 관한 교육을 정기적으로 실시하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-1-05',
      text: '근로자들의 안전 및 보건에 영향을 미칠 수 있는 유해인자 해소 프로그램이 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-1-06',
      text: '사업장 내 안정장구 및 안전시설에 대한 정기적인 점검을 시행하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-1-07',
      text: '근로자의 직무수행에 필요한 안전보호장구를 제공하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-1-08',
      text: '사업장 내 비상대응체계를 구축하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-1-09',
      text: '정기적으로 사업장의 위험성 평가를 수행하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-1-10',
      text: '사업장 내 안전 관련 지침을 게시하고 있으며, 외국인 근로자가 존재하는 경우 해당 근로자의 국적에 맞는 언어로 작성되어 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-1-11',
      text: '전체 임직원을 대상으로 건강진단을 실시하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-1-12',
      text: '근로자가 업무상 부상을 당하거나 질병에 걸린 경우, 요양비를 부담하고 있습니까?'
    }
  ],
  2: [
    {type: 'title', text: '2. 차별 및 괴롭힘 금지'},
    {
      type: 'question',
      id: 'HRDD-2-01',
      text: '인권 정책 또는 인권 정책에 상응하는 지침을 보유하고 있으며, 인권 정책은 성별, 종교, 장애, 나이, 사회적 신분, 출신 등을 이유로 차별을 금지 하는 조항을 포함하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-2-02',
      text: '인권 정책 또는 인권 정책에 상응하는 지침을 보유하고 있으며, 인권 정책은 괴롭힘, 성희롱, 신체적 차별 등 직장 내 괴롭힘을 금지하는 조항을 포함하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-2-03',
      text: '임직원을 대상으로 다양성, 차별 및 괴롭힘 문제에 대한 인식 교육을 수행하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-2-04',
      text: '장애인 근로자 고용에 대한 법적 기준을 충족하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-2-05',
      text: '직장 내 소수자/취약계층을 지원하기 위한 별도의 조직을 마련하여 운영하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-2-06',
      text: '고충처리제도를 운영하고 있으며, 신고자에 대한 보복을 방지하기 위한 프로세스를 마련하고 있습니까?'
    }
  ],
  3: [
    {type: 'title', text: '3. 아동 노동 금지'},
    {
      type: 'question',
      id: 'HRDD-3-01',
      text: '회사는 근로기준법에 따른 연소자를 고용하지 않으며, 근로자의 고용 과정에서 근로자의 나이를 확인하는 절차를 마련하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-3-02',
      text: '취직인허증을 발급 받은 연소자를 고용하는 경우, 해당 연소자가 건강이나 안전, 도덕의식에 해로운 일을 수행하지 않도록 근로계약서를 통해 보장 하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-3-03',
      text: '취직인허증을 발급 받은 연소자를 고용하는 경우, 해당 연소자의 근무환경과 근무현황을 정기적 으로 모니터링하고 있습니까?'
    }
  ],
  4: [
    {type: 'title', text: '4. 강제 노동 금지'},
    {
      type: 'question',
      id: 'HRDD-4-01',
      text: '인권 정책 또는 인권 정책에 상응하는 지침을 보유 하고 있으며, 인권 정책은 모든 종류/형태의 강제 노동을 금지하는 조항을 포함하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-4-02',
      text: '회사는 특히 외국인 노동자를 포함하여, 근로자의 행동을 제약할 목적으로 신분증명서, 여행문서 등 중요한 개인문서롤 보관하지 않고 있습니까?'
    }
  ],
  5: [
    {type: 'title', text: '5. 근로 조건'},
    {
      type: 'question',
      id: 'HRDD-5-01',
      text: '근로조건과 관련하여 노사간 자유로운 의견 개진 이 가능한 소통 채널(타운홀 미팅 등)을 운영하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-5-02',
      text: '전체 임직원(정규직 근로자, 비정규직 근로자, 시간제 근로자 등)을 대상으로 근로계약서를 작성하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-5-03',
      text: '근로계약서 내, 필수 기재사항이 모두 포함되어 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-5-04',
      text: '외국인 임직원에게 모국어로 작성된 근로계약서를 제공하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-5-05',
      text: '근로자 임금산정에 대한 기준을 마련하고 있으며, 해당 기준은 모든 임직원에게 적용되고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-5-06',
      text: '전체 임직원을 대상으로 관계법령에서 요구하는 법정 최저임금을 보장하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-5-07',
      text: '성별 등 근로자의 조건과 관계 없이, 동일 노동에 대한 동일 수준의 임금을 제공하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-5-08',
      text: '근로자들의 정규 및 초과근무 시간을 기록하고 관리할 수 있는 내부 프로세스(근태관리시스템 등)를 마련하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-5-09',
      text: '근로자의 연장근로에 따른 적법한 보상 체계를 마련하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-5-10',
      text: '전체 임직원을 대상으로 근로시간 4시간마다 30분 이상의 휴게시간을 보장하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-5-11',
      text: '임산부 또는 출산 후 1년 미만의 여성근로자에 대한 근로시간 제한 정책을 마련하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-5-12',
      text: '전체 임직원을 대상으로 근로기준법에 명시되어 있는 유급휴가 기준에 따른 유급 휴가를 제공하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-5-13',
      text: '직장 내 소수자/취약계층을 지원하기 위한 별도의 조직을 마련하여 운영하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-5-14',
      text: '고충처리제도를 운영하고 있으며, 신고자에 대한 보복을 방지하기 위한 프로세스를 마련하고 있습니까?'
    }
  ],
  6: [
    {type: 'title', text: '6. 결사 및 단체교섭의 자유 보장'},
    {
      type: 'question',
      id: 'HRDD-6-01',
      text: '회사는 근로계약서 또는 이에 상응하는 지침을 통해, 근로자들의 결사의 자유와 단체교섭의 자유를 보장하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-6-02',
      text: '회사는 근로계약서 또는 이에 상응하는 지침을 통해, 근로자가 노동조합 조직 또는 노동조합 활동을 이유로 불이익을 주지 않는다는 점을 명시하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-6-03',
      text: '회사는 단체협상을 시작하기에 앞서, 근로자 대표에게 단체협상에 필요한 정보(기업의 실적과 현황 등)를 제공하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-6-04',
      text: '경영상의 이유로 불가피한 해고를 해야 하는 경우, 노동조합 또는 근로자 대표에게 사전에 통보하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-6-05',
      text: '노동자 대표가 단체협상을 요구하는 경우, 실질적으로 의사결정권이 있는 회사의 대표와 협상하고 있습니까?'
    }
  ],
  7: [
    {type: 'title', text: '7. 개인정보 침해 금지'},
    {
      type: 'question',
      id: 'HRDD-7-01',
      text: '제3자가 회사에게 고객 및 임직원에 대한 개인 정보를 요청한 경우, 해당 인원을 대상으로 사전 동의를 획득하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-7-02',
      text: '임직원을 대상으로 정보보안 교육을 실시하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-7-03',
      text: '정기적으로 개인정보 리스크에 대한 보안 점검을 실시하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-7-04',
      text: '개인정보의 처리, 공유 및 보관에 대해, 해당 당사자 로부터 동의를 얻는 절차를 마련하고 있습니까?'
    }
  ],
  8: [
    {type: 'title', text: '8. 환경 악화를 초래하는 행위 금지'},
    {
      type: 'question',
      id: 'HRDD-8-01',
      text: '사업장 주변의 환경과 관련된 정보를 수집하고 평가하기 위한 프로세스를 마련하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-8-02',
      text: '환경개선을 위해 관계 법령을 고려한 측정 가능한 목표를 설정하고, 해당 목표의 이행 정도를 모니터링하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-8-03',
      text: '전체 임직원을 대상으로 환경과 관련된 교육을 제공하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-8-04',
      text: '새로운 제품 또는 사업의 확장을 고려하는 경우, 환경에 미치는 영향을 고려하기 위해 환경영향 평가를 실시하고 있습니까?'
    },
    {
      type: 'question',
      id: 'HRDD-8-05',
      text: '임직원을 대상으로 비상사태 대응지침에 대한 훈련을 정기적으로 실시하고 있습니까?'
    }
  ],
  9: [
    {type: 'title', text: '9. 토지 및 자원 이용에 대한 지역사회 권리 보장'},
    {
      type: 'question',
      id: 'HRDD-9-01',
      text: '토지 소유권 이전 시 이해관계자 확인 절차를 보유하고 있습니까?'
    },
    {type: 'question', id: 'HRDD-9-02', text: '이주 주민 보상을 제공하고 있습니까?'},
    {type: 'question', id: 'HRDD-9-03', text: '지적재산권 사용 전 검토를 하고 있습니까?'},
    {
      type: 'question',
      id: 'HRDD-9-04',
      text: '지적재산권 사용 시 보상을 제공하고 있습니까?'
    }
  ]
}

/**
 * 인권 실사 지침 요구사항 이행 자가진단 컴포넌트
 *
 * 인권 실사(HRDD) 요구사항에 대한 자가진단을 제공합니다.
 * 9개 섹션으로 구분된 질문에 대해 예/아니오 응답을 수집하고
 * '아니요' 응답만 서버에 저장하여 결과 페이지에서 위반 항목으로 표시합니다.
 */
export default function HrdddForm() {
  // 상태 관리
  const [step, setStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  useEffect(() => {
    // 모든 질문을 '예'로 초기화
    const initialAnswers: Record<string, string> = {}
    Object.values(questions).forEach(items => {
      items.forEach(item => {
        if (item.type === 'question' && item.id) {
          initialAnswers[item.id] = 'yes'
        }
      })
    })
    setAnswers(initialAnswers)
    loadHrddData()
  }, [])

  /**
   * 서버에서 저장된 HRDD 결과 데이터 로드
   * - 서버에 저장된 위반 항목(아니요 응답)을 가져와 상태 업데이트
   */
  const loadHrddData = async () => {
    try {
      const result = await fetchHrddResult()

      if (Array.isArray(result) && result.length > 0) {
        const savedAnswers: Record<string, string> = {}
        result.forEach((item: HrddViolationDto) => {
          if (item.id) savedAnswers[item.id] = 'no'
        })
        setAnswers(prev => ({...prev, ...savedAnswers}))
      }

      setIsLoaded(true)
    } catch (err) {
      const error = err as AxiosError
      // 데이터가 없는 경우는 정상 케이스로 처리 (최초 진단 시)
      if (error.response?.status === 404) {
        setIsLoaded(true)
        return
      }
      showError('자가진단 데이터를 불러오는데 실패했습니다.')
      setIsLoaded(true)
    }
  }

  // 네비게이션 함수
  const next = (): void => setStep(prev => Math.min(prev + 1, 9))
  const prev = (): void => setStep(prev => Math.max(prev - 1, 1))

  /**
   * 자가진단 저장 함수
   * - '아니요'로 응답한 항목만 필터링하여 서버에 전송
   * - 응답은 저장 후 결과 페이지로 이동
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

      await updateHrddAnswers({answers: noAnswersOnly})
      showSuccess('자가진단이 성공적으로 저장되었습니다.')

      // 결과 페이지로 이동
      router.push('/CSDDD/hrdd/result')
    } catch (error) {
      showError('자가진단 저장에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * 질문 또는 제목 렌더링 함수
   * - 항목 타입에 따라 제목 또는 질문+라디오 버튼 렌더링
   * @param item 질문 또는 제목 항목
   * @param id 항목 식별자
   * @returns 렌더링된 JSX 요소
   */
  /**
   * 질문 또는 제목 렌더링 함수
   * - 항목 타입에 따라 제목 또는 질문+라디오 버튼 렌더링
   * @param item 질문 또는 제목 항목
   * @param id 항목 식별자
   * @returns 렌더링된 JSX 요소
   */
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
        <span className="font-medium text-customG">인권 실사 진단</span>
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
                인권 실사 지침 요구사항 이행 자가진단
              </h1>
              <p className="text-sm text-gray-600">
                기업의 인권 실사 준비 수준을 확인하고 개선할 수 있도록 도움을 제공합니다.
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
            <div className="flex flex-wrap items-center justify-between gap-y-4">
              {Array.from({length: 9}, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setStep(n)}
                  className={cn('relative flex flex-col items-center justify-center')}>
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center',
                      step === n
                        ? 'bg-customG text-white'
                        : n < step
                        ? 'bg-white text-customG'
                        : 'bg-gray-100 text-gray-400'
                    )}>
                    {n < step ? <BadgeCheck className="w-5 h-5" /> : n}
                  </div>
                  <span
                    className={cn(
                      'mt-1 text-xs',
                      step === n ? 'font-medium text-customG' : 'text-gray-500'
                    )}>
                    {n === 1 && '생명과 안전'}
                    {n === 2 && '차별/괴롭힘'}
                    {n === 3 && '아동 노동'}
                    {n === 4 && '강제 노동'}
                    {n === 5 && '근로 조건'}
                    {n === 6 && '결사 자유'}
                    {n === 7 && '개인정보'}
                    {n === 8 && '환경 보호'}
                    {n === 9 && '지역사회'}
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
            style={{width: `${(step / 9) * 100}%`}}></div>
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

          {step < 9 ? (
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
