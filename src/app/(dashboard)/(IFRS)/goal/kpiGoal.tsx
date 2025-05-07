'use client'

import {useState} from 'react'
import InputBox from '@/components/tools/inputBox'
import CustomSelect from '@/components/tools/customSelect'
import DashButton from '@/components/tools/dashButton'
import {useKPIGoalStore} from '@/stores/IFRS/goal/useKPIGoalStore'
import {createKPIGoal, fetchKPIGoal} from '@/services/goal'
import {showError, showSuccess} from '@/util/toast'

type MeetingProps = {
  onClose: () => void
}

export default function KPIGoal({onClose}: MeetingProps) {
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
    setData
  } = useKPIGoalStore()

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
      baseYear,
      goalYear,
      referenceValue,
      currentValue,
      targetValue
    }

    try {
      // API 호출
      await createKPIGoal(KPIGoalData)
      const updatedList = await fetchKPIGoal()
      setData(updatedList)
      showSuccess('경영진 KPI 정보가 성공적으로 저장되었습니다.')
      useKPIGoalStore.getState().resetFields()
      onClose()
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || '저장 실패: 서버 오류가 발생했습니다.'
      showError(errorMessage)
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
            onChange={e => setField('baseYear', e.target.value)}
          />
          <InputBox
            label="목표 수치"
            value={targetValue}
            onChange={e => setField('targetValue', e.target.value)}
          />
        </div>
        <div className="flex flex-col w-[50%] pl-2 space-y-4">
          {indicator2 && (
            <CustomSelect
              placeholder="리스크 유형"
              options={detailedIndicator2[indicator] ?? []}
              value={detailedIndicator}
              onValueChange={value => setField('detailedIndicator', value)}
            />
          )}
          <InputBox
            label="목표 연도"
            value={goalYear}
            onChange={e => setField('goalYear', e.target.value)}
          />
          <InputBox
            label="기준값"
            value={referenceValue}
            onChange={e => setField('referenceValue', e.target.value)}
          />
          <InputBox
            label="현재수치"
            value={currentValue}
            onChange={e => setField('currentValue', e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24" onClick={handleSubmit}>
          저장
        </DashButton>
      </div>
    </div>
  )
}
