'use client'

import {Toaster} from 'react-hot-toast'
import './globals.css'

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="ko">
      <body className="flex flex-col w-full h-full bg-[#F9FBFF] overflow-y-scroll font-custom">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
