import DashButton from '@/components/dashButton'
import InputBox from '@/components/inputBox'

export default function KPI() {
  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <InputBox label="경영진 이름 (예: CEO 김ㅇㅇ)" />
      <InputBox label="KPI명 (예: 탄소배출량 감축률)" />
      <InputBox label="목표율/목표값 (예: 10% 혹은 10000tCO2eq)" />
      <InputBox label="달성률/달성값 (예: 10% 혹은 10000tCO2eq)" />
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24">저장</DashButton>
      </div>
    </div>
  )
}
