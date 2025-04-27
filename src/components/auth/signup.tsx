import Link from 'next/link'

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
      <span className="text-4xl font-bold">회원가입</span>
      <div className="grid p-4 space-y-4 bg-white shadow-xl grid-rows rounded-3xl w-120">
        <input
          className="w-full pl-4 text-2xl border-1 rounded-3xl h-14 text-start"
          placeholder="이름"
        />
        <input
          className="w-full pl-4 text-2xl border-1 rounded-3xl h-14 text-start"
          placeholder="이메일"
        />
        <input
          className="w-full pl-4 text-2xl border-1 rounded-3xl h-14 text-start"
          placeholder="전화번호"
        />
        <input
          className="w-full pl-4 text-2xl border-1 rounded-3xl h-14 text-start"
          placeholder="회사명"
        />
        <input
          className="w-full pl-4 text-2xl border-1 rounded-3xl h-14 text-start"
          placeholder="직급"
        />
        <input
          className="w-full pl-4 text-2xl border-1 rounded-3xl h-14 text-start"
          placeholder="비밀번호"
        />
        <input
          className="w-full pl-4 text-2xl border-1 rounded-3xl h-14 text-start"
          placeholder="비밀번호 확인"
        />
        <div className="flex flex-col items-center w-full space-y-4">
          <Link href="/home">
            <button className="w-40 text-2xl text-white bg-[#1890FF] rounded-3xl h-14 hover:cursor-pointer">
              회원가입
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
