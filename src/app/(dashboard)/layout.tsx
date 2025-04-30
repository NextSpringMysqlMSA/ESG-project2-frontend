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
      <div className="flex flex-col h-screen">
        <HomeNavbar />
        <div className="flex flex-row w-full h-full">
          <Sidebar />
          {children}
        </div>
      </div>
    </ProfileProvider>
  )
}
