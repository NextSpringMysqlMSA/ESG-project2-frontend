import Email from '../svg/email'
import Message from '../svg/message'
import Avatar from '../svg/avatar'

export default function Sidebar() {
  return (
    <aside className="flex flex-col items-start w-[65px] h-full overflow-hidden text-black transition-all duration-300 ease-in-out bg-white border-r group/sidebar hover:w-60">
      <nav className="flex flex-col w-full space-y-2">
        <a
          href="/dashboard"
          className="group flex flex-row p-2 hover:bg-[#1890FF] hover:text-white rounded items-center gap-4">
          <Message />
          <span className="whitespace-nowrap">ESG 공시</span>
        </a>
        <a
          href="/dashboard/environmental"
          className="group flex flex-row p-2 hover:bg-[#1890FF] hover:text-white rounded items-center gap-4">
          <Email />
          <span className="whitespace-nowrap">OO 관리</span>
        </a>
        <a
          href="/dashboard/social"
          className="group flex flex-row p-2 hover:bg-[#1890FF] hover:text-white rounded items-center gap-4">
          <Avatar />
          <span className="whitespace-nowrap">OO 관리</span>
        </a>
      </nav>
    </aside>
  )
}
