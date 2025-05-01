import {toast} from 'react-hot-toast'

const defaultStyle = {
  position: 'top-center' as const,
  style: {
    color: '#000',
    fontWeight: 'bold'
    // fontFamily: 'font-apple' // Tailwind 커스텀 폰트 클래스라면 className으로 써야 작동
  }
}
//----------------------------------------------------------------------------------------------------
export const showWarning = (message: string) => {
  toast(message, {
    ...defaultStyle,
    icon: '⚠️'
  })
}
//----------------------------------------------------------------------------------------------------
export const showError = (message: string) => {
  toast.error(message, {
    ...defaultStyle,
    icon: '❌'
  })
}
//----------------------------------------------------------------------------------------------------
export const showSuccess = (message: string) => {
  toast.success(message, {
    ...defaultStyle,
    icon: '✅'
  })
}
//----------------------------------------------------------------------------------------------------
export const showInfo = (message: string) => {
  toast(message, {
    ...defaultStyle,
    icon: 'ℹ️'
  })
}
//----------------------------------------------------------------------------------------------------
