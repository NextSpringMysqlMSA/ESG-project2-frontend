export default function Footer() {
  return (
    <div className="flex w-full p-12 text-sm text-white bg-gray-900">
      <div className="max-w-4xl space-y-8">
        <div className="flex flex-wrap text-gray-300 gap-x-8 gap-y-3">
          <a href="#" className="transition-colors hover:text-customG">
            NSMM 소개
          </a>
          <a href="#" className="transition-colors hover:text-customG">
            기사제보
          </a>
          <a href="#" className="transition-colors hover:text-customG">
            광고문의
          </a>
          <a href="#" className="transition-colors hover:text-customG">
            개인정보취급방침
          </a>
          <a href="#" className="transition-colors hover:text-customG">
            청소년보호정책
          </a>
          <a href="#" className="transition-colors hover:text-customG">
            이메일무단수집거부
          </a>
        </div>
        <div className="text-gray-400 leading-relaxed text-[13px] border-t border-gray-700 pt-8">
          <p>
            서울특별시 강남구 강남대로94길 20 | 대표전화 : 02-1234-1234 | 팩스 :
            02-1234-1234
          </p>
          <p>대표자 : 지희연 | 청소년보호책임자 : 지희연</p>
          <p>버전 : 2.0</p>
          <p className="mt-4">
            ⓒ 2025 NSMM. 무단 전재 및 재배포 금지. Contact: nsmm@project.com
          </p>
        </div>
      </div>
    </div>
  )
}
