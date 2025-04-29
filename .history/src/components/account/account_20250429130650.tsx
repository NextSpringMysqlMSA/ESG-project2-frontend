'use client'

import {useProfile} from '@/contexts/ProfileContext'
import {useRef} from 'react'
import {useRouter} from 'next/navigation'

export default function Account() {
  const {profileImage, setProfileImage} = useProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      setProfileImage(fileUrl)
    }
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#F9FBFF] px-4 py-8">
      {/* 뒤로가기 버튼 */}
      <div className="self-start px-6 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 bg-customG text-white border border-customG rounded-xl hover:bg-white hover:text-customG hover:border-customG transition-all duration-200 font-bold text-xl">
          ←
        </button>
      </div>

      {/* 프로필 + 개인정보 입력 영역 */}
      <div className="flex flex-row gap-20 items-center w-full max-w-4xl mx-auto">
        {/* 왼쪽 프로필 */}
        <div className="flex flex-col items-center gap-6 w-1/3">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-customG shadow-md hover:scale-105 hover:ring-4 hover:ring-customG/30 transition-transform duration-300">
            <img
              src={profileImage}
              alt="Profile"
              className="object-cover w-full h-full"
            />
          </div>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* ⬇️ 프로필 변경 버튼 */}
          <button
            onClick={handleEditClick}
            className="px-6 py-2 bg-customG text-white text-base rounded-lg hover:bg-white hover:text-customG border border-customG transition-all duration-300">
            프로필 변경
          </button>
        </div>

        {/* 오른쪽 개인정보 입력폼 */}
        <div className="flex flex-col gap-6 w-2/3">
          {[
            {label: '이름', placeholder: '이름을 입력하세요'},
            {label: '이메일', placeholder: '이메일을 입력하세요'},
            {label: '전화번호', placeholder: '전화번호를 입력하세요'},
            {label: '회사명', placeholder: '회사명을 입력하세요'},
            {label: '직급', placeholder: '직급을 입력하세요'},
            {label: '비밀번호', placeholder: '비밀번호를 입력하세요'},
            {label: '비밀번호 확인', placeholder: '비밀번호를 다시 입력하세요'}
          ].map(({label, placeholder}, idx) => (
            <div key={idx}>
              <label className="block mb-1 text-base font-medium text-gray-700">
                {label}
              </label>
              <input
                type={
                  label.includes('비밀번호')
                    ? 'password'
                    : label === '이메일'
                    ? 'email'
                    : 'text'
                }
                placeholder={placeholder}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-base"
              />
            </div>
          ))}

          {/* ⬇️ 저장 버튼 */}
          <div className="flex justify-end mt-6 mb-4">
            <button
              onClick={() => alert('저장되었습니다!')}
              className="px-6 py-2 bg-customG text-white text-base rounded-lg hover:bg-white hover:text-customG border border-customG transition-all duration-300">
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
