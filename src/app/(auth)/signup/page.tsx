import SignUp from './signup'

export const metadata = {
  title: '회원가입',
  description: 'NSMM signup page',
  icons: {
    icon: '/icons/leaf.svg'
  }
}

export default function signup() {
  return (
    <div>
      <SignUp />
    </div>
  )
}
