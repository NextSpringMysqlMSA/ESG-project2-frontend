'use client'

import {useProfile} from '@/contexts/ProfileContext'
import {useRef} from 'react'
import {useRouter} from 'next/navigation'
import DashButton from '@/components/dashButton'

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
        <DashButton onClick={() => router.back()} width="w-10">
          ←
        </DashButton>
      </div>

      {/* 본문 */}
      <div className="flex flex-col items-start justify-center w-full max-w-5xl gap-10 mx-auto md:flex-row">
        {/* 왼쪽: 프로필 */}
        <div className="flex flex-col items-center gap-6">
          <div className="w-32 h-32 overflow-hidden transition-transform duration-300 border-4 rounded-full shadow-md border-customG hover:scale-105 hover:ring-4 hover:ring-customG/30">
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

          <DashButton onClick={handleEditClick} width="w-24">
            프로필 변경
          </DashButton>
        </div>

        {/* 오른쪽: 개인정보 + 비밀번호 */}
        <div className="flex flex-col w-full p-8 bg-white shadow-lg rounded-2xl">
          {/* 개인정보 */}
          <div className="flex flex-col divide-y divide-gray-200">
            {[
              {label: '이름', value: '김지현'},
              {label: '이메일', value: 'jh123@google.com'},
              {label: '전화번호', value: '010-1234-5678'},
              {label: '회사명', value: '애플코리아'},
              {label: '직급', value: '부장'}
            ].map((item, idx) => (
              <div key={idx} className="flex items-center h-14">
                <div className="w-1/3 font-medium text-gray-700">{item.label}</div>
                <div className="flex-1 font-semibold">{item.value}</div>
              </div>
            ))}
          </div>

          {/* 비밀번호 변경 */}
          <div className="flex flex-col mt-4 divide-y divide-gray-200">
            {[
              {label: '현재 비밀번호', placeholder: '현재 비밀번호를 입력하세요'},
              {label: '새 비밀번호', placeholder: '새 비밀번호를 입력하세요'},
              {label: '새 비밀번호 확인', placeholder: '새 비밀번호를 다시 입력하세요'}
            ].map((item, idx) => (
              <div key={idx} className="flex items-center h-14">
                <div className="w-1/3 font-medium text-gray-700">{item.label}</div>
                <input
                  type="password"
                  placeholder={item.placeholder}
                  className="flex w-64 p-2 text-base border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            ))}
          </div>

          {/* 저장 버튼 (오른쪽 정렬) */}
          <div className="flex justify-end mt-8">
            <DashButton onClick={() => alert('저장되었습니다!')} width="w-24">
              저장
            </DashButton>
          </div>
        </div>
      </div>
    </div>
  )
}
