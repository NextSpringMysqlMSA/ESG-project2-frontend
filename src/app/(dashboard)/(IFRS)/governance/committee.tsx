import InputBox from '@/components/tools/inputBox'
import DashButton from '@/components/tools/dashButton'

export default function Committee() {
  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <InputBox label="위원회 이름(예: ESG 위원회)" />
      <InputBox label="구성원 이름 / 직책 / 소속" />
      <InputBox label="기후 관련 역할 및 책임 설명" />
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24">저장</DashButton>
      </div>
    </div>
  )
}
