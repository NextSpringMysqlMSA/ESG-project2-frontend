'use client'

import {useState} from 'react'
import TextModal from '@/app/(dashboard)/GRI/(tables)/textModal'

// 테이블 셀 타입 정의 (string 또는 {value: string; rowSpan?: number} 형태)
type TableCell = string | {value: string; rowSpan?: number}

// TableProps 타입 정의 (headers, rows, tableId 받음)
type TableProps = {
  headers: string[] // 테이블 헤더
  rows: TableCell[][] // 테이블 내용
  tableId: string // ex) GRI2, GRI3, GRI200 등
}

const getCellValue = (cell: TableCell) => (typeof cell === 'string' ? cell : cell.value)

export default function GriTable({headers, rows, tableId}: TableProps) {
  // 모달 관련 상태 변수들 정의
  const [modalOpen, setModalOpen] = useState(false) // 모달 열림/닫힘 상태
  const [modalKey, setModalKey] = useState('') // 어떤 항목의 모달을 열지 구분할 key
  const [modalTitle, setModalTitle] = useState('') // 모달 제목
  const [modalContent, setModalContent] = useState('') // 모달 내용
  const [modalContents, setModalContents] = useState<Record<string, string>>({}) // 모달 내용 저장 객체

  // 모달 열기 함수 (key, 제목, 내용 전달)
  const openModal = (key: string, title: string, content: string) => {
    setModalKey(key) // 모달 키 설정
    setModalTitle(title) // 모달 제목 설정
    setModalContent(content) // 모달 내용 설정
    setModalOpen(true) // 모달 열기
  }

  // 모달 닫기 함수
  const closeModal = () => {
    if (modalKey) {
      // 모달을 닫을 때 modalContents에 내용을 저장
      setModalContents(prev => ({
        ...prev,
        [modalKey]: modalContent // 키로 저장된 항목의 내용 업데이트
      }))
    }
    setModalOpen(false) // 모달 닫기
    setModalKey('') // 모달 키 초기화
    setModalTitle('') // 모달 제목 초기화
    setModalContent('') // 모달 내용 초기화
  }

  return (
    <div className="relative overflow-x-auto">
      {/* 모달 컴포넌트 */}
      <TextModal
        open={modalOpen} // 모달 열림 상태
        title={modalTitle} // 모달 제목
        value={modalContent} // 모달 내용
        onChange={val => setModalContent(val)} // 모달 내용 변경 시 호출되는 함수
        onClose={closeModal} // 모달 닫을 때 호출되는 함수
      />
      {/* 테이블 */}
      <table className="w-full border-collapse">
        <thead className="text-center border-b-2">
          {/* 테이블 헤더 */}
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`${
                  index !== headers.length - 1 ? 'border-r-2' : ''
                } px-2 py-1`}>
                {header} {/* 헤더 항목 표시 */}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* 테이블 내용 */}
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => {
                // 셀 값 추출 (문자열 또는 객체 형태일 수 있음)
                const content = typeof cell === 'string' ? {value: cell} : cell
                const isLastCol = j === row.length - 1 // 마지막 컬럼 여부
                const isSecondLastCol = j === row.length - 2 // 끝에서 두 번째 컬럼 여부

                const cellValue = content.value // 셀 값

                // 셀 정렬 (마지막 두 칸은 왼쪽 정렬, 나머지 칸은 가운데 정렬)
                const alignment = j >= row.length - 2 ? 'text-start' : 'text-center'

                // No. 또는 Topic 컬럼에 대한 값 추출 (없으면 기본값 '세부 내용' 사용)
                const noValue = row.length >= 3 ? getCellValue(row[row.length - 3]) : ''
                const title =
                  row.length >= 2 ? getCellValue(row[row.length - 2]) : '세부 내용'

                // 모달을 구분할 key 생성 (tableId + 항목 번호로 유니크한 키를 생성)
                const modalKey = `${tableId}:${noValue}`

                return (
                  <td
                    key={j}
                    rowSpan={content.rowSpan}
                    className={`border-b-2 px-2 py-1 ${alignment} ${
                      j !== row.length - 1
                        ? 'border-r-2 whitespace-nowrap'
                        : 'w-full min-w-[300px] cursor-pointer hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      // 마지막 칸 클릭 시 모달 열기
                      if (isLastCol)
                        openModal(modalKey, title, modalContents[modalKey] || cellValue)
                    }}>
                    {cellValue} {/* 셀 내용 표시 */}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
