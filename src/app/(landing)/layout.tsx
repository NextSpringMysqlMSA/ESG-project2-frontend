import LandingNavBar from '@/components/layout/landingNavbar'

export const metadata = {
  title: 'NSMM',
  description: 'NSMM home page',
  icons: {
    icon: '/icons/leaf.svg'
  }
}

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="fixed w-full h-screen bg-gradient-to-b from-customGStart to-white -z-50" />
      <LandingNavBar />
      <div className="flex flex-col flex-1 w-full mt-16">{children}</div>
    </div>
  )
}
