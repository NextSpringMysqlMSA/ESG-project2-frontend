/**
 * 앱 전역에서 사용하는 색상 시스템
 *
 * 색상을 중앙에서 관리하여 일관된 디자인 시스템을 유지합니다.
 * tailwind 클래스와 CSS 변수 모두 지원합니다.
 */

// 기본 색상 테마
export const themeColors = {
  primary: 'customG', // 기본 테마 색상 (기존 customG)
  secondary: 'blue', // 보조 색상
  accent: 'purple', // 강조 색상
  warning: 'amber', // 경고 색상
  error: 'red', // 오류 색상
  success: 'green', // 성공 색상
  info: 'blue' // 정보 색상
}

// 모듈별 색상 매핑
export const moduleColors = {
  GRI: {
    primary: themeColors.primary,
    secondary: 'teal',
    gradient: 'from-green-100 to-green-50',
    iconColor: 'text-customG'
  },
  CSDD: {
    primary: themeColors.primary,
    secondary: 'emerald',
    gradient: 'from-green-100 to-green-50',
    iconColor: 'text-customG'
  },
  IFRS: {
    governance: {
      primary: 'blue',
      gradient: 'from-blue-100 to-blue-50',
      iconColor: 'text-blue-600'
    },
    strategy: {
      primary: 'purple',
      gradient: 'from-purple-100 to-purple-50',
      iconColor: 'text-purple-600'
    },
    goal: {
      primary: 'emerald',
      gradient: 'from-emerald-100 to-emerald-50',
      iconColor: 'text-emerald-600'
    }
  }
}

// 상태 색상 클래스 생성 함수
export function getSeverityClass(
  text: string,
  defaultClasses = 'bg-gray-50 text-gray-600 border-gray-200'
) {
  if (!text) return defaultClasses

  const lowerText = text.toLowerCase()

  if (
    lowerText.includes('심각') ||
    lowerText.includes('높음') ||
    lowerText.includes('예')
  ) {
    return 'bg-red-50 text-red-600 border-red-100'
  }

  if (lowerText.includes('중간') || lowerText.includes('부분')) {
    return 'bg-amber-50 text-amber-600 border-amber-100'
  }

  if (
    lowerText.includes('낮음') ||
    lowerText.includes('없음') ||
    lowerText.includes('아니요')
  ) {
    return 'bg-green-50 text-green-600 border-green-100'
  }

  return defaultClasses
}

// UI 컴포넌트 테마 클래스 생성 함수
export function getThemeClasses(module: string, submodule?: string) {
  // let colors = themeColors
  let moduleColor = themeColors.primary

  // 모듈별 색상 선택
  if (module === 'GRI') {
    moduleColor = moduleColors.GRI.primary
  } else if (module === 'CSDD') {
    moduleColor = moduleColors.CSDD.primary
  } else if (module === 'IFRS') {
    if (submodule === 'governance') {
      moduleColor = moduleColors.IFRS.governance.primary
    } else if (submodule === 'strategy') {
      moduleColor = moduleColors.IFRS.strategy.primary
    } else if (submodule === 'goal') {
      moduleColor = moduleColors.IFRS.goal.primary
    }
  }

  return {
    pageBackground: 'bg-slate-50',
    cardBorder: `border-${moduleColor}-100/50`,
    cardShadow: 'shadow-sm',
    gradientBg: `bg-gradient-to-r from-${moduleColor}-100 to-${moduleColor}-50/50`,
    lightBg: `bg-${moduleColor}-50/20`,
    iconColor: `text-${moduleColor}-600`,
    borderAccent: `border-${moduleColor}-300`,
    buttonPrimary: `bg-${moduleColor} hover:bg-${moduleColor}Dark text-white`,
    buttonOutline: `border border-${moduleColor} text-${moduleColor} hover:bg-${moduleColor}Light/20`
  }
}
