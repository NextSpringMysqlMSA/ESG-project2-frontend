import Account from './account'

export const metadata = {
  title: '회원정보',
  description: 'NSMM account page',
  icons: {
    icon: '/icons/leaf.svg'
  }
}

export default function AccountPage() {
  return (
    <div className="w-full h-full">
      <Account />
    </div>
  )
}
