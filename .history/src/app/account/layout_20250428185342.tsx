'use client'

import {useState, ReactNode} from 'react'
import {useRouter} from 'next/navigation'
import HomeNavbar from '@/components/layout/homeNavbar'
import AccountPage from './page' // 직접 import 해서 props 넘길 거야

export default function AccountLayout() {
  const router = useRouter()

  // 프로필 이미지 상태
  const [profileImage, setProfileImage] = useState<string>(
    'https://github.com/shadcn.png'
  )

  // 프로필 이미지 수정 함수
  const handleProfileImageChange = (newImage: string) => {
    setProfileImage(newImage)
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* 네비바 */}
      <HomeNavbar profileImage={profileImage} />

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
        <AccountPage onProfileImageChange={handleProfileImageChange} />
      </div>
    </div>
  )
}
