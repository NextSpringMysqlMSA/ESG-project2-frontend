export default function KPI() {
  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <span className="flex flex-row font-bold">경영진 KPI 입력</span>
      <input
        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        placeholder="경영진 이름 (예: CEO 김ㅇㅇ)"
      />
      <input
        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        placeholder="KPI명 (예: 탄소배출량 감축률)"
      />
      <input
        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        placeholder="목표율/목표값 (예: 10% 혹은 10000tCO2eq)"
      />
      <input
        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        placeholder="달성률/달성값 (예: 10% 혹은 10000tCO2eq)"
      />
      <button className="p-2 border w-28 rounded-xl bg-[#57BF3D] text-white">
        + KPI 추가
      </button>
      <div className="flex flex-row justify-center w-full">
        <button className="flex items-center justify-center w-24 p-2 text-white rounded-xl bg-customG">
          저장
        </button>
      </div>
    </div>
  )
}
