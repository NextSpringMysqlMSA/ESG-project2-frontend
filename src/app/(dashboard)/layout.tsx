import HomeNavbar from '@/components/layout/homeNavbar'
import Sidebar from '@/components/layout/sidebar'
import {ProfileProvider} from '@/contexts/ProfileContext'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ProfileProvider>
      <div className="flex flex-col w-full h-full bg-gray-50">
        <HomeNavbar />
        <div className="flex flex-row w-full h-full mt-16">
          <Sidebar />
          <div className="flex justify-center w-full ml-[65px] transition-all duration-300">
            <div className="flex flex-col w-full max-w-screen-xl">{children}</div>
          </div>
        </div>
      </div>
    </ProfileProvider>
  )
}
