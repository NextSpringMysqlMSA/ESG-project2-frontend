'use client'

import {useEffect, useState} from 'react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {HoverCard, HoverCardContent, HoverCardTrigger} from '@/components/ui/hover-card'
import {useProfileStore} from '@/stores/profileStore'
import Arrow from '../svg/arrow'

const defaultProfile = 'https://github.com/shadcn.png'

export default function HomeNavbar() {
  const {profile, fetchProfile} = useProfileStore()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchProfile() // 함수 호출로 사용자 정보 불러오기
  }, [])

  return (
    <div className="z-40 flex flex-row items-center justify-between w-full p-2 bg-white shadow-sm">
      <Link href="/" className="flex flex-row items-center">
        <img src="/dash.svg" alt="logo" className="w-12 mr-4" />
        <span className="text-3xl font-bold text-customG">NSMM</span>
      </Link>

      <div className="flex flex-row items-center gap-4">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={defaultProfile} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </HoverCardTrigger>
          <HoverCardContent className="w-64">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={defaultProfile} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-lg font-bold">{profile?.name ?? '이름 없음'}</p>
                <p className="text-sm text-gray-500">{profile?.position}</p>
                <p className="text-sm text-gray-500">{profile?.email}</p>
                <p className="text-sm text-gray-500">{profile?.phoneNumber}</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="flex flex-row items-center justify-between w-48 h-10 px-2 border text-primary">
            {profile ? `${profile.position} ${profile.name}` : '로그인 사용자'}님
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
