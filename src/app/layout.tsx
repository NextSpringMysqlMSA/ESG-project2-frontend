'use client'

import {Toaster} from 'react-hot-toast'
import './globals.css'

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="ko">
      <body className="flex flex-col w-full h-screen">
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
