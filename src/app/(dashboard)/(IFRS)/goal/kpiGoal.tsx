'use client'

import {useState, useEffect} from 'react'
import {motion} from 'framer-motion'
import CustomSelect from '@/components/tools/customSelect'
import {useKPIGoalStore} from '@/stores/IFRS/goal/useKPIGoalStore'
import {createKPIGoal, updateKPIGoal, deleteKPIGoal, fetchKPIGoal} from '@/services/goal'
import {showError, showSuccess} from '@/util/toast'
import axios from 'axios'
import {Trash, Save, BarChart3, Loader2, AlertCircle} from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

// 테마 색상 정의 - 싱글톤으로 관리
const THEME_STYLE = {
  text: 'text-customG',
  bg: 'bg-customGBorder200',
  border: 'bg-customG',
  ring: 'ring-customG',
  focusRing: 'focus:ring-2 focus:ring-purple-500/40 focus:ring-offset-2',
  buttonBg: 'bg-customG',
  buttonHoverBg: 'bg-customGDark',
  buttonText: 'text-white',
  progressBg: 'bg-customG'
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
      <Label className="mb-2 text-sm font-medium text-slate-700">{label}</Label>
      <div className="relative">
        <Input
          value={displayValue}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={readOnly}
          className={`w-full focus-visible:ring-customG ${className}`}
          style={{
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
    initFromApi
  } = useKPIGoalStore()

  /**
   * 페이지 로드 시 데이터 로드 처리
   * Committee 컴포넌트와 동일한 패턴으로 구현
   */
  useEffect(() => {
    // 불필요한 로딩 표시를 제거하기 위해 initLoad 사용하지 않음
    if (isEditMode && rowId !== undefined) {
      // 수정 모드: API에서 데이터 로드
      initFromApi(rowId).catch(error => {
        console.error('KPI 목표 데이터 로드 오류:', error)
        showError('데이터를 불러오는데 실패했습니다.')
      })
    } else {
      // 추가 모드: 로컬 스토리지에서 데이터 로드
      initFromStorage()
    }

    // 언마운트 시 처리
    return () => {
      if (!isEditMode) {
        // 추가 모드인 경우만 로컬 스토리지에 저장
        persistToStorage()
      }
      resetFields()
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

  /**
   * 폼 제출 처리
   * 데이터 유효성 검사 후 API 호출하여 저장/수정 처리
   */
  const handleSubmit = async () => {
    if (submitting) return
    if (!validateForm()) return

    // 안전한 숫자 변환 함수 - undefined나 NaN 방지
    const safeNumber = (value: number | undefined): number => {
      if (value === undefined || isNaN(value)) return 0
      return value
    }

    // API 제출용 데이터 구성
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
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '저장 실패: 서버 오류가 발생했습니다.'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  /**
   * KPI 목표 삭제 처리
   * 확인 후 API 호출하여 데이터 삭제
   */
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

  return (
    <motion.div
      initial={{opacity: 0, y: 5}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.3}}
      className="flex flex-col space-y-5">
      {/* 헤더 섹션 */}
      <div className="flex items-center pb-2 mb-2 border-b">
        <div className="p-2 mr-3 rounded-full bg-purple-50">
          <BarChart3 className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="flex items-center text-base font-medium">
            {isEditMode ? 'KPI 목표 수정' : '새 KPI 목표 등록'}
          </h3>
          <p className="text-sm text-gray-500">
            기후 변화 관련 지표와 목표를 관리합니다.
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* 지표 선택 섹션 */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Label className="mb-2 text-sm font-medium text-slate-700">지표 유형</Label>
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
                <Label className="mb-2 text-sm font-medium text-slate-700">
                  세부 지표
                </Label>
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
              <Label className="mb-2 text-sm font-medium text-slate-700">목표 기간</Label>
              <div
                className={`flex items-center h-10 px-3 rounded-md border ${
                  baseYear && goalYear && baseYear < goalYear
                    ? THEME_STYLE.bg
                    : 'bg-white'
                }`}>
                <span
                  className={`${
                    baseYear && goalYear && baseYear < goalYear
                      ? THEME_STYLE.text
                      : 'text-slate-400'
                  }`}>
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

      {/* 버튼 영역 */}
      <div className="flex items-center justify-between pt-4 mt-2 space-x-3">
        {isEditMode && (
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                className="gap-1 text-red-600 bg-white border border-red-600 hover:bg-red-600 hover:text-white"
                disabled={submitting}>
                <Trash className="w-4 h-4" />
                삭제
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center text-red-600">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  KPI 목표 삭제 확인
                </AlertDialogTitle>
                <AlertDialogDescription>
                  정말로 이 KPI 목표를 삭제하시겠습니까? 이 작업은 되돌릴 수 없으며, 모든
                  관련 데이터가 영구적으로 삭제됩니다.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700">
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      삭제 중...
                    </>
                  ) : (
                    '삭제'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        <div className="flex flex-row items-center justify-end w-full space-x-3 ">
          <Button
            variant="outline"
            onClick={() => {
              resetFields() // 취소 시 상태 초기화
              onClose()
            }}
            disabled={submitting}
            className="gap-1">
            취소
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-1 text-white bg-customG hover:bg-customGDark ">
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                처리 중...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditMode ? '저장하기' : '등록하기'}
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
