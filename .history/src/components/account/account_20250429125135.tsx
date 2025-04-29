'use client'

import {useProfile} from '@/contexts/ProfileContext'
import {useRef} from 'react'

export default function Account() {
  const {profileImage, setProfileImage} = useProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    <div className="flex justify-center items-center min-h-screen w-full bg-[#F9FBFF] px-4">
      <div className="w-full max-w-4xl bg-white p-10 rounded-2xl shadow-xl flex flex-row items-center">
        {/* 왼쪽: 프로필 사진 */}
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

          <button
            onClick={handleEditClick}
            className="px-6 py-2 bg-customG text-white rounded-full hover:bg-white hover:text-customG border border-customG transition-all duration-300">
            프로필 변경
          </button>
        </div>

        {/* 오른쪽: 개인정보 입력 폼 */}
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

          <div className="flex justify-end mt-6">
            <button
              onClick={() => alert('저장되었습니다!')}
              className="px-8 py-3 bg-customG text-white text-lg rounded-lg hover:bg-white hover:text-customG border border-customG transition-all duration-300">
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
