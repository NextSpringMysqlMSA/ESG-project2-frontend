'use client'

import Link from 'next/link'
import AuthInputBox from '@/components/authInputBox'

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-6 bg-[#F9FBFF]">
      <div className="flex flex-col px-8 py-8 space-y-4 w-[400px] bg-white border shadow-xl rounded-2xl">
        <div className="text-2xl font-bold text-center">로그인</div>
        {/* 이메일 입력 */}
        <AuthInputBox type="email" placeholder="이메일" />
        {/* 비밀번호 입력 */}
        <AuthInputBox type="password" placeholder="비밀번호" />
        {/* 로그인 버튼 */}
        <Link href="/home">
          <button className="w-full h-12 text-base text-white transition-all duration-300 border rounded-lg bg-customG hover:bg-white hover:text-customG border-customG">
            로그인
          </button>
        </Link>
        {/* 회원가입 링크 */}
        <div className="text-sm text-center">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="font-semibold text-customG hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  )
}
