import { Sidebar } from '../(shell)/sidebar'
import { BottomNav } from '../(shell)/bottom-nav'

export default function FriendsPage() {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="flex-1 p-4 pb-16 md:pb-4">
        <h1 className="text-2xl font-semibold mb-4">friends</h1>
        <div className="rounded border p-4">friend list coming soon</div>
      </main>
      <BottomNav />
    </div>
  )
}




