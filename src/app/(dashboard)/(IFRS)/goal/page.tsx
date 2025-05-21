import Goal from './goal'

export const metadata = {
  title: '목표 및 지표 : IFRS S2',
  description: 'NSMM goal page',
  icons: {
    icon: '/icons/leaf.svg'
  }
}

export default function goal() {
  return (
    <div className="w-full h-full">
      <Goal />
    </div>
  )
}
