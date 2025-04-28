'use client'

import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {HoverCard, HoverCardContent, HoverCardTrigger} from '@/components/ui/hover-card'
import {useState} from 'react'
import Arrow from '../svg/arrow'

interface HomeNavbarProps {
  profileImage: string
}

export default function HomeNavbar({profileImage}: HomeNavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="z-40 flex flex-row items-center justify-between w-full p-2 shadow-sm">
      <Link href="/" className="flex flex-row items-center">
        <img src="/dash.svg" alt="logo" className="w-12 mr-4" />
        <span className="text-3xl font-bold">NSMM</span>
      </Link>

      <div className="flex flex-row items-center gap-4">
        {/* HoverCard 추가 */}
        <HoverCard>
          <HoverCardTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={profileImage} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="w-64 transition-all duration-300 ease-in-out">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profileImage} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-lg font-bold">김지현</p>
                <p className="text-sm text-gray-500">부장</p>
                <p className="text-sm text-gray-500">jh123@google.com</p>
                <p className="text-sm text-gray-500">010-1234-5678</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        {/* 기존 DropdownMenu */}
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="flex flex-row items-center justify-between w-48 h-10 px-2 border">
            관리자 김지현님
            <Arrow open={open} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href="/account">
              <DropdownMenuItem>설정</DropdownMenuItem>
            </Link>
            <Link href="/login">
              <DropdownMenuItem>로그아웃</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
