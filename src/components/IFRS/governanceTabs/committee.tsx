export default function Committee() {
  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <span className="flex flex-row font-bold">위원회 및 조직 입력</span>
      <input
        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        placeholder="위원회 이름(예: ESG 위원회)"
      />
      <input
        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        placeholder="구성원 이름 / 직책 / 소속"
      />
      <input
        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        placeholder="기후 관련 역할 및 책임 설명"
      />
      <button className="p-2 text-white border w-28 rounded-xl bg-customG">
        + 구성원 추가
      </button>
      <div className="flex flex-row justify-center w-full">
        <button className="flex items-center justify-center w-24 p-2 text-white rounded-xl bg-customG">
          저장
        </button>
      </div>
    </div>
  )
}
