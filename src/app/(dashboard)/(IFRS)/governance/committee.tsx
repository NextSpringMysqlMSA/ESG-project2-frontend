import InputBox from '@/components/inputBox'
import DashButton from '@/components/dashButton'

export default function Committee() {
  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <span className="flex flex-row font-bold">위원회 및 조직 입력</span>
      <InputBox placeholder="위원회 이름(예: ESG 위원회)" />
      <InputBox placeholder="구성원 이름 / 직책 / 소속" />
      <InputBox placeholder="기후 관련 역할 및 책임 설명" />
      <DashButton width="w-28">+ 구성원 추가</DashButton>
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24">저장</DashButton>
      </div>
    </div>
  )
}
