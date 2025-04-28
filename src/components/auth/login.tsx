import Link from 'next/link'

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-10">
      {/* 헤더============================================================================ */}
      <span className="text-4xl font-bold">NSMM</span>
      {/* 로그인 폼======================================================================== */}
      <div className="grid px-12 py-8 space-y-4 bg-white border shadow-xl w-[400px] grid-rows rounded-3xl">
        <span className="text-4xl font-bold text-center">로그인</span>
        <input
          className="w-full pl-4 text-xl border-b-2 h-14 text-start"
          placeholder="이메일"
        />
        <input
          className="w-full pl-4 text-xl border-b-2 h-14 text-start"
          placeholder="비밀번호"
        />
        <div className="flex flex-col items-center w-full space-y-4">
          <Link href="/home">
            <button className="w-28 text-xl text-white bg-[#1890FF] rounded-3xl h-12 hover:cursor-pointer">
              로그인
            </button>
          </Link>
          <div className="flex flex-row space-x-2">
            <span>계정이 없으신가요?</span>
            <Link href="/signup">
              <span className="text-[#1890FF] hover:underline">회원가입</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
