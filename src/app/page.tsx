import Main from './main'
import LandingNavBar from '@/components/layout/landingNavbar'

export default function main() {
  return (
    <div className="flex flex-col">
      <LandingNavBar />
      <Main />
    </div>
  )
}
