import { DatePickerForm } from "@/components/layout/datePicker"

export default function Education() {
  return (
    <div className="flex flex-col h-full mt-8 space-y-4">
      <span>환경 교육 기록</span>
      <input
        className="w-full h-12 pl-4 border border-gray-300"
        placeholder="교육 제목 (예: 2025년 전사 환경교육)"
      />

      <input
        className="w-full h-12 pl-4 border border-gray-300"
        placeholder="교육 주요 내용 (예: 온실가스. 기후리스 대응 등)"
      />
      <DatePickerForm>
      <button className="p-2 text-white border w-28 rounded-xl bg-customG" type="submit">
        + 교육 추가
      </button>
      </DatePickerForm>
    </div>
  )
}
