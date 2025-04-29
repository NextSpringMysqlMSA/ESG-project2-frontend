'use client'

import {ReactNode} from 'react'
import {ProfileProvider} from '@/contexts/ProfileContext'
import HomeNavbar from '@/components/layout/homeNavbar'

export default function AccountLayout({children}: {children: ReactNode}) {
  return (
    <ProfileProvider>
      <div className="flex flex-col min-h-screen">
        <HomeNavbar />
        <div className="flex flex-1 px-8 py-4">{children}</div>
      </div>
    </ProfileProvider>
  )
}
