'use client'

import {useState, useEffect} from 'react'
import {motion} from 'framer-motion'
import InputBox from '@/components/tools/inputBox'
import CustomSelect from '@/components/tools/customSelect'
import {useKPIGoalStore} from '@/stores/IFRS/goal/useKPIGoalStore'
import {createKPIGoal, updateKPIGoal, deleteKPIGoal, fetchKPIGoal} from '@/services/goal'
import {showError, showSuccess} from '@/util/toast'
import axios from 'axios'
import {IFRSGoalFormCard} from '@/components/forms/module-forms'
import {IFRSGoalButton} from '@/components/buttons/module-buttons'
import {
  Trash,
  Save,
  BarChart3,
  Loader2,
  AlertCircle,
  Target,
  Calendar,
  ChevronRight
} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import {Separator} from '@/components/ui/separator'
import {Badge} from '@/components/ui/badge'

// 테마 색상 정의 - 싱글톤으로 관리
const THEME_STYLE = {
  text: 'text-blue-600',
  bg: 'bg-blue-50',
  border: 'border-blue-200',
  ring: 'ring-blue-500',
  focusRing: 'focus:ring-2 focus:ring-blue-500/40 focus:ring-offset-2',
  buttonBg: 'rgb(37, 99, 235)',
  buttonHoverBg: 'rgb(29, 78, 216)',
  buttonText: 'text-white',
  progressBg: 'bg-blue-600'
}

// 공통 입력 핸들러
const handleNumberInputChange = (
  fieldName: string,
  value: string,
  setFieldFn: Function
) => {
  const numValue = value === '' ? undefined : Number(value)
  setFieldFn(fieldName, numValue)
}

