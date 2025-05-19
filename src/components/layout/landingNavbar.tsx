'use client'

import Link from 'next/link'
import {motion} from 'framer-motion'
import {Leaf, ArrowRight} from 'lucide-react'

/**
 * 랜딩 페이지용 네비게이션 바 컴포넌트
 * ESG 테마를 활용한 현대적인 디자인으로 구현
 */
export default function LandingNavBar() {
  return (
    <header className="fixed z-50 w-full">
      <div className="flex items-center justify-between w-full px-4 py-3 bg-white shadow-sm lg:px-8">
        {/* 로고 영역 */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg shadow-sm bg-customG">
            <Leaf className="text-white" size={20} />
          </div>
          <motion.div
            initial={{opacity: 0, x: -10}}
            animate={{opacity: 1, x: 0}}
            transition={{duration: 0.3}}
            className="flex flex-col">
            <span className="text-xl tracking-tight font-gmBold text-customGTextLight">
              NSMM
            </span>
            <span className="-mt-1 text-xs font-medium text-customG">Dashboard</span>
          </motion.div>
        </Link>

        {/* 로그인/시작하기 버튼 */}
        <div className="flex items-center space-x-3">
          <Link href="/login">
            <motion.button
              whileHover={{scale: 1.03}}
              whileTap={{scale: 0.98}}
              className="flex items-center px-5 py-2 text-sm font-medium text-white transition-all duration-200 rounded-lg shadow-sm bg-customG hover:bg-customGDark">
              시작하기
              <ArrowRight size={16} className="ml-1" />
            </motion.button>
          </Link>
        </div>
      </div>
    </header>
  )
}

/**
 * 네비게이션 메뉴 아이템 컴포넌트
 */
// const NavItem = ({href, label}: {href: string; label: string}) => (
//   <Link
//     href={href}
//     className="px-3 py-2 text-sm font-medium text-gray-600 transition-colors rounded-md hover:text-customGDark hover:bg-customGLight">
//     {label}
//   </Link>
// )
