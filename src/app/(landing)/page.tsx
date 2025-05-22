'use client'

import {useRef} from 'react'
import Header from './header'
import Footer from './footer'
import Main from './main'

export default function Page() {
  const mainRef = useRef<HTMLDivElement>(null)

  return (
    <div className="w-full ">
      {/* 헤더 ----------------------------------------------------------------------------------------------------- */}
      <div className="min-h-[calc(100vh-64px)]">
        <Header
          onArrowClick={() => mainRef.current?.scrollIntoView({behavior: 'smooth'})}
        />
      </div>
      <div ref={mainRef}>
        <Main />
      </div>
      <Footer />
    </div>
  )
}
