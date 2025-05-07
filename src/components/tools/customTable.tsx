type RowData = {
  id: number
  values: string[]
}

type CustomTableProps = {
  headers: string[]
  data: RowData[]
  type: 'committee' | 'meeting' | 'KPI' | 'education'
  onRowClick?: (
    type: CustomTableProps['type'],
    rowValues: string[],
    rowId: number
  ) => void
}

export default function CustomTable({type, headers, data, onRowClick}: CustomTableProps) {
  return (
    <table className="w-full text-center table-fixed">
      <thead className="border-b-2 border-b-black">
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td colSpan={headers.length} className="py-4 text-muted-foreground">
              데이터가 없습니다.
            </td>
          </tr>
        ) : (
          data.map(({id, values}) => (
            <tr
              key={id}
              className="border-b hover:cursor-pointer hover:bg-gray-300"
              onClick={() => onRowClick?.(type, values, id)}>
              {values.map((cell, colIndex) => (
                <td key={colIndex} className="py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  )
}
