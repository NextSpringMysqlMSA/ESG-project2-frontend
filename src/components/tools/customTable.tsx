import {cn} from '@/lib/utils'
import {typeThemeConfig} from './collapsibleWindow'

type RowData = {
  id: number
  values: string[]
}

type CustomTableProps = {
  headers: string[]
  data: RowData[]
  type: keyof typeof typeThemeConfig
  theme: (typeof typeThemeConfig)[keyof typeof typeThemeConfig]
  onRowClick?: (
    type: CustomTableProps['type'],
    rowValues: string[],
    rowId: number
  ) => void
  className?: string
}

export default function CustomTable({
  type,
  headers,
  data,
  onRowClick,
  theme,
  className
}: CustomTableProps) {
  return (
    <div className={cn('w-full overflow-hidden rounded-lg shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={`${theme.bgHeader} ${theme.textColor.replace('600', '800')}`}>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={cn(
                    `px-4 py-3 font-medium text-left border-b ${theme.border}`,
                    index === 0 && 'rounded-tl-lg',
                    index === headers.length - 1 && 'rounded-tr-lg'
                  )}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-4 py-8 text-center text-gray-500 bg-gray-50">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              data.map(({id, values}) => (
                <tr
                  key={id}
                  className={cn(
                    'transition-colors border-b border-gray-100',
                    onRowClick && `cursor-pointer ${theme.hover}`
                  )}
                  onClick={() => onRowClick?.(type, values, id)}>
                  {values.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        'px-4 py-3 text-left text-gray-700',
                        colIndex === 0 &&
                          `font-medium ${theme.textColor.replace('600', '700')}`
                      )}>
                      {cell || '-'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
