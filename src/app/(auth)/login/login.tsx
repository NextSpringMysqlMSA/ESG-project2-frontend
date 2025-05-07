'use client'

import {useEffect, useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import Link from 'next/link'
import AuthInputBox from '@/components/tools/authInputBox'
import {useAuthStore} from '@/stores/authStore'
import {loginApi} from '@/services/auth'
import {showError, showSuccess} from '@/util/toast'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const setAuth = useAuthStore(state => state.setAuth)
  const router = useRouter()

  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('error') === 'unauthorized') {
      toast.error('로그인이 필요합니다.')
    }
  }, [searchParams])

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
    } catch (err: unknown) {
      let errorMessage = '로그인 실패: 알 수 없는 오류가 발생했습니다.'
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof err.response === 'object' &&
        err.response !== null &&
        'data' in err.response &&
        typeof err.response.data === 'object' &&
        err.response.data !== null &&
        'message' in err.response.data &&
        typeof err.response.data.message === 'string'
      ) {
        errorMessage = err.response.data.message
      }
      showError(errorMessage)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-6 bg-[#F9FBFF]">
      <form
        onSubmit={e => {
          e.preventDefault()
          handleLogin()
        }}
        className="flex flex-col px-8 py-8 space-y-4 w-[400px] bg-white border shadow-xl rounded-2xl">
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
          type="submit" // ✅ 꼭 필요!
          className="w-full h-12 text-base text-white transition-all duration-300 border rounded-lg bg-customG hover:bg-white hover:text-customG border-customG">
          로그인
        </button>
        <div className="text-sm text-center">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="font-semibold text-customG hover:underline">
            회원가입
          </Link>
        </div>
      </form>
    </div>
  )
}
