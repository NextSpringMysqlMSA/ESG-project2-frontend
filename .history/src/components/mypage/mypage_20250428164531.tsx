'use client'
import {useState, useRef} from 'react'

export default function Mypage() {
  const [image, setImage] = useState<string | null>(null) // 상태 추가
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEditClick = () => {
    fileInputRef.current?.click() // 파일 선택창 열기
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string) // 이미지 URL을 상태로 저장
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 프로필 아이콘, 이미지 미리보기 */}
      <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-4xl">👤</span> // 이미지가 없으면 기본 아이콘
        )}
      </div>

      {/* 숨겨진 파일 선택 */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange} // 파일이 변경될 때 이미지 처리
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
