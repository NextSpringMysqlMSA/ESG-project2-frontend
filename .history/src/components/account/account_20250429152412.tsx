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
    <div className="flex items-center justify-center min-h-screen bg-[#F9FBFF] px-4 py-8">
      <div className="flex gap-12 items-start">
        {/* 왼쪽 프로필 영역 */}
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

        {/* 오른쪽 회원정보 카드 */}
        <div className="flex flex-col gap-4 bg-white p-8 rounded-2xl shadow-lg w-[400px]">
          {/* 읽기 전용 정보 */}
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between border-b py-2">
              <span className="font-medium text-gray-600">이름</span>
              <span className="font-semibold">김지현</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium text-gray-600">이메일</span>
              <span className="font-semibold">jh123@google.com</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium text-gray-600">전화번호</span>
              <span className="font-semibold">010-1234-5678</span>
            </div>
            <div className="flex justify-between border-b py-2">
              <span className="font-medium text-gray-600">회사명</span>
              <span className="font-semibold">애플코리아</span>
            </div>
            <div className="flex justify-between border-b py-2 mb-4">
              <span className="font-medium text-gray-600">직급</span>
              <span className="font-semibold">부장</span>
            </div>
          </div>

          {/* 비밀번호 변경 인풋 */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">현재 비밀번호</label>
            <input
              type="password"
              placeholder="현재 비밀번호를 입력하세요"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-sm"
            />
            <label className="text-sm font-medium text-gray-700">새 비밀번호</label>
            <input
              type="password"
              placeholder="새 비밀번호를 입력하세요"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-sm"
            />
            <label className="text-sm font-medium text-gray-700">새 비밀번호 확인</label>
            <input
              type="password"
              placeholder="새 비밀번호를 다시 입력하세요"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-sm"
            />
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => alert('저장되었습니다!')}
              className="px-8 py-2 bg-customG text-white text-sm rounded-lg hover:bg-white hover:text-customG border border-customG transition-all duration-300">
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
