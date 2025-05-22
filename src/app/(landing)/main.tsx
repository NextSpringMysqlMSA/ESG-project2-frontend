import Image from 'next/image'

export default function Main() {
  return (
    <div className="flex justify-center items-center w-full min-h-[calc(100vh-64px)]">
      <div className="flex flex-col w-full h-full max-w-screen-xl py-16 md:flex-row">
        <div className="flex flex-col w-full md:w-[50%] h-full p-4 space-y-4">
          <div className="flex flex-col items-center w-full h-full p-8 space-y-4 bg-white shadow rounded-xl">
            <div className="flex flex-col justify-start w-full space-y-4">
              <h1 className="text-2xl">ESG 프레임워크에 따른 데이터 관리</h1>
              <h3>- 공시/평가별 데이터 항목 관리</h3>
              <h3>- 비주얼 대시보드를 통한 시계열 추이비교</h3>
            </div>
            <Image
              src="/images/dashboard.gif"
              alt="대시보드"
              width={500}
              height={300}
              className="border rounded-xl"
            />
          </div>
          <div className="flex flex-col items-center w-full h-full p-8 space-y-4 bg-white shadow rounded-xl">
            <div className="flex flex-col justify-start w-full space-y-4">
              <h1 className="text-2xl">GRI (Global Reporting Initiative)</h1>
              <h3>- GRI 항목별 데이터 관리 및 검토 지원</h3>
              <h3>- 누락된 항목을 한 페이지에서 직관적으로 확인</h3>
            </div>
            <Image
              src="/images/GRI.gif"
              alt="대시보드"
              width={500}
              height={300}
              className="border rounded-xl"
            />
          </div>
          <div className="flex flex-col items-center w-full h-full p-8 space-y-4 bg-white shadow rounded-xl">
            <div className="flex flex-col justify-start w-full space-y-4">
              <h1 className="text-2xl">공급망 실사</h1>
              <h3>- EU 공급 실사, 인권실사, 환경실사 자기 관리</h3>
              <h3>- 실사 현황에 따른 대응 방안 제안</h3>
            </div>
            <Image
              src="/images/csddd.gif"
              alt="대시보드"
              width={500}
              height={300}
              className="border rounded-xl"
            />
          </div>
        </div>
        <div className="flex flex-col w-full md:w-[50%] h-full p-4 space-y-4 md:mt-36">
          <div className="flex flex-col items-center w-full h-full p-8 space-y-4 bg-white shadow rounded-xl">
            <div className="flex flex-col justify-start w-full space-y-4">
              <h1 className="text-2xl">
                TCFD (Task Force on Climate-related Financial Disclosure)
              </h1>
              <h3>- 거버넌스, 전략, 목표 및 지표 데이터 관리 지원</h3>
              <h3>- SSP 시나리오 기반 기후 분석 및 넷제로 시뮬레이션 지원</h3>
              <h3>- 사용자 입력 기반 넷제로 로드맵 및 그래프 제공</h3>
              <h3>- 데이터를 시각적으로 확인하여 성과 추이를 쉽게 파악</h3>
            </div>
            <Image
              src="/images/governance.gif"
              alt="대시보드"
              width={500}
              height={300}
              className="border rounded-xl"
            />
          </div>
          <div className="flex flex-col items-center w-full h-full p-8 space-y-4 bg-white shadow rounded-xl">
            <div className="flex flex-col justify-start w-full space-y-4">
              <h1 className="text-2xl">협력사 실시간 관리</h1>
              <h3>- 협력사 ESG 데이터 실시간 취합 및 알림 서비스</h3>
              <h3>- 협력사별 추이 비교 및 이슈 이력 관리 기능</h3>
            </div>
            <Image
              src="/images/partner.gif"
              alt="대시보드"
              width={500}
              height={300}
              className="border rounded-xl"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
