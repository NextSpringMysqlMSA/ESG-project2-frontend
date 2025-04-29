'use client'

import {ReactNode, useState} from 'react'
import HomeNavbar from '@/components/layout/homeNavbar'
import {useRouter} from 'next/navigation'
import AccountPage from './page'

export default function AccountLayout() {
  const router = useRouter()

  const [profileImage, setProfileImage] = useState<string>(
    'https://github.com/shadcn.png'
  )

  const handleProfileImageChange = (newImage: string) => {
    setProfileImage(newImage)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <HomeNavbar profileImage={profileImage} />

      <div className="px-6 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center w-20 h-20 bg-white border border-blue-600 rounded-lg text-blue-700 hover:text-blue-900 hover:border-blue-900 font-bold text-3xl hover:bg-blue-50 transition-all duration-200">
          ←
        </button>
      </div>

      <div className="flex flex-1 px-8 py-4">
        {/* 여기! profileImage 도 넘김 */}
        <AccountPage
          profileImage={profileImage}
          onProfileImageChange={handleProfileImageChange}
        />
      </div>
    </div>
  )
}
