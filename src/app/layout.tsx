'use client'

import {Toaster} from 'react-hot-toast'
import './globals.css'
import {usePathname} from 'next/navigation'

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const pathname = usePathname()
  const isMainPage = pathname === '/' || pathname === '/main'

  return (
    <html lang="ko" className="overflow-y-scroll">
      <body
        className={`flex flex-col w-full min-h-screen font-gm ${
          isMainPage ? '' : 'bg-[#F9FBFF]'
        }`}>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
