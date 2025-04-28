'use client'

import {ReactNode, useState} from 'react'
import HomeNavbar from '@/components/layout/homeNavbar'
import {useRouter} from 'next/navigation'

export default function MypageLayout({children}: {children: ReactNode}) {
  const router = useRouter()

  // 프로필 이미지를 상태로 관리
  const [profileImage, setProfileImage] = useState<string>(
    'https://github.com/shadcn.png'
  )

  // 프로필 이미지 수정 함수
  const handleProfileImageChange = (newImage: string) => {
    setProfileImage(newImage)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* HomeNavbar에 profileImage와 프로필 수정 함수를 전달 */}
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
      <div className="flex flex-1 px-8 py-4">
        {/* AccountPage에 프로필 수정 함수 전달 */}
        {children}
      </div>
    </div>
  )
}
