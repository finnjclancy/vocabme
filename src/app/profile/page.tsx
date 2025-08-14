import { Sidebar } from '../(shell)/sidebar'
import { BottomNav } from '../(shell)/bottom-nav'

export default function ProfilePage() {
  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="flex-1 p-4 pb-16 md:pb-4">
        <h1 className="text-2xl font-semibold mb-4">profile</h1>
        <div className="rounded border p-4">profile settings coming soon</div>
      </main>
      <BottomNav />
    </div>
  )
}




