'use client'

import Link from 'next/link'

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-6">
      <div className="flex flex-col px-8 py-8 space-y-4 w-[400px] bg-white border shadow-xl rounded-2xl">
        <div className="text-2xl font-bold text-center">로그인</div>

        {/* 이메일 입력 */}
        <input
          type="email"
          placeholder="이메일"
          className="w-full p-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-customG"
        />

        {/* 비밀번호 입력 */}
        <input
          type="password"
          placeholder="비밀번호"
          className="w-full p-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-customG"
        />

        {/* 로그인 버튼 */}
        <Link href="/home">
          <button className="w-full h-12 bg-customG text-white text-base rounded-lg hover:bg-white hover:text-customG border border-customG transition-all duration-300">
            로그인
          </button>
        </Link>

        {/* 회원가입 링크 */}
        <div className="text-center text-sm">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-customG font-semibold hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  )
}
