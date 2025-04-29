'use client'

import {ReactNode} from 'react'
import {ProfileProvider} from '@/contexts/ProfileContext'
import HomeNavbar from '@/components/layout/homeNavbar'

export default function AccountLayout({children}: {children: ReactNode}) {
  return (
    <ProfileProvider>
      <div className="flex flex-col min-h-screen h-screen w-full">
        <HomeNavbar />
        <div className="flex flex-1 h-full w-full">{children}</div>
      </div>
    </ProfileProvider>
  )
}
