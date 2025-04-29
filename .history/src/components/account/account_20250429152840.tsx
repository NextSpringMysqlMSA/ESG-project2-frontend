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
    <div className="flex flex-col w-full min-h-screen bg-[#F9FBFF] px-4 py-8">
      {/* 뒤로가기 버튼 */}
      <div className="self-start px-6 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 bg-customG text-white border border-customG rounded-xl hover:bg-white hover:text-customG hover:border-customG transition-all duration-200 font-bold text-xl">
          ←
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-col md:flex-row gap-10 items-start justify-center w-full max-w-5xl mx-auto">
        {/* 왼쪽: 프로필 */}
        <div className="flex flex-col items-center gap-6">
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
            className="px-6 py-2 bg-customG text-white text-base rounded-lg hover:bg-white hover:text-customG border border-customG transition-all duration-300">
            프로필 변경
          </button>
        </div>

        {/* 오른쪽: 개인정보 + 비밀번호 */}
        <div className="flex flex-col w-full bg-white p-8 rounded-2xl shadow-lg">
          {/* 개인정보 */}
          <div className="flex flex-col divide-y">
            {[
              {label: '이름', value: '김지현'},
              {label: '이메일', value: 'jh123@google.com'},
              {label: '전화번호', value: '010-1234-5678'},
              {label: '회사명', value: '애플코리아'},
              {label: '직급', value: '부장'}
            ].map((item, idx) => (
              <div key={idx} className="flex items-center py-3">
                <div className="w-1/3 font-medium text-gray-700">{item.label}</div>
                <div className="flex-1 font-semibold">{item.value}</div>
              </div>
            ))}
          </div>

          {/* 비밀번호 변경 */}
          <div className="flex flex-col divide-y mt-8">
            {[
              {label: '현재 비밀번호', placeholder: '현재 비밀번호를 입력하세요'},
              {label: '새 비밀번호', placeholder: '새 비밀번호를 입력하세요'},
              {label: '새 비밀번호 확인', placeholder: '새 비밀번호를 다시 입력하세요'}
            ].map((item, idx) => (
              <div key={idx} className="flex items-center py-3">
                <div className="w-1/3 font-medium text-gray-700">{item.label}</div>
                <input
                  type="password"
                  placeholder={item.placeholder}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-base"
                />
              </div>
            ))}
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-center mt-8">
            <button
              onClick={() => alert('저장되었습니다!')}
              className="px-8 py-2 bg-customG text-white text-lg rounded-lg hover:bg-white hover:text-customG border border-customG transition-all duration-300">
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
