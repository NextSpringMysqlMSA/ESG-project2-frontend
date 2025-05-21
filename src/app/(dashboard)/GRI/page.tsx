import GRI from './gri'

export const metadata = {
  title: 'GRI : ESG 공시',
  description: 'NSMM GRI page',
  icons: {
    icon: '/icons/leaf.svg'
  }
}

export default function gri() {
  return (
    <div>
      <GRI />
    </div>
  )
}
