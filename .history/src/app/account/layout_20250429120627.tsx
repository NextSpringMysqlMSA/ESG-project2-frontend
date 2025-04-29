'use client'

import {ReactNode, useState, isValidElement, cloneElement} from 'react'
import HomeNavbar from '@/components/layout/homeNavbar'
import {useRouter} from 'next/navigation'

export default function AccountLayout({children}: {children: ReactNode}) {
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
          className="flex items-center justify-center w-10 h-10 bg-customG text-white border border-customG rounded-xl hover:bg-white hover:text-customG hover:border-customG transition-all duration-200 font-bold text-xl">
          ←
        </button>
      </div>

      <div className="flex flex-1 px-8 py-4">
        {isValidElement(children)
          ? cloneElement(children, {
              profileImage,
              onProfileImageChange: handleProfileImageChange
            })
          : children}
      </div>
    </div>
  )
}
