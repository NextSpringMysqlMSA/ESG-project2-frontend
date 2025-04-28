'use client'

import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {useState} from 'react'
import Arrow from '../svg/arrow'

// HomeNavbarProps 타입 정의
interface HomeNavbarProps {
  profileImage: string
  onProfileImageChange: (newImage: string) => void // 프로필 이미지 변경 함수 타입 정의
}

export default function HomeNavbar({
  profileImage,
  onProfileImageChange
}: HomeNavbarProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="z-40 flex flex-row items-center justify-between w-full p-2 shadow-sm">
      <Link href="/" className="flex flex-row items-center">
        <img src="/dash.svg" alt="logo" className="w-12 mr-4" />
        <span className="text-3xl font-bold">NSMM</span>
      </Link>
      <div className="flex flex-row items-center gap-4">
        <Avatar>
          {/* 수정된 프로필 이미지가 이곳에 반영된다 */}
          <AvatarImage src={profileImage} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="flex flex-row items-center justify-between w-48 h-10 px-2 border">
            관리자 김지현님
            <Arrow open={open} />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href="/account">
              <DropdownMenuItem className="hover:cursor-pointer">설정</DropdownMenuItem>
            </Link>
            <Link href="/login">
              <DropdownMenuItem className="hover:cursor-pointer">
                로그아웃
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
