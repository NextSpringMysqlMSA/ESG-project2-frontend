'use client'

import {useRef, useState} from 'react'

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
    <div className="flex items-center justify-center w-full h-full">
      <div className="flex flex-row gap-16 max-w-4xl w-full items-center">
        {/* 왼쪽: 프로필 */}
        <div className="flex flex-col items-center gap-4 w-1/3">
          <div className="w-32 h-32 rounded-full overflow-hidden flex items-center justify-center bg-gray-300">
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
            className="px-4 py-2 border rounded hover:bg-blue-500 hover:text-white">
            Edit
          </button>
        </div>

        {/* 오른쪽: 개인정보 입력 */}
        <div className="flex flex-col gap-4 w-2/3">
          <div>
            <label className="block mb-1 font-semibold">이름</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">전화번호</label>
            <input type="text" className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">이메일</label>
            <input type="email" className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">비밀번호</label>
            <input type="password" className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block mb-1 font-semibold">비밀번호 확인</label>
            <input type="password" className="w-full p-2 border rounded" />
          </div>

          {/* 저장 버튼 */}
          <div className="flex justify-end">
            <button
              onClick={() => alert('저장되었습니다!')}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
