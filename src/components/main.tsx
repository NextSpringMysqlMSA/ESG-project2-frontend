import Link from 'next/link'

export default function Main() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen space-y-24">
      <div className="flex flex-row items-center justify-center w-full">
        <img src="/dash.svg" alt="icon" className="h-24 mr-4" />
        <span className="text-5xl font-bold text-black">NSMM</span>
      </div>
      <Link href="/login">
        <button className="items-center w-40 text-3xl text-center text-white bg-[#1890FF] rounded-3xl h-14 hover:cursor-pointer">
          시작
        </button>
      </Link>
    </div>
  )
}
