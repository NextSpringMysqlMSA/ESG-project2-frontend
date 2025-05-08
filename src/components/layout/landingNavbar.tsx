import Link from 'next/link'

export default function LandingNavBar() {
  return (
    <div className="fixed z-50 w-full">
      <div className="flex flex-row items-center justify-between w-full p-2 bg-white shadow-sm">
        <Link href="/" className="flex flex-row items-center">
          <img src="/dash.svg" alt="logo" className="w-12 mr-4" />
          <span className="text-3xl font-bold text-customG">NSMM</span>
        </Link>
        <Link href="/login">
          <button className="flex items-center justify-center w-24 p-2 text-white transition-all duration-200 border rounded-xl bg-customG border-customG hover:bg-white hover:text-customG hover:border-customG">
            시작하기
          </button>
        </Link>
      </div>
    </div>
  )
}
