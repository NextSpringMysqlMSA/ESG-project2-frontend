'use client'

import {useState} from 'react'
import Link from 'next/link'
import AuthInputBox from '@/components/tools/authInputBox'
import {registerApi} from '@/services/auth'
import {showError, showSuccess} from '@/util/toast'

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

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({...prev, [key]: value}))
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
      if (
        typeof e === 'object' &&
        e !== null &&
        'response' in e &&
        typeof e.response === 'object' &&
        e.response !== null &&
        'data' in e.response &&
        typeof e.response.data === 'object' &&
        e.response.data !== null &&
        'message' in e.response.data &&
        typeof e.response.data.message === 'string'
      ) {
        errorMessage = e.response.data.message
      }
      showError(errorMessage)
    }
  }

  const renderField = (
    label: string,
    key: keyof typeof form,
    required = false,
    type = 'text',
    placeholder?: string
  ) => (
    <label className="w-full text-base font-medium">
      {label} {required && <span className="text-red-600">*</span>}
      <AuthInputBox
        type={type}
        placeholder={placeholder || label}
        value={form[key]}
        onChange={val => handleChange(key, val)}
      />
      {formErrors[key] && <p className="mt-1 text-sm text-red-600">{formErrors[key]}</p>}
    </label>
  )

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-6 bg-[#F9FBFF]">
      <div className="flex flex-col my-10 px-8 py-8 space-y-4 w-[400px] bg-white border shadow-xl rounded-2xl">
        <div className="text-2xl font-bold text-center">회원가입</div>

        {renderField('이름', 'name', true)}
        {renderField('이메일', 'email', true)}
        {renderField('전화번호', 'phoneNumber', true)}
        {renderField('회사명', 'companyName')}
        {renderField('직급', 'position')}
        {renderField('비밀번호', 'password', true, 'password')}
        {renderField('비밀번호 확인', 'confirmPassword', true, 'password')}

        <button
          onClick={handleSubmit}
          className="w-full h-12 text-base text-white transition-all duration-300 border rounded-lg bg-customG hover:bg-white hover:text-customG border-customG">
          계정 생성
        </button>

        <div className="text-sm text-center">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-semibold text-customG hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  )
}
