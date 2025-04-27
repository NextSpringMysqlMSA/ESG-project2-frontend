import Link from 'next/link'

export default function HomeNavbar() {
  return (
    <div className="flex flex-row items-center justify-between w-full p-2 shadow-sm">
      <Link href="/" className="flex flex-row items-center">
        <img src="/dash.svg" alt="logo" className="w-12 mr-4" />
        <span className="text-3xl font-bold">_______</span>
      </Link>
      <div className="flex flex-row gap-4">
        <Link href="/">
          <button className="flex items-center justify-center w-24 h-12 text-white bg-[#1890FF] rounded-3xl hover:cursor-pointer">
            로그아웃
          </button>
        </Link>
        <Link href="/mypage">
          <button className="flex w-12 h-12 bg-[#1890FF] rounded-3xl hover:cursor-pointer"></button>
        </Link>
      </div>
    </div>
  )
}
