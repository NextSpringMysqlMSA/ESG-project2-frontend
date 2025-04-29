'use client'

import {useRef} from 'react'

interface AccountPageProps {
  profileImage: string
  onProfileImageChange: (newImage: string) => void
}

export default function AccountPage({
  profileImage,
  onProfileImageChange
}: AccountPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      onProfileImageChange(fileUrl)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        {/* 프로필 영역 */}
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-400 shadow-md hover:scale-105 transition-transform duration-300">
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
            className="px-6 py-2 bg-[#1890FF] text-white rounded-full hover:bg-blue-600 transition-all duration-200">
            프로필 변경
          </button>
        </div>

        {/* 개인정보 입력 폼 */}
        <div className="flex flex-col gap-4">
          {['이름', '전화번호', '이메일', '비밀번호', '비밀번호 확인'].map(
            (label, idx) => (
              <div key={idx}>
                <label className="block mb-1 text-sm font-medium text-gray-700">
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
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            )
          )}
        </div>

        {/* 저장 버튼 */}
        <div className="flex justify-end mt-6">
          <button
            onClick={() => alert('저장되었습니다!')}
            className="px-8 py-3 bg-blue-500 text-white text-lg rounded-lg hover:bg-blue-600 transition-all duration-200">
            저장
          </button>
        </div>
      </div>
    </div>
  )
}
