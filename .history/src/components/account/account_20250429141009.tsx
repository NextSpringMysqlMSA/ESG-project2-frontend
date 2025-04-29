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
    <div className="flex flex-col w-full bg-[#F9FBFF] px-4 py-8">
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
        <div className="flex flex-col items-center gap-6 w-1/3 pt-6">
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

        {/* 오른쪽 개인정보 입력폼 */}
        <div className="flex flex-col justify-between w-2/3 h-full">
          <div className="flex flex-col gap-6">
            {/* 이름 */}
            <div>
              <label className="block mb-1 text-base font-medium text-gray-700">
                이름
              </label>
              <input
                type="text"
                placeholder="이름을 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-base"
              />
            </div>

            {/* 이메일 */}
            {/* <div>
              <label className="block mb-1 text-base font-medium text-gray-700">
                이메일
              </label>
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-base"
              />
            </div> */}

            {/* 전화번호 */}
            <div>
              <label className="block mb-1 text-base font-medium text-gray-700">
                전화번호
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  maxLength={3}
                  placeholder="010"
                  className="w-20 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-base"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="1234"
                  className="w-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-base"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="text"
                  maxLength={4}
                  placeholder="5678"
                  className="w-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-base"
                />
              </div>
            </div>

            {/* 회사명 */}
            <div>
              <label className="block mb-1 text-base font-medium text-gray-700">
                회사명
              </label>
              <input
                type="text"
                placeholder="회사명을 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-base"
              />
            </div>

            {/* 직급 */}
            <div>
              <label className="block mb-1 text-base font-medium text-gray-700">
                직급
              </label>
              <input
                type="text"
                placeholder="직급을 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-base"
              />
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block mb-1 text-base font-medium text-gray-700">
                비밀번호
              </label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-base"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block mb-1 text-base font-medium text-gray-700">
                비밀번호 확인
              </label>
              <input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customG text-base"
              />
            </div>
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end mt-6 pb-8">
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
