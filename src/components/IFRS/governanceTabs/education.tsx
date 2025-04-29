import { DatePickerForm } from "@/components/layout/datePicker"

export default function Education() {
  return (
    <div className="flex flex-col h-full mt-4 space-y-4">
      <span className="flex flex-row font-bold">환경 교육 기록</span>
      <input
        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        placeholder="교육 제목 (예: 2025년 전사 환경교육)"
      />
      <input
        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        placeholder="일자 및 참석자 수 (예: 2025.03.15/900명)"
      />
      <input
        className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
        placeholder="교육 주요 내용 (예: 온실가스. 기후리스 대응 등)"
      />
      <DatePickerForm>
      <button className="p-2 text-white border w-28 rounded-xl bg-customG" type="submit">
        + 교육 추가
      </button>
      </DatePickerForm>
      <div className="flex flex-row justify-center w-full">
        <button className="flex items-center justify-center w-24 p-2 text-white rounded-xl bg-customG">
          저장
        </button>
      </div>
    </div>
  )
}
