/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: ['class'],
  content: ['./src/app/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        gm: ['gmNormal'],
        gmBold: ['gmBold']
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))'
        },
        // ESG 테마 색상으로 업데이트
        customGRing: colors.emerald[500], // #10b981 (emerald-500) - 포커스 링에 사용
        customG: colors.emerald[600], // #059669 (emerald-600)
        customGDark: colors.emerald[700], // #047857 (emerald-700) - 호버 상태에 사용
        customGLight: colors.emerald[50], // #ECFDF5 (emerald-50) - 배경 등에 사용
        customGStart: colors.emerald[600], // 그라데이션 시작 색상
        customGEnd: colors.emerald[50], // 그라데이션 종료 색상
        customGText: colors.emerald[900], // #064e3b (emerald-900) - 텍스트에 사용
        customGTextLight: colors.emerald[800], // #065f46 (emerald-800) - 텍스트에 사용
        customGTextDark: colors.emerald[700], // #047857 (emerald-700) - 텍스트에 사용
        customGBorder: colors.emerald[100], // #d1fae5 (emerald-100) - 테두리에 사용
        customGBorder200: colors.emerald[200] // #a7f3d0 (emerald-200) - 진한 테두리에 사용
      },
      keyframes: {
        'accordion-down': {
          from: {height: '0'},
          to: {height: 'var(--radix-accordion-content-height)'}
        },
        'accordion-up': {
          from: {height: 'var(--radix-accordion-content-height)'},
          to: {height: '0'}
        },
        // 모달 애니메이션 - 중앙에서 시작하여 스케일만 변경
        'modal-in': {
          '0%': {opacity: '0', transform: 'translate(-50%, -50%) scale(0.95)'},
          '100%': {opacity: '1', transform: 'translate(-50%, -50%) scale(1)'}
        },
        'modal-out': {
          '0%': {opacity: '1', transform: 'translate(-50%, -50%) scale(1)'},
          '100%': {opacity: '0', transform: 'translate(-50%, -50%) scale(0.95)'}
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        // 모달 애니메이션
        'modal-in': 'modal-in 0.2s ease-out',
        'modal-out': 'modal-out 0.2s ease-in forwards'
      }
    }
  },
  plugins: [
    require('tailwindcss-animate'),
    plugin(function ({addComponents, addUtilities}) {
      addComponents({
        '.input': {
          '@apply flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1':
            {}
        }
      })

      // 모달 유틸리티 클래스 추가
      addUtilities({
        '.modal-center': {
          '@apply fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2': {}
        },
        '.modal-overlay': {
          '@apply fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center':
            {}
        }
      })
    })
  ]
}
