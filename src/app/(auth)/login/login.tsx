'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'
import AuthInputBox from '@/components/authInputBox'
import api from '@/lib/axios'
import {useAuthStore} from '@/stores/authStore'
import {loginApi} from '@/services/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const setAuth = useAuthStore(state => state.setAuth)
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const token = await loginApi(email, password)
      setAuth(token)
      console.log('로그인 성공:', token)
      router.push('/home')
    } catch (err) {
      alert('로그인 실패: 이메일/비밀번호 확인')
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