// 커스텀 입력 컴포넌트 - 디자인 통일 및 높이 조정
const StyledInput = ({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  className = '',
  style = {}
}: {
  label: string
  value: string | number | undefined
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  readOnly?: boolean
  className?: string
  style?: React.CSSProperties
}) => {
  // undefined, null, 0 모두 ''로 표시
  const displayValue = value === undefined || value === null || value === 0 ? '' : value

  return (
    <div>
      <label className="mb-2 text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          type="text"
          value={displayValue}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full px-3 py-2 border rounded-md outline-none ${THEME_STYLE.focusRing} ${className}`}
          style={{
            height: '40px', // CustomSelect와 동일한 높이
            ...style
          }}
        />
      </div>
    </div>
  )
}

type KPIGoalProps = {
  onClose: () => void
  rowId?: number
  mode: 'add' | 'edit'
}

export default function KPIGoal({onClose, rowId, mode}: KPIGoalProps) {
  const isEditMode = mode === 'edit'
  const [submitting, setSubmitting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  const indicator2 = ['GHG 배출량', '에너지', '물 자원', '폐기물', 'ESG 인센티브']
  const detailedIndicator2: Record<string, string[]> = {
    'GHG 배출량': ['Scope 1', 'Scope 2', 'Scope 3'],
    에너지: ['전력 소비 총량', '재생에너지 비율', '직접 입력'],
    '물 자원': ['총 취수량', '재이용수 비율', '직접 입력'],
    폐기물: ['폐기물 총량', '재활용률', '위험 폐기물 배출'],
    'ESG 인센티브': [
      '목표 대비 감축률',
      '친환경 매출 비율',
      '공급망 조달율',
      'ESG 교육 참여율',
      '고위경영진 ESG 보상 연계',
      '직접 입력'
    ]
  }

  const {
    indicator,
    detailedIndicator,
    unit,
    baseYear,
    goalYear,
    referenceValue,
    currentValue,
    targetValue,
    setField,
    setData,
    resetFields,
    persistToStorage,
    initFromStorage,
    initFromApi,
    isLoading,
    hasError
  } = useKPIGoalStore()

  // 페이지 로드 시 데이터 로드 (API 또는 localStorage)
  useEffect(() => {
    const loadData = async () => {
      try {
        if (isEditMode && rowId !== undefined) {
          // 수정 모드: API에서 데이터 로드
          await initFromApi(rowId)
        } else {
          // 추가 모드: 로컬 스토리지에서 데이터 로드
          initFromStorage()
        }
      } catch (error) {
        console.error('데이터 로드 중 오류:', error)
        showError('데이터를 불러오는데 실패했습니다.')
      } finally {
        setInitialLoad(false)
      }
    }

    loadData()

    // 언마운트 시 저장 (추가 모드인 경우만)
    return () => {
      if (!isEditMode) {
        persistToStorage()
      }
      // 항상 상태를 초기화하되, 수정 취소 시에만 실행되도록
      // resetFields()를 useEffect 리턴에서 제거하고 onClose 시에만 호출하도록 수정
    }
  }, [isEditMode, rowId, initFromApi, initFromStorage, persistToStorage])

  // 폼 유효성 검사
  // validateForm 함수 개선
  const validateForm = () => {
    console.log('폼 검증 데이터:', {
      indicator,
      detailedIndicator,
      unit,
      baseYear,
      goalYear,
      referenceValue,
      currentValue,
      targetValue
    })

    if (!indicator || !detailedIndicator || !unit) {
      showError('지표 정보를 모두 입력해주세요.')
      return false
    }

    if (baseYear === undefined || goalYear === undefined) {
      showError('기준 연도와 목표 연도를 입력해주세요.')
      return false
    }

    if (baseYear >= goalYear) {
      showError('목표 연도는 기준 연도보다 커야 합니다.')
      return false
    }

    if (
      referenceValue === undefined ||
      currentValue === undefined ||
      targetValue === undefined
    ) {
      showError('기준값, 현재 수치, 목표 수치를 모두 입력해주세요.')
      return false
    }

    if (referenceValue === targetValue) {
      showError('기준값과 목표 수치가 동일하면 목표로서의 의미가 없습니다.')
      return false
    }

    return true
  }

  // 폼 제출 처리
  const handleSubmit = async () => {
    if (submitting) return
    if (!validateForm()) return

    // 안전한 숫자 변환 함수 - undefined나 NaN 방지
    const safeNumber = (value: number | undefined): number => {
      if (value === undefined || isNaN(value)) return 0
      return value
    }

    const KPIGoalData = {
      indicator,
      detailedIndicator,
      unit,
      baseYear: safeNumber(baseYear),
      goalYear: safeNumber(goalYear),
      referenceValue: safeNumber(referenceValue),
      currentValue: safeNumber(currentValue),
      targetValue: safeNumber(targetValue)
    }

    try {
      setSubmitting(true)
      console.log('제출할 KPI 데이터:', KPIGoalData) // 디버깅용 로그

      let result
      if (isEditMode && rowId !== undefined) {
        // 수정 모드: 업데이트 API 호출
        result = await updateKPIGoal(rowId, KPIGoalData)
        showSuccess('KPI 목표가 성공적으로 수정되었습니다.')
      } else {
        // 추가 모드: 생성 API 호출
        result = await createKPIGoal(KPIGoalData)
        showSuccess('KPI 목표가 성공적으로 저장되었습니다.')
        localStorage.removeItem('kpigoal-storage')
        // 추가 모드에서만 즉시 resetFields 호출
        resetFields()
      }

      // 목록 다시 가져오기
      const updatedList = await fetchKPIGoal()
      setData(updatedList)
      onClose()
    } catch (err) {
      console.error('API 오류 상세:', err) // 자세한 오류 로깅
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '저장 실패: 서버 오류가 발생했습니다.'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  // 삭제 처리
  const handleDelete = async () => {
    if (rowId === undefined) return

    try {
      setSubmitting(true)
      await deleteKPIGoal(rowId)
      showSuccess('KPI 목표가 성공적으로 삭제되었습니다.')

      const updatedList = await fetchKPIGoal()
      setData(updatedList)
      resetFields() // 삭제 후 상태 초기화
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '삭제 실패: 서버 오류가 발생했습니다.'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
      setDeleteDialogOpen(false)
    }
  }

  // 로딩 중 표시
  if ((initialLoad || isLoading) && isEditMode) {
    return (
      <div className="flex items-center justify-center w-full h-64">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <span className="ml-2 text-blue-600">데이터를 불러오는 중...</span>
      </div>
    )
  }

  // 에러 표시
  if (hasError && isEditMode) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-64">
        <AlertCircle className="w-8 h-8 text-red-600" />
        <span className="mt-2 text-red-600">데이터 로드 중 오류가 발생했습니다.</span>
        <button
          onClick={() => {
            setInitialLoad(true)
            initFromApi(rowId!)
          }}
          className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700">
          다시 시도
        </button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 5}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      className="flex flex-col w-full h-full">
      <IFRSGoalFormCard
        title={isEditMode ? 'KPI 목표 수정' : '새 KPI 목표 등록'}
        icon={<BarChart3 className={`w-5 h-5 ${THEME_STYLE.text}`} />}
        description="기후 변화 관련 지표와 목표를 관리합니다."
        badge={
          indicator && (
            <Badge
              className={`${THEME_STYLE.bg} ${THEME_STYLE.text} border ${THEME_STYLE.border}`}>
              {indicator}
              {detailedIndicator && (
                <>
                  <ChevronRight className="w-3 h-3 mx-0.5" />
                  {detailedIndicator}
                </>
              )}
            </Badge>
          )
        }
        actions={
          <div className="flex items-center justify-end space-x-3">
            {isEditMode && (
              <IFRSGoalButton
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
                disabled={submitting}
                icon={<Trash className="w-4 h-4" />}
                size="sm">
                삭제
              </IFRSGoalButton>
            )}
            <IFRSGoalButton
              variant="outline"
              onClick={() => {
                resetFields() // 취소 시 상태 초기화
                onClose()
              }}
              disabled={submitting}
              size="sm"
              style={{
                backgroundColor: 'white',
                color: THEME_STYLE.buttonBg,
                border: `1px solid ${THEME_STYLE.buttonBg}`
              }}>
              취소
            </IFRSGoalButton>
            <IFRSGoalButton
              onClick={handleSubmit}
              disabled={submitting}
              icon={
                submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )
              }
              style={{
                backgroundColor: THEME_STYLE.buttonBg,
                color: 'white'
              }}
              size="sm">
              {submitting ? '처리 중...' : isEditMode ? '수정' : '저장'}
            </IFRSGoalButton>
          </div>
        }>
        <div className="grid gap-6">
          {/* 지표 선택 섹션 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-medium text-slate-800">지표 정보</h3>
            </div>
            <Separator className="mb-4" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 text-sm font-medium text-slate-700">
                  지표 유형
                </label>
                <CustomSelect
                  placeholder="지표 유형을 선택해주세요"
                  options={indicator2}
                  value={indicator}
                  onValueChange={value => {
                    setField('indicator', value)
                    setField('detailedIndicator', '') // 선택 리스크 종류 바뀌면 유형 초기화
                  }}
                />
              </div>

              {indicator && (
                <motion.div
                  initial={{opacity: 0, height: 0}}
                  animate={{opacity: 1, height: 'auto'}}
                  transition={{duration: 0.2}}>
                  <label className="mb-2 text-sm font-medium text-slate-700">
                    세부 지표
                  </label>
                  <CustomSelect
                    placeholder="세부 지표를 선택해주세요"
                    options={detailedIndicator2[indicator] ?? []}
                    value={detailedIndicator}
                    onValueChange={value => setField('detailedIndicator', value)}
                  />
                </motion.div>
              )}

              <StyledInput
                label="측정 단위"
                value={unit}
                onChange={e => setField('unit', e.target.value)}
                placeholder="예: ton, %, kWh"
              />
            </div>
          </div>

          {/* 목표 기간 섹션 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-medium text-slate-800">목표 기간</h3>
            </div>
            <Separator className="mb-4" />

            {/* 3컬럼으로 변경하여 목표 기간을 오른쪽에 표시 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StyledInput
                label="기준 연도"
                value={baseYear}
                onChange={e =>
                  handleNumberInputChange('baseYear', e.target.value, setField)
                }
                placeholder="예: 2020"
              />

              <StyledInput
                label="목표 연도"
                value={goalYear}
                onChange={e =>
                  handleNumberInputChange('goalYear', e.target.value, setField)
                }
                placeholder="예: 2030"
              />

              {/* 목표 기간 표시를 입력 필드와 동일한 스타일로 */}
              <div>
                <label className="mb-2 text-sm font-medium text-slate-700">
                  목표 기간
                </label>
                <div
                  className={`flex items-center justify-end rounded-md border ${
                    baseYear && goalYear && baseYear < goalYear
                      ? THEME_STYLE.bg
                      : 'bg-white'
                  }`}
                  style={{height: '40px'}} // CustomSelect와 동일한 높이
                >
                  <span
                    className={`text-lg font-semibold ${
                      baseYear && goalYear && baseYear < goalYear
                        ? THEME_STYLE.text
                        : 'text-slate-400'
                    } px-3`}>
                    {baseYear && goalYear && baseYear < goalYear
                      ? `${goalYear - baseYear}년`
                      : '-'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 목표 수치 섹션 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-slate-600" />
              <h3 className="text-sm font-medium text-slate-800">목표 수치</h3>
            </div>
            <Separator className="mb-4" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <StyledInput
                label="기준값"
                value={referenceValue}
                onChange={e =>
                  handleNumberInputChange('referenceValue', e.target.value, setField)
                }
                placeholder={`예: 1000 ${unit || ''}`}
              />

              <StyledInput
                label="현재 수치"
                value={currentValue}
                onChange={e =>
                  handleNumberInputChange('currentValue', e.target.value, setField)
                }
                placeholder={`예: 800 ${unit || ''}`}
              />

              <StyledInput
                label="목표 수치"
                value={targetValue}
                onChange={e =>
                  handleNumberInputChange('targetValue', e.target.value, setField)
                }
                placeholder={`예: 500 ${unit || ''}`}
              />
            </div>
          </div>
        </div>
      </IFRSGoalFormCard>

      {/* 삭제 확인 대화상자 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" /> KPI 목표 삭제
            </AlertDialogTitle>
            <AlertDialogDescription>
              이 KPI 목표를 정말로 삭제하시겠습니까? 이 작업은 취소할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={e => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={submitting}
              className="text-white bg-red-600 hover:bg-red-700">
              {submitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash className="w-4 h-4 mr-2" />
              )}
              {submitting ? '삭제 중...' : '삭제'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  )
}
