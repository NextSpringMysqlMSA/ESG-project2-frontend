type CustomTableProps = {
  headers: string[]
  data: string[][]
}

export default function CustomTable({headers, data}: CustomTableProps) {
  return (
    <table className="w-full text-center table-fixed">
      <thead className="border-b-2 border-b-black">
        <tr>
          {headers.map(header => (
            <th key={header}>{header}</th>
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
          data.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b">
              {row.map((cell, colIndex) => (
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
