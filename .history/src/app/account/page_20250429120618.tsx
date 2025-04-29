'use client'

import Account from '@/components/account/account'

export default function AccountPage(props: any) {
  return (
    <div className="w-full h-full">
      <Account {...props} />
    </div>
  )
}
