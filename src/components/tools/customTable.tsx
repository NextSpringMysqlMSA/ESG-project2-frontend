import {cn} from '@/lib/utils'

type RowData = {
  id: number
  values: string[]
}

type CustomTableProps = {
  headers: string[]
  data: RowData[]
  type:
    | 'committee'
    | 'meeting'
    | 'KPI'
    | 'education'
    | 'risk'
    | 'scenario'
    | 'kpiGoal'
    | 'netZero'
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
  className
}: CustomTableProps) {
  return (
    <div className={cn('w-full overflow-hidden rounded-lg shadow-sm', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-customGLight text-customGTextDark">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-4 py-3 font-medium text-left border-b border-customGBorder',
                    index === 0 && 'rounded-tl-lg',
                    index === headers.length - 1 && 'rounded-tr-lg'
                  )}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-customGBorder">
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
                    onRowClick && 'hover:cursor-pointer hover:bg-customGLight/30'
                  )}
                  onClick={() => onRowClick?.(type, values, id)}>
                  {values.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        'px-4 py-3 text-left text-gray-700',
                        colIndex === 0 && 'font-medium'
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
