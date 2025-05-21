import Strategy from './strategy'

export const metadata = {
  title: '전략 : IFRS S2',
  description: 'NSMM strategy page',
  icons: {
    icon: '/icons/leaf.svg'
  }
}

export default function strategy() {
  return (
    <div className="w-full h-full">
      <Strategy />
    </div>
  )
}
