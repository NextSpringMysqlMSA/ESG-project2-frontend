import GriTable from '@/components/tools/griTable'

export default function GRI3() {
  const headers = ['Topic', 'No.', '지표명', '내용']
  const rows = [
    [{value: '중대 토픽 공시', rowSpan: 3}, '3-1', '중요 이슈를 결정하는 프로세스', ''],
    ['3-2', '중요 이슈 목록', ''],
    ['3-3', '중요 이슈 관리', '']
  ]

  return (
    <div className="flex flex-col w-full h-full space-y-4">
      <span className="flex justify-center w-full text-xl font-bold">
        GRI 3: 일반 표준(Universal standards)
      </span>
      <GriTable headers={headers} rows={rows} tableId="GRI3" />
    </div>
  )
}
