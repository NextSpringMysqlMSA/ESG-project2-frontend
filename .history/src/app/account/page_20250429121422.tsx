'use client'

import {useState} from 'react'
import Account from '@/components/account/account'

export default function AccountPage() {
  const [profileImage, setProfileImage] = useState<string>(
    'https://github.com/shadcn.png'
  )

  const handleProfileImageChange = (newImage: string) => {
    setProfileImage(newImage)
  }

  return (
    <div className="w-full h-full">
      <Account
        profileImage={profileImage}
        onProfileImageChange={handleProfileImageChange}
      />
    </div>
  )
}
