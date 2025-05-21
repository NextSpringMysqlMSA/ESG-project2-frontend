import CSDDD from './csddd'

export const metadata = {
  title: '공급망 실사',
  description: 'NSMM csddd page',
  icons: {
    icon: '/icons/leaf.svg'
  }
}

export default function CSDDDPage() {
  return (
    <div>
      <CSDDD />
    </div>
  )
}
