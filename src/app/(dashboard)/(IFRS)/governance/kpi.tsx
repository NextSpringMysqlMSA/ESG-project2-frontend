import DashButton from '@/components/dashButton'
import InputBox from '@/components/inputBox'

export default function KPI() {
  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <span className="flex flex-row font-bold">경영진 KPI 입력</span>
      <InputBox placeholder="경영진 이름 (예: CEO 김ㅇㅇ)" />
      <InputBox placeholder="KPI명 (예: 탄소배출량 감축률)" />
      <InputBox placeholder="목표율/목표값 (예: 10% 혹은 10000tCO2eq)" />
      <InputBox placeholder="달성률/달성값 (예: 10% 혹은 10000tCO2eq)" />
      <DashButton width="w-24">+ KPI 추가</DashButton>
      <div className="flex flex-row justify-center w-full">
        <DashButton width="w-24">저장</DashButton>
      </div>
    </div>
  )
}
