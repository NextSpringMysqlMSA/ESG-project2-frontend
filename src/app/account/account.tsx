'use client'

import {useEffect, useRef, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useProfileStore} from '@/stores/profileStore'
import DashButton from '@/components/tools/dashButton'
import {changePasswordApi, uploadProfileImageApi} from '@/services/auth'
import {showError, showSuccess} from '@/util/toast'
import {FaRegUserCircle} from 'react-icons/fa'

export default function Account() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const {profile, fetchProfile} = useProfileStore()

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [profileImage, setProfileImage] = useState<string>('')

  useEffect(() => {
    fetchProfile().then(() => {
      if (profile?.profileImageUrl) {
        setProfileImage(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}${profile.profileImageUrl}`
        )
      }
    })
  }, [])

  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const uploadedImageUrl = await uploadProfileImageApi(file)
        setProfileImage(uploadedImageUrl)
        fetchProfile() // 이미지 변경 후 프로필 재조회
        showSuccess('프로필 이미지가 변경되었습니다.')
      } catch (e) {
        showError('이미지 업로드 실패')
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

    try {
      await changePasswordApi({currentPassword, newPassword, confirmPassword})
      showSuccess('비밀번호가 변경되었습니다.')
      setPasswordForm({currentPassword: '', newPassword: '', confirmPassword: ''})
    } catch (e: any) {
      const msg = e?.response?.data?.message || '비밀번호 변경 실패'
      showError(msg)
    }
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#F9FBFF] px-4 py-8">
      <div className="self-start px-6 mb-8">
        <DashButton onClick={() => router.back()} width="w-10">
          ←
        </DashButton>
      </div>

      <div className="flex flex-col items-start justify-center w-full max-w-5xl gap-10 mx-auto md:flex-row">
        <div className="flex flex-col items-center gap-6">
          <div className="flex items-center justify-center w-32 h-32 overflow-hidden transition-transform duration-300 bg-white border-4 rounded-full shadow-md border-customG hover:scale-105 hover:ring-4 hover:ring-customG/30 text-customG">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            ) : (
              <FaRegUserCircle className="w-full h-full p-4" />
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <DashButton onClick={handleEditClick} width="w-24">
            프로필 변경
          </DashButton>
        </div>

        <div className="flex flex-col w-full p-8 bg-white shadow-lg rounded-2xl">
          <div className="flex flex-col divide-y divide-gray-200">
            {[
              {label: '이름', value: profile?.name},
              {label: '이메일', value: profile?.email},
              {label: '전화번호', value: profile?.phoneNumber},
              {label: '회사명', value: profile?.companyName},
              {label: '직급', value: profile?.position}
            ].map((item, idx) => (
              <div key={idx} className="flex items-center h-14">
                <div className="w-1/3 font-medium text-gray-700">{item.label}</div>
                <div className="flex-1 font-semibold">{item.value || '-'}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col mt-6 divide-y divide-gray-200">
            {[
              {label: '현재 비밀번호', name: 'currentPassword'},
              {label: '새 비밀번호', name: 'newPassword'},
              {label: '새 비밀번호 확인', name: 'confirmPassword'}
            ].map(({label, name}) => (
              <div key={name} className="flex items-center h-14">
                <div className="w-1/3 font-medium text-gray-700">{label}</div>
                <input
                  type="password"
                  value={passwordForm[name as keyof typeof passwordForm]}
                  onChange={e =>
                    handlePasswordChange(
                      name as keyof typeof passwordForm,
                      e.target.value
                    )
                  }
                  placeholder={`${label}를 입력하세요`}
                  className="flex w-64 p-2 text-base border rounded-lg focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-8">
            <DashButton onClick={handlePasswordSubmit} width="w-24">
              저장
            </DashButton>
          </div>
        </div>
      </div>
    </div>
  )
}
