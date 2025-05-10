'use client'

import Link from 'next/link'
import {Leaf} from 'lucide-react'
import {motion} from 'framer-motion'

/**
 * 네비게이션 바 컴포넌트
 * ESG 테마를 적용한 녹색 디자인
 */
export default function NavBar() {
  return (
    <div className="z-40 flex items-center justify-between w-full px-4 py-3 bg-white shadow-sm lg:px-6">
      {/* 로고 영역 */}
      <Link href="/" className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-sm bg-emerald-600">
          <Leaf className="text-white" size={20} />
        </div>
        <motion.div
          initial={{opacity: 0, x: -5}}
          animate={{opacity: 1, x: 0}}
          transition={{duration: 0.3}}
          className="flex flex-col">
          <span className="text-xl font-bold tracking-tight text-emerald-800">NSMM</span>
          <span className="-mt-1 text-xs font-medium text-emerald-600">Dashboard</span>
        </motion.div>
      </Link>
    </div>
  )
}

/**
 * 네비게이션 링크 컴포넌트
 */
const NavLink = ({
  href,
  text,
  className = ''
}: {
  href: string
  text: string
  className?: string
}) => (
  <Link
    href={href}
    className={`px-3 py-2 text-sm font-medium text-gray-600 transition-colors rounded-md hover:text-emerald-700 hover:bg-emerald-50 ${className}`}>
    {text}
  </Link>
)
