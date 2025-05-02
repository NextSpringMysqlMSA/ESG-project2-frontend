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
import {useAuthStore} from '@/stores/authStore'
import {useRouter} from 'next/navigation'
import {FaRegUserCircle} from 'react-icons/fa'

export default function HomeNavbar() {
  const {profile, fetchProfile} = useProfileStore()
  const {logout} = useAuthStore()
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    localStorage.removeItem('auth-storage')
    router.push('/login')
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  return (
    <div className="fixed w-full">
      <div className="z-40 flex flex-row items-center justify-between w-full p-2 bg-white shadow-sm">
        <Link href="/" className="flex flex-row items-center">
          <img src="/dash.svg" alt="logo" className="w-12 mr-4" />
          <span className="text-3xl font-bold text-customG">NSMM</span>
        </Link>

        <div className="flex flex-row items-center gap-4">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Avatar className="w-10 h-10 cursor-pointer">
                {profile?.profileImageUrl ? (
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${profile.profileImageUrl}`}
                  />
                ) : (
                  <FaRegUserCircle className="w-full h-full p-2 text-gray-400" />
                )}
              </Avatar>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  {profile?.profileImageUrl ? (
                    <AvatarImage
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${profile.profileImageUrl}`}
                    />
                  ) : (
                    <FaRegUserCircle className="w-full h-full p-4 text-gray-400" />
                  )}
                </Avatar>
              </div>
              <div className="flex flex-col mt-2">
                <p className="text-lg font-bold">{profile?.name ?? '이름 없음'}</p>
                <p className="text-sm text-gray-500">{profile?.position}</p>
                <p className="text-sm text-gray-500">{profile?.email}</p>
                <p className="text-sm text-gray-500">{profile?.phoneNumber}</p>
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
                <DropdownMenuItem onClick={handleLogout} className="hover:cursor-pointer">
                  로그아웃
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
