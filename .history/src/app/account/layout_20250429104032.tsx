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
          className="flex items-center justify-center w-10 h-10 bg-white text-customG border border-customG rounded-xl hover:bg-customG hover:text-white transition-all duration-200 font-bold text-xl">
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
