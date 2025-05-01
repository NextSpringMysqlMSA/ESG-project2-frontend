'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import AuthInputBox from '@/components/tools/authInputBox'
import {useAuthStore} from '@/stores/authStore'
import {loginApi} from '@/services/auth'
import {showError, showSuccess} from '@/util/toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const setAuth = useAuthStore(state => state.setAuth)
  const router = useRouter()

  const handleLogin = async () => {
    if (!email || !password) {
      showError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    try {
      const token = await loginApi(email, password)
      setAuth(token)
      showSuccess('로그인 성공!')
      router.push('/home')
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message ||
        '로그인 실패: 이메일 또는 비밀번호가 올바르지 않습니다.'
      showError(errorMessage)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-6 bg-[#F9FBFF]">
      <div className="flex flex-col px-8 py-8 space-y-4 w-[400px] bg-white border shadow-xl rounded-2xl">
        <div className="text-2xl font-bold text-center">로그인</div>
        <AuthInputBox
          type="email"
          placeholder="이메일"
          value={email}
          onChange={setEmail}
        />
        <AuthInputBox
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={setPassword}
        />
        <button
          onClick={handleLogin}
          className="w-full h-12 text-base text-white transition-all duration-300 border rounded-lg bg-customG hover:bg-white hover:text-customG border-customG">
          로그인
        </button>
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
