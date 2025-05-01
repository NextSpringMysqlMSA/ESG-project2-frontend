type CustomTableProps = {
  headers: string[]
}

export default function CustomTable({headers}: CustomTableProps) {
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
        <tr>
          <td colSpan={headers.length} className="py-4 text-muted-foreground">
            데이터가 없습니다.
          </td>
        </tr>
      </tbody>
    </table>
  )
}
