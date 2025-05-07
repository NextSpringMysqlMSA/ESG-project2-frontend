'use client'

import {useState, useEffect} from 'react'
import InputBox from '@/components/tools/inputBox'
import CustomSelect from '@/components/tools/customSelect'
import DashButton from '@/components/tools/dashButton'
import {useKPIGoalStore} from '@/stores/IFRS/goal/useKPIGoalStore'
import {createKPIGoal, updateKPIGoal, deleteKPIGoal, fetchKPIGoal} from '@/services/goal'
import {showError, showSuccess} from '@/util/toast'
import axios from 'axios'

type KPIGoalProps = {
  onClose: () => void
  rowId?: number
  mode: 'add' | 'edit'
}

export default function KPIGoal({onClose, rowId, mode}: KPIGoalProps) {
  const isEditMode = mode === 'edit'
  const [submitting, setSubmitting] = useState(false)

  const indicator2 = ['GHG 배출량', '에너지', '물 자원', '폐기물', 'ESG 인센티브']
  const detailedIndicator2: Record<string, string[]> = {
    'GHG 배출량': ['Scope 1', 'Scope 2', 'Scope 3', '직접 입력'],
    에너지: ['전력 소비 총량', '재생에너지 비율', '직접 입력'],
    '물 자원': ['총 취수량', '재이용수 비율', '직접 입력'],
    폐기물: ['폐기물 총량', '재활용률', '위험 폐기물 배출', '직접 입력'],
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

  useEffect(() => {
    if (isEditMode && rowId !== undefined) {
      // 수정 모드: API에서 데이터 로드
      initFromApi(rowId)
    } else {
      // 추가 모드: 로컬 스토리지에서 데이터 로드
      initFromStorage()
    }

    // 언마운트 시 저장 (추가 모드인 경우만)
    return () => {
      if (!isEditMode) {
        persistToStorage()
      } else {
        resetFields() // 수정 모드일 때만 상태 초기화
      }
    }
  }, [isEditMode, rowId, initFromApi, initFromStorage, persistToStorage, resetFields])

  const handleSubmit = async () => {
    if (
      !indicator ||
      !detailedIndicator ||
      !unit ||
      !baseYear ||
      !goalYear ||
      !referenceValue ||
      !currentValue ||
      !targetValue
    ) {
      showError('모든 필드를 채워주세요.')
      return
    }

    const KPIGoalData = {
      indicator,
      detailedIndicator,
      unit,
      baseYear: Number(baseYear),
      goalYear: Number(goalYear),
      referenceValue: Number(referenceValue),
      currentValue: Number(currentValue),
      targetValue: Number(targetValue)
    }

    try {
      setSubmitting(true)

      if (isEditMode && rowId !== undefined) {
        // 수정 모드: 업데이트 API 호출
        const updateData = {...KPIGoalData, id: rowId}
        await updateKPIGoal(rowId, updateData)
        showSuccess('KPI 목표가 성공적으로 수정되었습니다.')
      } else {
        // 추가 모드: 생성 API 호출
        await createKPIGoal(KPIGoalData)
        showSuccess('KPI 목표가 성공적으로 저장되었습니다.')
        localStorage.removeItem('kpigoal-storage')
      }

      // 목록 다시 가져오기
      const updatedList = await fetchKPIGoal()
      setData(updatedList)
      resetFields()
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

  const handleDelete = async () => {
    if (rowId === undefined) return

    try {
      setSubmitting(true)
      await deleteKPIGoal(rowId)
      showSuccess('KPI 목표가 성공적으로 삭제되었습니다.')

      const updatedList = await fetchKPIGoal()
      setData(updatedList)
      resetFields()
      onClose()
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : '삭제 실패: 서버 오류가 발생했습니다.'
      showError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col w-full h-full mt-4 space-y-4">
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-[50%] pr-2 space-y-4">
          <CustomSelect
            placeholder="지표"
            options={indicator2}
            value={indicator}
            onValueChange={value => {
              setField('indicator', value)
              setField('detailedIndicator', '') // 선택 리스크 종류 바뀌면 유형 초기화
            }}
          />
          <InputBox
            label="단위"
            value={unit}
            onChange={e => setField('unit', e.target.value)}
          />
          <InputBox
            label="기준 연도"
            value={baseYear}
            onChange={e => setField('baseYear', Number(e.target.value))}
          />
          <InputBox
            label="목표 수치"
            value={targetValue}
            onChange={e => setField('targetValue', Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col w-[50%] pl-2 space-y-4">
          {indicator && (
            <CustomSelect
              placeholder="세부 지표"
              options={detailedIndicator2[indicator] ?? []}
              value={detailedIndicator}
              onValueChange={value => setField('detailedIndicator', value)}
            />
          )}
          <InputBox
            label="목표 연도"
            value={goalYear}
            onChange={e => setField('goalYear', Number(e.target.value))}
          />
          <InputBox
            label="기준값"
            value={referenceValue}
            onChange={e => setField('referenceValue', Number(e.target.value))}
          />
          <InputBox
            label="현재수치"
            value={currentValue}
            onChange={e => setField('currentValue', Number(e.target.value))}
          />
        </div>
      </div>
      <div className="flex justify-center mt-4 space-x-4">
        {isEditMode && (
          <DashButton
            width="w-24"
            className="text-white bg-red-500 border-red-500 hover:bg-red-600"
            onClick={handleDelete}
            disabled={submitting}>
            삭제
          </DashButton>
        )}
        <DashButton width="w-24" onClick={handleSubmit} disabled={submitting}>
          {submitting ? '저장 중...' : isEditMode ? '수정' : '저장'}
        </DashButton>
      </div>
    </div>
  )
}
