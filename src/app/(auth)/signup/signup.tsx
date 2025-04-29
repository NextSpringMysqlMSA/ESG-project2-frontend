import Link from 'next/link'
import AuthInputBox from '@/components/authInputBox'

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center w-full space-y-6 bg-[#F9FBFF]">
      <div className="flex flex-col my-10 px-8 py-8 space-y-4 w-[400px] bg-white border shadow-xl rounded-2xl">
        <div className="text-2xl font-bold text-center">회원가입</div>
        {/* 이름 */}
        <label className="w-full text-base font-medium">
          이름 <span className="text-red-600">*</span>
          <AuthInputBox placeholder="이름" />
        </label>
        {/* 이메일 */}
        <label className="w-full text-base font-medium">
          이메일 <span className="text-red-600">*</span>
          <AuthInputBox placeholder="이메일" />
        </label>
        {/* 전화번호 */}
        <label className="w-full text-base font-medium">
          전화번호 <span className="text-red-600">*</span>
          <AuthInputBox placeholder="전화번호" />
        </label>
        {/* 회사명 */}
        <label className="w-full text-base font-medium">
          회사명
          <AuthInputBox placeholder="회사명" />
        </label>
        {/* 직급 */}
        <label className="w-full text-base font-medium">
          직급
          <AuthInputBox placeholder="직급" />
        </label>
        {/* 비밀번호 */}
        <label className="w-full text-base font-medium">
          비밀번호 <span className="text-red-600">*</span>
          <AuthInputBox type="password" placeholder="비밀번호" />
        </label>
        {/* 비밀번호 확인 */}
        <label className="w-full text-base font-medium">
          비밀번호 확인 <span className="text-red-600">*</span>
          <AuthInputBox type="password" placeholder="비밀번호 확인" />
        </label>
        {/* 계정 생성 버튼 */}
        <button className="w-full h-12 text-base text-white transition-all duration-300 border rounded-lg bg-customG hover:bg-white hover:text-customG border-customG">
          계정 생성
        </button>
        {/* 로그인 링크 */}
        <div className="text-sm text-center">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="font-semibold text-customG hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  )
}
