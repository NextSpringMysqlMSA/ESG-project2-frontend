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

      <div className="px-4 py-2">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:underline">
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
