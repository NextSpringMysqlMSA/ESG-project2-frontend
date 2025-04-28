'use client'
import {useState, useRef} from 'react'
import Mypage from '@/components/mypage'

export default function Mypage() {
  const [image, setImage] = useState<string | null>(null) // 이미지 상태
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Edit 버튼 클릭 시 파일 선택 창 열기
  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  // 파일 변경 처리
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 파일을 URL로 변환하여 상태 업데이트
      const imageURL = URL.createObjectURL(file)
      setImage(imageURL)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 프로필 아이콘 및 이미지 미리보기 */}
      <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-4xl">👤</span> // 기본 아이콘
        )}
      </div>

      {/* 숨겨진 파일 선택 */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange} // 파일 선택 시 처리
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
