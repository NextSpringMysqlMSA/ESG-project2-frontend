'use client'

import {useRef} from 'react'
import Header from './header'
import LandingNavBar from '@/components/layout/landingNavbar'
import Footer from './footer'
import Main from './main'

export default function Page() {
  const mainRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col items-center w-full h-full">
      <div className="fixed w-full h-full bg-gradient-to-b from-customGStart to-white -z-50" />
      <div className="flex flex-col items-center w-full h-screen">
        <LandingNavBar />
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
