'use client'

import {useState} from 'react'
import Link from 'next/link'
import AuthInputBox from '@/components/tools/authInputBox'
import {registerApi} from '@/services/auth'
import {showError, showSuccess} from '@/util/toast'
import axios from 'axios'
import {
  Leaf,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  Lock,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import {motion} from 'framer-motion'

export default function SignUp() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    position: '',
    password: '',
    confirmPassword: ''
  })

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({})
  const [isLoading, setIsLoading] = useState(false)

  // handleChange 함수 수정
  const handleChange = (
    key: keyof typeof form,
    value: string | ((prev: string) => string)
  ) => {
    // value가 함수인 경우와 문자열인 경우를 모두 처리
    const newValue = typeof value === 'function' ? value(form[key]) : value

    setForm(prev => ({...prev, [key]: newValue}))
    setFormErrors(prev => ({...prev, [key]: ''})) // 필드 변경 시 에러 초기화
  }

  const validateForm = () => {
    const errors: {[key: string]: string} = {}

    if (!form.name.trim()) errors.name = '이름을 입력해주세요.'
    if (!form.email.trim()) {
      errors.email = '이메일을 입력해주세요.'
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email)) {
      errors.email = '올바른 이메일 형식이 아닙니다.'
    }

    if (!form.phoneNumber.trim()) errors.phoneNumber = '전화번호를 입력해주세요.'

    if (!form.password.trim()) {
      errors.password = '비밀번호를 입력해주세요.'
    } else if (form.password.length < 8) {
      errors.password = '비밀번호는 8자 이상이어야 합니다.'
    }

    if (form.confirmPassword !== form.password) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await registerApi({
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber,
        companyName: form.companyName,
        position: form.position,
        password: form.password
      })
      showSuccess('회원가입 성공! 로그인 페이지로 이동합니다.')
      window.location.href = '/login'
    } catch (e: unknown) {
      let errorMessage = '회원가입 실패: 입력값을 확인해주세요.'
      if (axios.isAxiosError(e) && e.response?.data?.message) {
        errorMessage = e.response.data.message
      }
      showError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // 애니메이션 설정
  const containerVariants = {
    hidden: {opacity: 0},
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const itemVariants = {
    hidden: {y: 20, opacity: 0},
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  }

  // 입력 필드 렌더링 함수 수정
  const renderField = (
    label: string,
    key: keyof typeof form,
    required = false,
    type = 'text',
    placeholder?: string,
    icon?: React.ReactNode
  ) => (
    <motion.div variants={itemVariants} className="w-full">
      <label className="block mb-1.5 text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2">
            {icon}
          </div>
        )}{' '}
        <AuthInputBox
          type={type}
          placeholder={placeholder || label}
          value={form[key]}
          onChange={(val: string | ((prevVal: string) => string)) =>
            handleChange(key, val)
          }
        />
      </div>
      {formErrors[key] && <p className="mt-1 text-sm text-red-600">{formErrors[key]}</p>}
    </motion.div>
  )

  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full p-4">
      <motion.div
        initial={{opacity: 0, y: -10}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.5}}
        className="flex items-center justify-center mb-6">
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

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-xl rounded-2xl">
        <motion.h1
          variants={itemVariants}
          className="mb-6 text-2xl text-center text-gray-800 font-gmBold">
          회원가입
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mb-8 text-sm text-center text-gray-500">
          NSMM 대시보드를 시작하기 위한 계정을 만드세요
        </motion.p>

        {/* 그리드 레이아웃을 단일 열로 변경 */}
        <div className="flex flex-col space-y-5">
          {renderField(
            '이름',
            'name',
            true,
            'text',
            '이름을 입력하세요',
            <User size={18} />
          )}
          {renderField(
            '이메일',
            'email',
            true,
            'email',
            '이메일을 입력하세요',
            <Mail size={18} />
          )}
          {renderField(
            '전화번호',
            'phoneNumber',
            true,
            'tel',
            '연락처를 입력하세요',
            <Phone size={18} />
          )}
          {renderField(
            '회사명',
            'companyName',
            false,
            'text',
            '회사명을 입력하세요',
            <Building size={18} />
          )}
          {renderField(
            '직급',
            'position',
            false,
            'text',
            '직급을 입력하세요',
            <Briefcase size={18} />
          )}
          {renderField(
            '비밀번호',
            'password',
            true,
            'password',
            '8자 이상 입력하세요',
            <Lock size={18} />
          )}
          {renderField(
            '비밀번호 확인',
            'confirmPassword',
            true,
            'password',
            '비밀번호를 다시 입력하세요',
            <CheckCircle size={18} />
          )}
        </div>

        <motion.div variants={itemVariants} className="mt-8">
          <motion.button
            whileHover={{scale: 1.02}}
            whileTap={{scale: 0.98}}
            onClick={handleSubmit}
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
                계정 생성하기
                <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </motion.button>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-6 text-center">
          <div className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-medium text-customG hover:text-customGDark hover:underline">
              로그인
            </Link>
          </div>
        </motion.div>
      </motion.div>

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
