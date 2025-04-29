'use client'
import {useRef} from 'react'

export default function Mypage() {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 프로필 아이콘 */}
      <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-4xl">
        👤
      </div>

      {/* 숨겨진 파일 선택 */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) {
            // 여기에 프로필 업로드 로직 추가 가능
            console.log(file)
          }
        }}
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
