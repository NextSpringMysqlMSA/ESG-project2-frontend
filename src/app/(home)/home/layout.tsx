import HomeNavbar from '@/components/layout/homeNavbar'
import Sidebar from '@/components/layout/sidebar'
export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col h-screen">
      <HomeNavbar />
      <div className="flex flex-row w-full h-full">
        <Sidebar />
        {children}
      </div>
    </div>
  )
}
