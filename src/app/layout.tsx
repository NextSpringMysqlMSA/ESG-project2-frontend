import './globals.css'

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="flex flex-col w-full h-full bg-[#F9FBFF]">{children}</body>
    </html>
  )
}
