import Mypage from '@/components/mypage/mypage'

export default function MypagePage() {
  return (
    <div className="flex w-full gap-8">
      {/* 왼쪽 프로필 영역 */}
      <div className="w-1/3 flex flex-col items-center">
        <Mypage />
      </div>

      {/* 오른쪽 폼 영역 */}
      <div className="w-2/3 bg-white p-8 rounded shadow">
        <form className="flex flex-col gap-4">
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <input type="text" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Phone Number</label>
            <input type="text" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <input type="email" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Password</label>
            <input type="password" className="w-full border rounded p-2" />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Confirm Password</label>
            <input type="password" className="w-full border rounded p-2" />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4">
            Save
          </button>
        </form>
      </div>
    </div>
  )
}
