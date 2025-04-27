import NavBar from '@/components/layout/navbar'

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col w-full h-screen">
      <NavBar />
      {children}
    </div>
  )
}
