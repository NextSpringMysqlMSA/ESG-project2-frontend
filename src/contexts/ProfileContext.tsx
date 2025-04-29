'use client'

import {createContext, useContext, useState} from 'react'

interface ProfileContextProps {
  profileImage: string
  setProfileImage: (newImage: string) => void
}

const ProfileContext = createContext<ProfileContextProps | undefined>(undefined)

export function ProfileProvider({children}: {children: React.ReactNode}) {
  const [profileImage, setProfileImage] = useState('https://github.com/shadcn.png')

  return (
    <ProfileContext.Provider value={{profileImage, setProfileImage}}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
