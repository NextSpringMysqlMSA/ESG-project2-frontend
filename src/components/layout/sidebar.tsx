'use client'

import {useState} from 'react'
import Email from '../svg/email'
import Message from '../svg/message'
import Avatar from '../svg/avatar'
import Arrow from '../svg/arrow'
import HomeIcon from '../svg/home'
import Link from 'next/link'
import {usePathname} from 'next/navigation'

export default function Sidebar() {
  const [openParent, setOpenParent] = useState(false)
  const [openESGChild, setOpenESGChild] = useState(false)
  const [openSupplyChild, setOpenSupplyChild] = useState(false)
  const [openPartnerChild, setOpenPartnerChild] = useState(false)
  const [hovered, setHovered] = useState(false)
  const pathname = usePathname()

  const isHomeActive = pathname === '/home'
  const isESGActive =
    pathname.startsWith('/governance') ||
    pathname.startsWith('/strategy') ||
    pathname.startsWith('/goal')
  const isESGChildActive =
    pathname.startsWith('/governance') ||
    pathname.startsWith('/strategy') ||
    pathname.startsWith('/goal')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isSupplyActive =
    pathname.startsWith('/eudd') ||
    pathname.startsWith('/hrdd') ||
    pathname.startsWith('/edd')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isPartnerActive = pathname.startsWith('/financialRisk')

  const isSupplyChildActive =
    pathname.startsWith('/eudd') ||
    pathname.startsWith('/hrdd') ||
    pathname.startsWith('/edd')

  const isPartnerChildActive = pathname.startsWith('/financialRisk')

  const handleMouseEnter = () => setHovered(true)
  const handleMouseLeave = () => {
    setHovered(false)
    setOpenParent(false)
    setOpenESGChild(false)
    setOpenSupplyChild(false)
    setOpenPartnerChild(false)
  }

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed items-start h-full overflow-hidden text-white transition-all duration-300 ease-in-out bg-white border-r group/sidebar ${
        hovered ? 'w-60' : 'w-[65px]'
      }`}>
      <nav className="flex flex-col w-full space-y-2">
        <a
          href="/home"
          className={`flex flex-row items-center gap-4 p-2 px-4 rounded group hover:bg-customG hover:text-white font-semibold text-base ${
            isHomeActive ? 'text-customG' : 'text-primary'
          }`}>
          <HomeIcon className={isHomeActive ? 'text-customG' : 'text-primary'} />
          <span className="whitespace-nowrap">Home</span>
        </a>
        <div className="w-full">
          <button
            onClick={() => setOpenParent(!openParent)}
            className={`flex flex-row items-center justify-between w-full p-2 px-4 text-left rounded group hover:bg-customG hover:text-white font-semibold text-base ${
              isESGActive ? 'text-customG' : 'text-primary'
            }`}>
            <div className="flex flex-row items-center w-full gap-4">
              <Message className={isESGActive ? 'text-customG' : 'text-primary'} />
              <span className="whitespace-nowrap">ESG 공시</span>
            </div>
            <Arrow open={openParent} />
          </button>

          {/* transition 추가 */}
          <div
            className={`flex flex-col ml-4 overflow-hidden transition-all duration-300 ${
              openParent
                ? 'max-h-64 opacity-100 translate-y-0'
                : 'max-h-0 opacity-0 -translate-y-2'
            }`}>
            <button
              onClick={() => setOpenESGChild(!openESGChild)}
              className={`flex flex-row items-center justify-between w-full p-2 px-4 mb-2 rounded group font-semibold text-base ${
                isESGChildActive ? 'text-customG' : 'text-primary'
              } hover:bg-customG hover:text-white`}>
              IFRS S2
              <Arrow open={openESGChild} />
            </button>
            <div
              className={`flex flex-col w-full items-start overflow-hidden transition-all duration-300 gap-y-2 ${
                openESGChild
                  ? 'max-h-40 opacity-100 translate-y-0'
                  : 'max-h-0 opacity-0 -translate-y-2'
              }`}>
              <Link
                href="/governance"
                className={`hover:underline pl-6 text-sm ${
                  pathname === '/governance' ? 'text-customG' : 'text-primary'
                }`}>
                거버넌스
              </Link>
              <Link
                href="/strategy"
                className={`hover:underline pl-6 text-sm ${
                  pathname === '/strategy' ? 'text-customG' : 'text-primary'
                }`}>
                전략
              </Link>
              <Link
                href="/goal"
                className={`hover:underline pl-6 text-sm ${
                  pathname === '/goal' ? 'text-customG' : 'text-primary'
                }`}>
                목표 및 지표
              </Link>
            </div>
            <Link
              href="/GRI"
              className="flex flex-row items-center justify-between w-full p-2 px-4 text-base font-semibold text-left rounded text-primary hover:bg-customG hover:text-white">
              GRI
            </Link>
          </div>
        </div>
        <div className="w-full">
          <button
            onClick={() => setOpenSupplyChild(!openSupplyChild)}
            className={`flex flex-row items-center justify-between w-full p-2 px-4 text-left rounded group hover:bg-customG hover:text-white font-semibold text-base ${
              isSupplyChildActive ? 'text-customG' : 'text-primary'
            }`}>
            <div className="flex flex-row items-center w-full gap-4">
              <Email className={isSupplyChildActive ? 'text-customG' : 'text-primary'} />
              <span className="whitespace-nowrap">공급망 실사</span>
            </div>
            <Arrow open={openSupplyChild} />
          </button>

          <div
            className={`flex flex-col pl-6 w-full items-start overflow-hidden transition-all duration-300 gap-y-2 ${
              openSupplyChild
                ? 'max-h-40 opacity-100 translate-y-0'
                : 'max-h-0 opacity-0 -translate-y-2'
            }`}>
            <Link
              href="/eudd"
              className={`block w-full px-2 py-1 mt-2 text-sm text-left hover:underline hover:text-customG ${
                pathname === '/eudd' ? 'text-customG' : 'text-primary'
              }`}>
              EU 공급망 실사
            </Link>
            <Link
              href="/hrdd"
              className={`block w-full px-2 py-1 text-sm text-left hover:underline hover:text-customG ${
                pathname === '/hrdd' ? 'text-customG' : 'text-primary'
              }`}>
              인권 실사
            </Link>
            <Link
              href="/edd"
              className={`block w-full px-2 py-1 text-sm text-left hover:underline hover:text-customG ${
                pathname === '/edd' ? 'text-customG' : 'text-primary'
              }`}>
              환경 실사
            </Link>
          </div>
        </div>
        <div className="w-full">
          <button
            onClick={() => setOpenPartnerChild(!openPartnerChild)}
            className={`flex flex-row items-center justify-between w-full p-2 px-4 mb-2 text-left rounded group font-semibold text-base ${
              isPartnerChildActive ? 'text-customG' : 'text-primary'
            } hover:bg-customG hover:text-white`}>
            <div className="flex flex-row items-center w-full gap-4">
              <Avatar
                className={isPartnerChildActive ? 'text-customG' : 'text-primary'}
              />
              <span className="whitespace-nowrap">협력사 관리</span>
            </div>
            <Arrow open={openPartnerChild} />
          </button>
          {hovered && (
            <div
              className={`flex flex-col w-full items-start overflow-hidden transition-all duration-300 gap-y-2 ${
                openPartnerChild
                  ? 'max-h-40 opacity-100 translate-y-0'
                  : 'max-h-0 opacity-0 -translate-y-2'
              }`}>
              <Link
                href="/financialRisk"
                className={`hover:underline hover:text-customG pl-6 text-sm ${
                  pathname === '/financialRisk' ? 'text-customG' : 'text-primary'
                }`}>
                재무제표 리스크 관리
              </Link>
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}
