import Link from 'next/link'

export default function Main() {
  return (
    <main className="relative w-full min-h-screen">
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-customGStart to-white -z-10" />
      <div className="relative z-10">
        <section className="flex flex-col items-center justify-center w-full h-screen text-center px-6 bg-opacity-80">
          <div className="absolute top-6 left-6 text-xl font-bold tracking-tight text-customG">
            NSMM
          </div>
          <div className="max-w-3xl mt-20">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
              신뢰할 수 있는 ESG 데이터 플랫폼
            </h1>
            <h2 className="text-2xl font-semibold text-customG mb-6">NSMM</h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              정확한 분석, 실시간 알림, 공급망 리스크까지 한눈에.
              <br />
              지금 NSMM으로 ESG 관리를 시작하세요.
            </p>
            <Link href="/login">
              <button className="px-8 py-3 text-white bg-customG hover:bg-green-600 rounded-full text-lg shadow-md transition">
                무료로 시작하기
              </button>
            </Link>
          </div>
        </section>

        <section className="w-full min-h-[110vh] py-24 px-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {[
              {
                title: 'ESG 프레임워크에 따른 데이터 관리',
                desc: '다양한 ESG 데이터 항목 관리'
              },
              {
                title: '공급망 실사',
                desc: '공급망 내 리스크 파악 및 대응 정보 제공'
              },
              {
                title: '협력사 실사 관리',
                desc: '협력사 대상 실사 정보 관리 및 평가'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200 shadow-sm p-8 rounded-lg flex flex-col justify-between min-h-[240px] transition hover:shadow-md">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </div>
                <button className="mt-6 px-4 py-2 text-sm font-medium text-customG border border-customG hover:bg-customG hover:text-white rounded transition">
                  리포트 살펴보기
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full bg-[#f8f8f8] text-gray-800 py-12 px-6 text-xs border-t border-gray-300">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
              <span className="hover:underline cursor-pointer">NSMM 소개</span>
              <span className="hover:underline cursor-pointer">기사제보</span>
              <span className="hover:underline cursor-pointer">광고문의</span>
              <span className="hover:underline cursor-pointer">불편신고</span>
              <span className="hover:underline cursor-pointer">개인정보취급방침</span>
              <span className="hover:underline cursor-pointer">청소년보호정책</span>
              <span className="hover:underline cursor-pointer">이메일무단수집거부</span>
            </div>
            <p className="leading-relaxed text-[13px]">
              서울특별시 강남구 강남대로94길 20 | 대표전화 : 02-1234-1234 | 팩스 :
              02-1234-1234 | 대표자 : 지희연 | 청소년보호책임자 : 지희연
              <br />ⓒ 2025 NSMM. 무단 전재 및 재배포 금지. Contact: nsmm@project.com
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
