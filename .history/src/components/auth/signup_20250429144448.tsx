import Link from 'next/link'

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
      <span className="text-4xl font-bold">지금 만드세요.</span>
      <div className="flex flex-col px-12 py-8 space-y-6 w-[400px] bg-white border shadow-xl rounded-3xl">
        <div className="text-4xl font-bold text-center">회원가입</div>
        <label className="w-full text-xl font-medium">
          이름 <span className="text-red-600">*</span>
          <input
            className="w-full mt-1 p-3 border rounded-xl text-xl"
            placeholder="이름"
          />
        </label>
        <label className="w-full text-xl font-medium">
          이메일 <span className="text-red-600">*</span>
          <input
            className="w-full mt-1 p-3 border rounded-xl text-xl"
            placeholder="이메일"
          />
        </label>
        <label className="w-full text-xl font-medium">
          전화번호 <span className="text-red-600">*</span>
          <input
            className="w-full mt-1 p-3 border rounded-xl text-xl"
            placeholder="전화번호"
          />
        </label>
        <label className="w-full text-xl font-medium">
          회사명
          <input
            className="w-full mt-1 p-3 border rounded-xl text-xl"
            placeholder="회사명"
          />
        </label>
        <label className="w-full text-xl font-medium">
          직급
          <input
            className="w-full mt-1 p-3 border rounded-xl text-xl"
            placeholder="직급"
          />
        </label>
        <label className="w-full text-xl font-medium">
          비밀번호 <span className="text-red-600">*</span>
          <input
            className="w-full mt-1 p-3 border rounded-xl text-xl"
            placeholder="비밀번호"
            type="password"
          />
        </label>
        <label className="w-full text-xl font-medium">
          비밀번호 확인 <span className="text-red-600">*</span>
          <input
            className="w-full mt-1 p-3 border rounded-xl text-xl"
            placeholder="비밀번호 확인"
            type="password"
          />
        </label>
        <button className="w-full h-12 text-xl text-white bg-customG rounded-3xl hover:cursor-pointer">
          계정 생성
        </button>
        <div className="text-center text-lg">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-customG font-semibold">
            로그인
          </Link>
        </div>
      </div>
    </div>
  )
}
