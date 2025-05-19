'use client'

import {useEffect, useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import Link from 'next/link'
import AuthInputBox from '@/components/tools/authInputBox'
import {useAuthStore} from '@/stores/authStore'
import {loginApi} from '@/services/auth'
import {showError, showSuccess} from '@/util/toast'
import toast from 'react-hot-toast'
import axios from 'axios'
import {Leaf, Lock, Mail, ArrowRight} from 'lucide-react'
import {motion} from 'framer-motion'

/**
 * 로그인 페이지 컴포넌트
 * ESG 테마를 적용한 현대적인 디자인
 */
export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
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

    setIsLoading(true)
    try {
      const token = await loginApi(email, password)
      setAuth(token)
      showSuccess('로그인 성공!')
      router.push('/home')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.message || '로그인 실패: 서버 오류가 발생했습니다.'
        showError(msg)
      } else {
        showError('로그인 실패: 알 수 없는 오류가 발생했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // 폼 입력 애니메이션
  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: {y: 20, opacity: 0},
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full p-4">
      <motion.div
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 shadow-md bg-customG rounded-xl">
            <Leaf className="text-white" size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl tracking-tight font-gmBold text-customGTextLight">
              NSMM
            </span>
            <span className="text-sm font-medium text-customG">Dashboard</span>
          </div>
        </div>
      </motion.div>

      <motion.form
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={e => {
          e.preventDefault()
          handleLogin()
        }}
        className="flex flex-col w-full max-w-md p-8 space-y-6 bg-white border border-gray-100 shadow-xl rounded-2xl">
        <motion.div variants={itemVariants} className="text-center">
          <h1 className="text-2xl text-gray-800 font-gmBold">로그인</h1>
          <p className="mt-2 text-sm text-gray-500">
            NSMM 대시보드에 오신 것을 환영합니다
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-5">
          <div className="relative">
            <Mail
              size={18}
              className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
            />
            {/* className prop 대신 스타일이 적용된 부모 div로 감싸기 */}
            <AuthInputBox
              type="email"
              placeholder="이메일"
              value={email}
              onChange={setEmail}
            />
          </div>

          <div className="relative">
            <Lock
              size={18}
              className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
            />
            {/* className prop 대신 스타일이 적용된 부모 div로 감싸기 */}
            <AuthInputBox
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={setPassword}
            />
          </div>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{scale: 1.02}}
          whileTap={{scale: 0.98}}
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center w-full py-3 text-white transition-all duration-300 rounded-lg bg-customG hover:bg-customGDark focus:outline-none focus:ring-2 focus:ring-customGRing focus:ring-offset-2 disabled:opacity-70">
          {isLoading ? (
            <svg
              className="w-5 h-5 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              로그인
              <ArrowRight size={18} className="ml-2" />
            </>
          )}
        </motion.button>

        <motion.div variants={itemVariants} className="text-center">
          <div className="mt-2 text-sm text-gray-600">
            계정이 없으신가요?{' '}
            <Link
              href="/signup"
              className="font-medium text-customG hover:text-customGDark hover:underline">
              회원가입
            </Link>
          </div>
        </motion.div>
      </motion.form>

      <motion.div
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 0.6}}
        className="mt-6 text-xs text-center text-gray-500">
        © 2025 NSMM Dashboard. All rights reserved.
        <div className="mt-1">
          <Link href="/terms" className="mx-2 hover:text-customG">
            이용약관
          </Link>
          <Link href="/privacy" className="mx-2 hover:text-customG">
            개인정보처리방침
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
