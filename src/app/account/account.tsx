'use client'

import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useProfileStore} from '@/stores/profileStore'
import {changePasswordApi, uploadProfileImageApi} from '@/services/auth'
import {showError, showSuccess} from '@/util/toast'
import {motion} from 'framer-motion'
import {
  User,
  ChevronLeft,
  Mail,
  Phone,
  Building,
  Briefcase,
  ShieldCheck
} from 'lucide-react'
import axios from 'axios'

export default function Account() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {profile, fetchProfile, refreshProfileImage} = useProfileStore()

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        setIsLoading(true)
        await uploadProfileImageApi(file)
        await refreshProfileImage()
        showSuccess('프로필 이미지가 업데이트되었습니다.')
      } catch (e: unknown) {
        showError('이미지 업로드에 실패했습니다. 다시 시도해 주세요.')
      } finally {
        console.log(e)
        setIsLoading(false)
      }
    }
  }

  const handlePasswordChange = (key: keyof typeof passwordForm, value: string) => {
    setPasswordForm(prev => ({...prev, [key]: value}))
  }

  const handlePasswordSubmit = async () => {
    const {currentPassword, newPassword, confirmPassword} = passwordForm

    if (!currentPassword || !newPassword || !confirmPassword) {
      return showError('모든 비밀번호 입력란을 채워주세요.')
    }

    if (newPassword !== confirmPassword) {
      return showError('새 비밀번호가 일치하지 않습니다.')
    }

    if (newPassword.length < 8) {
      return showError('새 비밀번호는 최소 8자 이상이어야 합니다.')
    }

    try {
      setIsLoading(true)
      await changePasswordApi({currentPassword, newPassword, confirmPassword})
      showSuccess('비밀번호가 성공적으로 변경되었습니다.')
      setPasswordForm({currentPassword: '', newPassword: '', confirmPassword: ''})
    } catch (err) {
      let errorMessage = '비밀번호 변경에 실패했습니다.'
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        errorMessage = err.response.data.message
      }
      showError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // 프로필 정보 항목
  const profileItems = [
    {label: '이름', value: profile?.name, icon: <User size={18} />},
    {label: '이메일', value: profile?.email, icon: <Mail size={18} />},
    {label: '전화번호', value: profile?.phoneNumber, icon: <Phone size={18} />},
    {label: '회사명', value: profile?.companyName, icon: <Building size={18} />},
    {label: '직급', value: profile?.position, icon: <Briefcase size={18} />}
  ]

  // 비밀번호 변경 항목
  const passwordItems = [
    {
      label: '현재 비밀번호',
      name: 'currentPassword',
      placeholder: '현재 사용 중인 비밀번호'
    },
    {
      label: '새 비밀번호',
      name: 'newPassword',
      placeholder: '8자 이상의 새 비밀번호'
    },
    {
      label: '새 비밀번호 확인',
      name: 'confirmPassword',
      placeholder: '새 비밀번호 다시 입력'
    }
  ]
  return (
    <div className="flex flex-col w-full min-h-screen p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5}}
          className="mb-8">
          <button
            onClick={() => router.back()}
            className="py-2.5 bg-customG text-white rounded-lg hover:bg-customGDark transition-colors focus:outline-none focus:ring-2 focus:ring-customGRing focus:ring-offset-2 disabled:opacity-70 w-32 flex items-center justify-center font-medium">
            <ChevronLeft size={20} />
            <span className="ml-1 font-medium">돌아가기</span>
          </button>
        </motion.div>

        <div className="flex flex-col gap-6">
          {/* 계정 정보 카드 - 프로필 사진이 오른쪽 상단에 위치 */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.3}}
            className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <div className="flex flex-col md:flex-row md:items-start">
              <div className="flex-1">
                <h2 className="flex items-center mb-4 text-xl text-gray-800 font-gmBold">
                  <User size={20} className="mr-2" />
                  계정 정보
                </h2>

                <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
                  {profileItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center p-3 transition-colors rounded-lg hover:bg-customGLight">
                      <div className="flex items-center justify-center w-10 h-10 mr-4 text-white rounded-full bg-customG">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">{item.label}</p>
                        <p className="font-medium text-gray-800">{item.value || '-'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 프로필 사진 섹션 - 오른쪽으로 이동 */}
              <div className="flex flex-col items-center mt-6 md:mt-0 md:ml-8">
                <div className="relative group">
                  <div className="overflow-hidden bg-white border-2 rounded-full w-60 h-60 border-customGLight ring-2 ring-customGLight">
                    {profile?.profileImageUrl ? (
                      <img
                        src={profile.profileImageUrl}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <User size={40} />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={handleEditClick}
                    disabled={isLoading}
                    className="mt-3 py-1.5 px-3 bg-customG text-white text-sm rounded-lg hover:bg-customGDark transition-colors focus:outline-none focus:ring-2 focus:ring-customGRing focus:ring-offset-1 disabled:opacity-70 flex items-center justify-center font-medium w-full">
                    {isLoading ? '업로드 중...' : '사진 변경'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
          {/* 비밀번호 변경 카드 */}
          <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.4}}
            className="p-6 bg-white border border-gray-100 shadow-sm rounded-xl">
            <h2 className="flex items-center mb-6 text-xl text-gray-800 font-gmBold">
              <ShieldCheck size={20} className="mr-2" />
              비밀번호 변경
            </h2>

            <div className="space-y-4">
              {passwordItems.map(item => (
                <div key={item.name} className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700">
                    {item.label}
                  </label>
                  <input
                    type="password"
                    value={passwordForm[item.name as keyof typeof passwordForm]}
                    onChange={e =>
                      handlePasswordChange(
                        item.name as keyof typeof passwordForm,
                        e.target.value
                      )
                    }
                    placeholder={item.placeholder}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-customGRing focus:border-transparent"
                  />
                </div>
              ))}

              <div className="mt-6">
                <button
                  onClick={handlePasswordSubmit}
                  disabled={isLoading}
                  className="py-2.5 px-4 bg-customG text-white rounded-lg hover:bg-customGDark transition-colors focus:outline-none focus:ring-2 focus:ring-customGRing focus:ring-offset-2 disabled:opacity-70 w-full flex items-center justify-center font-medium">
                  {isLoading ? '처리 중...' : '비밀번호 변경하기'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
