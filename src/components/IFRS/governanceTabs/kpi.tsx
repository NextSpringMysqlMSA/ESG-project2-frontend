export default function KPI() {
  return (
    <div className="flex flex-col h-full mt-8 space-y-4">
      <span>경영진 KPI 입력</span>
      <input
        className="w-full h-12 pl-4 border border-gray-300"
        placeholder="경영진 이름 (예: CEO 김ㅇㅇ)"
      />
      <input
        className="w-full h-12 pl-4 border border-gray-300"
        placeholder="KPI명 (예: 탄소배출량 감축률)"
      />
      <input
        className="w-full h-12 pl-4 border border-gray-300"
        placeholder="목표율/목표값 (예: 10% 혹은 10000tCO2eq)"
      />
      <input
        className="w-full h-12 pl-4 border border-gray-300"
        placeholder="달성률/달성값 (예: 10% 혹은 10000tCO2eq)"
      />
      <button className="p-2 border w-28 rounded-xl bg-[#57BF3D] text-white">
        + KPI 추가
      </button>
    </div>
  )
}
