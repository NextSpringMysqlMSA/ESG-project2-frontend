'use client'

import {useRef, useState} from 'react'

interface AccountPageProps {
  onProfileImageChange: (newImage: string) => void
}

export default function AccountPage({onProfileImageChange}: AccountPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 개인정보 상태
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleEditClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      onProfileImageChange(fileUrl)
    }
  }

  const handleSave = () => {
    console.log({
      name,
      phone,
      email,
      password,
      confirmPassword
    })
    alert('저장 완료!')
  }

  return (
    <div className="flex w-full gap-12">
      {/* 왼쪽: 프로필 */}
      <div className="flex flex-col items-center w-1/3 gap-4">
        <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-4xl">👤</span>
        </div>

        {/* 숨겨진 파일 선택 */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />

        {/* Edit 버튼 */}
        <button
          onClick={handleEditClick}
          className="px-4 py-2 border rounded hover:bg-blue-500 hover:text-white">
          Edit
        </button>
      </div>

      {/* 오른쪽: 개인정보 입력 */}
      <div className="flex flex-col w-2/3 gap-4">
        <div>
          <label className="block mb-1 font-semibold">이름</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">전화번호</label>
          <input
            type="text"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">이메일</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">비밀번호 확인</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={handleSave}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Save
        </button>
      </div>
    </div>
  )
}
