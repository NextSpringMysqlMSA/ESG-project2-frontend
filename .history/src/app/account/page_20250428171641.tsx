'use client'

import {useRef} from 'react'

export default function AccountPage({
  onProfileImageChange
}: {
  onProfileImageChange: (newImage: string) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 선택된 파일 URL 생성
      const fileUrl = URL.createObjectURL(file)
      // 상위 컴포넌트의 상태를 변경하여 프로필 이미지를 업데이트
      onProfileImageChange(fileUrl)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 프로필 아이콘 */}
      <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-4xl">
        <img
          src={URL.createObjectURL(new Blob())}
          className="rounded-full"
          alt="Profile"
        />
      </div>

      {/* 숨겨진 파일 선택 */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Edit 버튼 */}
      <button
        onClick={handleEditClick}
        className="px-4 py-2 border rounded hover:bg-blue-500 hover:text-white">
        Edit
      </button>
    </div>
  )
}
