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
  const [openESGChild, setOpenESGChild] = useState(false)
  const [openSupplyChild, setOpenSupplyChild] = useState(false)
  const [hovered, setHovered] = useState(false)

  const handleMouseEnter = () => setHovered(true)
  const handleMouseLeave = () => {
    setHovered(false)
    setOpenParent(false)
    setOpenESGChild(false)
    setOpenSupplyChild(false)
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
          className="flex flex-row items-center gap-4 p-2 px-4 rounded group text-primary hover:bg-customG hover:text-white">
          <HomeIcon />
          <span className="whitespace-nowrap">Home</span>
        </a>
        <div className="w-full">
          <button
            onClick={() => setOpenParent(!openParent)}
            className="flex flex-row items-center justify-between w-full p-2 px-4 text-left rounded group text-primary hover:bg-customG hover:text-white">
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
              onClick={() => setOpenESGChild(!openESGChild)}
              className="flex flex-row items-center justify-between w-full p-2 rounded group text-primary hover:bg-customG hover:text-white">
              IFRS S2
              <Arrow open={openESGChild} />
            </button>
            <div
              className={`flex flex-col ml-7 overflow-hidden transition-all duration-300 gap-y-2 w-full items-start ${
                openESGChild
                  ? 'max-h-40 opacity-100 translate-y-0'
                  : 'max-h-0 opacity-0 -translate-y-2'
              }`}>
              <Link
                href="/governance"
                className="hover:underline hover:text-customG text-primary">
                거버넌스
              </Link>
              <Link
                href="/strategy"
                className="hover:underline hover:text-customG text-primary">
                전략
              </Link>
              <Link
                href="/goal"
                className="hover:underline hover:text-customG text-primary">
                목표 및 지표
              </Link>
            </div>
            <a
              href="/"
              className="flex flex-row items-center justify-between w-full p-2 text-left rounded text-primary hover:bg-customG hover:text-white">
              GRI
            </a>
          </div>
        </div>
        <div className="w-full">
          <button
            onClick={() => setOpenSupplyChild(!openSupplyChild)}
            className="flex flex-row items-center justify-between w-full p-2 px-4 text-left rounded group text-primary hover:bg-customG hover:text-white">
            <div className="flex flex-row items-center w-full gap-4">
              <Email />
              <span className="whitespace-nowrap">공급망 실사</span>
            </div>
            <Arrow open={openSupplyChild} />
          </button>

          <div
            className={`flex flex-col ml-7 overflow-hidden transition-all duration-300 gap-y-2 w-full items-start ${
              openSupplyChild
                ? 'max-h-40 opacity-100 translate-y-0'
                : 'max-h-0 opacity-0 -translate-y-2'
            }`}>
            <Link
              href="/eudd"
              className="hover:underline hover:text-customG text-primary">
              EU 공급망 실사
            </Link>
            <Link
              href="/hrdd"
              className="hover:underline hover:text-customG text-primary">
              인권 실사
            </Link>
            <Link href="/edd" className="hover:underline hover:text-customG text-primary">
              환경 실사
            </Link>
          </div>
        </div>
        <a
          href="/dashboard/social"
          className="flex flex-row items-center gap-4 p-2 px-4 rounded group text-primary hover:bg-customG hover:text-white">
          <Avatar />
          <span className="whitespace-nowrap">OO 관리</span>
        </a>
      </nav>
    </aside>
  )
}
