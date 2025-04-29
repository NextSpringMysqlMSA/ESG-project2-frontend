'use client'

import {useProfile} from '@/contexts/ProfileContext'
import {useRef} from 'react'

export default function Account() {
  const {profileImage, setProfileImage} = useProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      setProfileImage(fileUrl)
    }
  }

  return (
    <div>
      {/* 프로필 사진 변경 */}
      <img src={profileImage} alt="Profile" />
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button onClick={handleEditClick}>프로필 변경</button>

      {/* 회원정보 입력 폼 */}
    </div>
  )
}
