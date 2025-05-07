// middleware.ts
import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value

  // 로그인된 유저는 /login 접근 못하게
  if (request.nextUrl.pathname.startsWith('/login') && isLoggedIn === 'true') {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  return NextResponse.next()
}
