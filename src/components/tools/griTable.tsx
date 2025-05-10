'use client'

import {useState} from 'react'
import TextModal from '@/app/(dashboard)/GRI/(tables)/textModal'
import {cn} from '@/lib/utils'
import {Edit2} from 'lucide-react'

// 테이블 셀 타입 정의
type TableCell = string | {value: string; rowSpan?: number}

// TableProps 타입 정의
type TableProps = {
  headers: string[]
  rows: TableCell[][]
  tableId: string
}

const getCellValue = (cell: TableCell) => (typeof cell === 'string' ? cell : cell.value)

export default function GriTable({headers, rows, tableId}: TableProps) {
  // 모달 관련 상태 변수들
  const [modalOpen, setModalOpen] = useState(false)
  const [modalKey, setModalKey] = useState('')
  const [modalTitle, setModalTitle] = useState('')
  const [modalContent, setModalContent] = useState('')
  const [modalContents, setModalContents] = useState<Record<string, string>>({})
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  // 모달 열기 함수
  const openModal = (key: string, title: string, content: string) => {
    setModalKey(key)
    setModalTitle(title)
    setModalContent(content)
    setModalOpen(true)
  }

  // 모달 닫기 함수
  const closeModal = () => {
    if (modalKey) {
      setModalContents(prev => ({
        ...prev,
        [modalKey]: modalContent
      }))
    }
    setModalOpen(false)
    setModalKey('')
    setModalTitle('')
    setModalContent('')
  }

  // 행 디자인 설정 함수
  const getRowStyle = (index: number) => {
    return cn(
      'transition-colors duration-150',
      index % 2 === 0 ? 'bg-white' : 'bg-gray-50',
      hoveredRow === index && 'bg-gray-100'
    )
  }

  // 셀 내용의 상태 확인 (빈 값인지 확인)
  const hasCellContent = (key: string) => {
    return modalContents[key] && modalContents[key].trim() !== ''
  }

  return (
    <div className="relative overflow-x-auto">
      <TextModal
        open={modalOpen}
        title={modalTitle}
        value={modalContent}
        onChange={val => setModalContent(val)}
        onClose={closeModal}
      />

      <div className="overflow-hidden border rounded-md shadow-sm">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="text-sm font-medium text-gray-700 bg-gray-100">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-4 py-3 text-left',
                    index !== headers.length - 1 ? 'border-r border-gray-200' : ''
                  )}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, i) => (
              <tr
                key={i}
                className={getRowStyle(i)}
                onMouseEnter={() => setHoveredRow(i)}
                onMouseLeave={() => setHoveredRow(null)}>
                {row.map((cell, j) => {
                  const content = typeof cell === 'string' ? {value: cell} : cell
                  const isLastCol = j === row.length - 1
                  const cellValue = content.value

                  // No. 또는 Topic 컬럼에 대한 값 추출
                  const noValue = row.length >= 3 ? getCellValue(row[row.length - 3]) : ''
                  const title =
                    row.length >= 2 ? getCellValue(row[row.length - 2]) : '세부 내용'

                  // 모달을 구분할 key 생성
                  const modalKey = `${tableId}:${noValue}`

                  // 마지막 열이 비어 있는지 확인 (편집 가능한 내용)
                  const isEmpty =
                    isLastCol &&
                    (!modalContents[modalKey] || modalContents[modalKey].trim() === '')

                  // 내용이 있는 경우 짧게 표시
                  const shortContent =
                    isLastCol && modalContents[modalKey]
                      ? modalContents[modalKey].length > 50
                        ? modalContents[modalKey].substring(0, 50) + '...'
                        : modalContents[modalKey]
                      : cellValue

                  return (
                    <td
                      key={j}
                      rowSpan={content.rowSpan}
                      className={cn(
                        'px-4 py-3 text-sm',
                        j !== row.length - 1 ? 'border-r border-gray-200' : '',
                        isLastCol
                          ? 'w-full min-w-[300px] cursor-pointer group relative'
                          : j === 0
                          ? 'font-medium text-gray-700 whitespace-nowrap'
                          : 'text-gray-600 whitespace-nowrap'
                      )}
                      onClick={() => {
                        if (isLastCol)
                          openModal(modalKey, title, modalContents[modalKey] || cellValue)
                      }}>
                      {isLastCol ? (
                        <div className="flex items-center">
                          <span
                            className={
                              isEmpty ? 'text-gray-400 italic' : 'text-gray-700'
                            }>
                            {isEmpty ? '내용을 입력하려면 클릭하세요' : shortContent}
                          </span>
                          <span className="ml-2 transition-opacity opacity-0 group-hover:opacity-100">
                            <Edit2 className="h-3.5 w-3.5 text-customG" />
                          </span>
                        </div>
                      ) : (
                        cellValue
                      )}

                      {/* 작성 상태 표시 - 마지막 열이고 내용이 있는 경우 */}
                      {isLastCol && (
                        <div className="absolute transform -translate-y-1/2 right-2 top-1/2">
                          {hasCellContent(modalKey) && (
                            <div
                              className="w-2 h-2 bg-green-500 rounded-full"
                              title="내용이 작성되었습니다"></div>
                          )}
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
