'use client'

import Account from '@/components/account/account'

interface AccountPageProps {
  profileImage: string
  onProfileImageChange: (newImage: string) => void
}

export default function AccountPage({
  profileImage,
  onProfileImageChange
}: AccountPageProps) {
  return (
    <div className="w-full h-full">
      <Account profileImage={profileImage} onProfileImageChange={onProfileImageChange} />
    </div>
  )
}
