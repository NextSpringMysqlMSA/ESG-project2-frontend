import Governance from '@/app/(dashboard)/(IFRS)/governance/governance'

export const metadata = {
  title: '거버넌스 : IFRS S2',
  description: 'NSMM governance page',
  icons: {
    icon: '/icons/leaf.svg'
  }
}

export default function governance() {
  return (
    <div className="w-full h-full">
      <Governance />
    </div>
  )
}
