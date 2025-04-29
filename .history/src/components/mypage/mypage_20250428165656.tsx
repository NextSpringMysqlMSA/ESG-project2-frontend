// mypage.tsx
'use client'
import {useState, useRef} from 'react'

// setProfileImage를 prop으로 받기
interface MypageProps {
  setProfileImage: (imageUrl: string) => void
}

export default function Mypage({setProfileImage}: MypageProps) {
  const [image, setImage] = useState<string | null>(null) // 선택된 이미지 상태 관리
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEditClick = () => {
    fileInputRef.current?.click() // 파일 입력 창 열기
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageURL = URL.createObjectURL(file) // 이미지 URL을 미리 생성
      setImage(imageURL)
      setProfileImage(imageURL) // 부모 컴포넌트로 이미지 URL 전달
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
        {image ? (
          <img
            src={image}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-4xl">👤</span>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange} // 파일 선택 시 처리 함수 호출
      />

      <button
        onClick={handleEditClick}
        className="px-4 py-2 border rounded hover:bg-blue-500 hover:text-white">
        Edit
      </button>
    </div>
  )
}
