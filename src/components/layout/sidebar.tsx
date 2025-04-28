'use client'

import {useState} from 'react'
import Email from '../svg/email'
import Message from '../svg/message'
import Avatar from '../svg/avatar'
import Arrow from '../svg/arrow'
import HomeIcon from '../svg/home'
import Link from 'next/link'

export default function Sidebar() {
  const [openParent, setOpenParent] = useState(false)
  const [openChild, setOpenChild] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleMouseEnter = () => setHovered(true)
  const handleMouseLeave = () => {
    setHovered(false)
    setOpenParent(false)
    setOpenChild(false)
  }

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`flex flex-col items-start h-full overflow-hidden text-black transition-all duration-300 ease-in-out bg-white border-r group/sidebar ${
        hovered ? 'w-60' : 'w-[65px]'
      }`}>
      <nav className="flex flex-col w-full space-y-2">
        <a
          href="/home"
          className="group flex flex-row p-2 hover:bg-[#1890FF] hover:text-white rounded items-center gap-4">
          <HomeIcon />
          <span className="whitespace-nowrap">Home</span>
        </a>
        <div className="w-full">
          <button
            onClick={() => setOpenParent(!openParent)}
            className="group flex flex-row p-2 hover:bg-[#1890FF] hover:text-white rounded items-center justify-between w-full text-left">
            <div className="flex flex-row items-center w-full gap-4">
              <Message />
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
              onClick={() => setOpenChild(!openChild)}
              className="group flex flex-row p-2 hover:bg-[#1890FF] hover:text-white rounded items-center justify-between w-full">
              IFRS S2
              <Arrow open={openChild} />
            </button>
            <div
              className={`flex flex-col ml-4 overflow-hidden transition-all duration-300 gap-y-2 w-full items-start ${
                openChild
                  ? 'max-h-40 opacity-100 translate-y-0'
                  : 'max-h-0 opacity-0 -translate-y-2'
              }`}>
              <Link href="/governance" className="hover:underline">
                거버넌스
              </Link>
              <Link href="/strategy" className="hover:underline">
                전략
              </Link>
              <Link href="/goal" className="hover:underline">
                목표 및 지표
              </Link>
            </div>
            <a
              href="/"
              className="flex flex-row p-2 hover:bg-[#1890FF] hover:text-white rounded items-center justify-between w-full text-left">
              GRI
            </a>
          </div>
        </div>
        <a
          href="/dashboard/environmental"
          className="group flex flex-row p-2 hover:bg-[#1890FF] hover:text-white rounded items-center gap-4">
          <Email />
          <span className="whitespace-nowrap">OO 관리</span>
        </a>
        <a
          href="/dashboard/social"
          className="group flex flex-row p-2 hover:bg-[#1890FF] hover:text-white rounded items-center gap-4">
          <Avatar />
          <span className="whitespace-nowrap">OO 관리</span>
        </a>
      </nav>
    </aside>
  )
}
