'use client'

import {useState} from 'react'
import InputBox from '@/components/tools/inputBox'
import CustomSelect from '@/components/tools/customSelect'
import DashButton from '@/components/tools/dashButton'

type MeetingProps = {
  onClose: () => void
}

export default function KPIGoal({onClose}: MeetingProps) {
  const goalYear = ['1', '2', '3']

  // 상태 정의
  const [indicator, setIndicator] = useState('')
  const [unit, setUnit] = useState('')
  const [baseYear, setBaseYear] = useState('')
  const [goalValue, setGoalValue] = useState('')
  const [targetYear, setTargetYear] = useState('')
  const [referenceValue, setReferenceValue] = useState('')
  const [currentValue, setCurrentValue] = useState('')

  const handleSubmit = () => {
    // 유효성 검사 예시
    if (
      !indicator ||
      !unit ||
      !baseYear ||
      !goalValue ||
      !targetYear ||
      !referenceValue ||
      !currentValue
    ) {
      alert('모든 값을 입력해주세요.')
      return
    }

    // 저장 처리 로직 작성
    console.log({
      indicator,
      unit,
      baseYear,
      goalValue,
      targetYear,
      referenceValue,
      currentValue
    })

    onClose()
  }

  return (
    <div className="flex flex-col w-full h-full mt-4 space-y-4">
      <div className="flex flex-col w-[50%] pr-2 space-y-4">
        <CustomSelect
          placeholder="지표"
          options={goalYear}
          onValueChange={value => setIndicator(value)}
        />
      </div>

      <div className="flex flex-row w-full">
        <div className="flex flex-col w-[50%] pr-2 space-y-4">
          <InputBox label="단위" value={unit} onChange={e => setUnit(e.target.value)} />
          <InputBox
            label="기준 연도"
            value={baseYear}
            onChange={e => setBaseYear(e.target.value)}
          />
          <InputBox
            label="목표 수치"
            value={goalValue}
            onChange={e => setGoalValue(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-[50%] pl-2 space-y-4">
          <CustomSelect
            placeholder="목표 연도"
            options={goalYear}
            onValueChange={value => setTargetYear(value)}
          />
          <CustomSelect
            placeholder="기준값"
            options={goalYear}
            onValueChange={value => setReferenceValue(value)}
          />
          <CustomSelect
            placeholder="현재수치"
            options={goalYear}
            onValueChange={value => setCurrentValue(value)}
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
