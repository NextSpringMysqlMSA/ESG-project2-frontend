'use client'

import {ReactNode} from 'react'
import {ProfileProvider} from '@/contexts/ProfileContext'

export default function DashboardLayout({children}: {children: ReactNode}) {
  return (
    <ProfileProvider>
      <div className="flex flex-col min-h-screen">{children}</div>
    </ProfileProvider>
  )
}
