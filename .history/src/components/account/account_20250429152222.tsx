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
    <div className="flex flex-col min-h-screen bg-[#F9FBFF] px-4 py-8">
      {/* 뒤로가기 버튼 */}
      <div className="self-start px-6 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-10 h-10 bg-customG text-white border border-customG rounded-xl hover:bg-white hover:text-customG hover:border-customG transition-all duration-200 font-bold text-xl">
          ←
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-1 items-center justify-center">
        <div className="flex gap-24 items-start w-full max-w-6xl">
          {/* 왼쪽 프로필 */}
          <div className="flex flex-col items-center gap-6">
            <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-customG shadow-md hover:scale-105 hover:ring-4 hover:ring-customG/30 transition-transform duration-300">
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

          {/* 오른쪽 폼 */}
          <div className="flex flex-col gap-5 w-[400px]">
            {/* 고정된 텍스트들 */}
            <div className="flex flex-col gap-2 text-base text-gray-700">
              <div>
                이름: <span className="font-semibold text-black">김지현</span>
              </div>
              <div>
                이메일: <span className="font-semibold text-black">jh123@google.com</span>
              </div>
              <div>
                전화번호: <span className="font-semibold text-black">010-1234-5678</span>
              </div>
              <div>
                회사명: <span className="font-semibold text-black">애플코리아</span>
              </div>
              <div>
                직급: <span className="font-semibold text-black">부장</span>
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="flex flex-col gap-4 mt-6">
              <div>
                <label className="block mb-1 text-base font-medium text-gray-700">
                  현재 비밀번호
                </label>
                <input
                  type="password"
                  placeholder="현재 비밀번호를 입력하세요"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-base"
                />
              </div>

              <div>
                <label className="block mb-1 text-base font-medium text-gray-700">
                  새 비밀번호
                </label>
                <input
                  type="password"
                  placeholder="새 비밀번호를 입력하세요"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-base"
                />
              </div>

              <div>
                <label className="block mb-1 text-base font-medium text-gray-700">
                  새 비밀번호 확인
                </label>
                <input
                  type="password"
                  placeholder="새 비밀번호를 다시 입력하세요"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-base"
                />
              </div>
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => alert('저장되었습니다!')}
                className="px-8 py-3 bg-customG text-white text-base rounded-lg hover:bg-white hover:text-customG border border-customG transition-all duration-300">
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
