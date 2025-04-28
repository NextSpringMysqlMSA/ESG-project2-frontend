import Link from 'next/link'

export default function NavBar() {
  return (
    <div className="flex flex-row items-center w-full p-2 shadow-sm">
      <Link href="/" className="flex flex-row items-center">
        <img src="/dash.svg" alt="logo" className="w-12 mr-4" />
        <span className="text-3xl font-bold">NSMM</span>
      </Link>
    </div>
  )
}
