import Link from 'next/link'

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
      <span className="text-4xl font-bold">NSMM</span>
      <div className="grid px-12 py-8 space-y-4 w-[400px] bg-white border shadow-xl grid-rows rounded-3xl w-120">
        <span className="text-4xl font-bold text-center">회원가입</span>
        <input
          className="w-full pl-4 text-xl border-b-2 h-14 text-start"
          placeholder="이름"
        />
        <input
          className="w-full pl-4 text-xl border-b-2 h-14 text-start"
          placeholder="이메일"
        />
        <input
          className="w-full pl-4 text-xl border-b-2 h-14 text-start"
          placeholder="전화번호"
        />
        <input
          className="w-full pl-4 text-xl border-b-2 h-14 text-start"
          placeholder="회사명"
        />
        <input
          className="w-full pl-4 text-xl border-b-2 h-14 text-start"
          placeholder="직급"
        />
        <input
          className="w-full pl-4 text-xl border-b-2 h-14 text-start"
          placeholder="비밀번호"
        />
        <input
          className="w-full pl-4 text-xl border-b-2 h-14 text-start"
          placeholder="비밀번호 확인"
        />
        <div className="flex flex-col items-center w-full space-y-4">
          <Link href="/home">
            <button className="w-28 text-xl text-white bg-[#1890FF] rounded-3xl h-12 hover:cursor-pointer">
              회원가입
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
