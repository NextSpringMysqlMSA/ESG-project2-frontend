import Link from 'next/link'

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
      <span className="text-4xl font-bold">______에 로그인하세요</span>
      <div className="grid p-4 space-y-4 bg-white shadow-xl grid-rows rounded-3xl w-120">
        <input
          className="w-full pl-4 text-2xl border-1 rounded-3xl h-14 text-start"
          placeholder="아이디"
        />
        <input
          className="w-full pl-4 text-2xl border-1 rounded-3xl h-14 text-start"
          placeholder="비밀번호"
        />
        <div className="flex flex-col items-center w-full space-y-4">
          <Link href="/home">
            <button className="w-40 text-2xl text-white bg-[#1890FF] rounded-3xl h-14 hover:cursor-pointer">
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
