'use client'
import InputBox from '@/components/tools/inputBox'
import CustomSelect from '@/components/tools/customSelect'
import DashButton from '@/components/tools/dashButton'

export default function KPIGoal() {
  const characteristic = []
  const goalYear = ['1', '2', '3']
  const referenceValue = []
  const currentValue = []

  return (
    <div className="flex flex-col w-full h-full mt-4 space-y-4">
      <div className="flex flex-col w-[50%] pr-2 space-y-4">
        <CustomSelect
          placeholder="지표"
          options={goalYear}
          onValueChange={value => console.log('선택된 값:', value)}
        />
      </div>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-[50%] pr-2 space-y-4">
          <InputBox label="단위" />
          <InputBox label="기준 연도" />
          <InputBox label="목표 수치" />
        </div>
        <div className="flex flex-col w-[50%] pl-2 space-y-4">
          <CustomSelect
            placeholder="목표 연도"
            options={goalYear}
            onValueChange={value => console.log('선택된 값:', value)}
          />
          <CustomSelect
            placeholder="기준값"
            options={goalYear}
            onValueChange={value => console.log('선택된 값:', value)}
          />
          <CustomSelect
            placeholder="현재수치"
            options={goalYear}
            onValueChange={value => console.log('선택된 값:', value)}
          />
        </div>
      </div>
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24">저장</DashButton>
      </div>
    </div>
  )
}
