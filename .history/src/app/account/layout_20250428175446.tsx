'use client'

import {ReactNode, useState} from 'react'
import HomeNavbar from '@/components/layout/homeNavbar'
import {useRouter} from 'next/navigation'

export default function AccountLayout({children}: {children: ReactNode}) {
  const router = useRouter()

  // 프로필 이미지 상태 관리
  const [profileImage, setProfileImage] = useState<string>(
    'https://github.com/shadcn.png'
  )

  // 프로필 이미지 변경 함수
  const handleProfileImageChange = (newImage: string) => {
    setProfileImage(newImage)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* HomeNavbar에 profileImage와 onProfileImageChange 전달 */}
      <HomeNavbar
        profileImage={profileImage}
        onProfileImageChange={handleProfileImageChange}
      />

      {/* 뒤로가기 버튼 */}
      <div className="px-4 py-2">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-500 hover:underline">
          ←
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-1 px-8 py-4">{children}</div>
    </div>
  )
}
