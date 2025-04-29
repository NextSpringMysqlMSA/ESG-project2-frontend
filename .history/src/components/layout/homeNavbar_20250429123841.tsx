'use client'

import {useProfile} from '@/contexts/ProfileContext'

export default function HomeNavbar() {
  const {profileImage} = useProfile()

  return (
    <div>
      {/* profileImage로 아바타 표시 */}
      <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full" />
    </div>
  )
}
