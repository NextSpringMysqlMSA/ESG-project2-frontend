import {DatePickerForm} from '@/components/layout/datePicker'
import InputBox from '@/components/tools/inputBox'
import DashButton from '@/components/tools/dashButton'

export default function Education() {
  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <InputBox label="교육 제목 (예: 2025년 전사 환경교육)" />
      <InputBox label="일자 및 참석자 수 (예: 2025.03.15/900명)" />
      <InputBox label="교육 주요 내용 (예: 온실가스. 기후리스 대응 등)" />
      <DatePickerForm>
        <DashButton type="submit" width="w-26">
          + 교육 추가
        </DashButton>
      </DatePickerForm>
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24">저장</DashButton>
      </div>
    </div>
  )
}
