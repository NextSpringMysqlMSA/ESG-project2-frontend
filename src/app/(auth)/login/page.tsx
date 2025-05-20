import {Suspense} from 'react'
import Login from './login'

export const metadata = {
  title: '로그인',
  description: 'NSMM login page',
  icons: {
    icon: '/icons/leaf.svg'
  }
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  )
}
