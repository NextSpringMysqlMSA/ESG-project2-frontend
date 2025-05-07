import {Suspense} from 'react'
import Login from './login'

export default function LoginPage() {
  return (
    <div className="h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    </div>
  )
}
