export default function Committee() {
  return (
    <div className="flex flex-col h-full mt-8 space-y-4">
      <span>위원회 및 조직 입력</span>
      <input
        className="w-full h-12 pl-4 border border-gray-300"
        placeholder="위원회 이름(예: ESG 위원회)"
      />
      <input
        className="w-full h-12 pl-4 border border-gray-300"
        placeholder="구성원 이름 / 직책 / 소속"
      />
      <input
        className="w-full h-12 pl-4 border border-gray-300"
        placeholder="기후 관련 역할 및 책임 설명"
      />
      <button className="p-2 text-white border w-28 rounded-xl bg-customG">
        + 구성원 추가
      </button>
    </div>
  )
}
