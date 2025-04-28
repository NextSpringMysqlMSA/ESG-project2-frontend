'use client' // 추가된 부분

import {ReactNode} from 'react'
import HomeNavbar from '@/components/layout/homeNavbar'
import {useRouter} from 'next/navigation'

export default function MypageLayout({children}: {children: ReactNode}) {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen">
      <HomeNavbar />

      {/* 뒤로가기 버튼 */}
      <div className="px-4 py-2">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-500 hover:underline">
          ← Back
        </button>
      </div>

      {/* 본문 */}
      <div className="flex flex-1 px-8 py-4">{children}</div>
    </div>
  )
}
