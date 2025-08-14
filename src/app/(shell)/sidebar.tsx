import Link from 'next/link'

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:gap-2 p-4 border-r min-h-screen sticky top-0">
      <Link href="/learn" className="px-3 py-2 rounded hover:bg-gray-100">learn</Link>
      <Link href="/add" className="px-3 py-2 rounded hover:bg-gray-100">add words</Link>
      <Link href="/review" className="px-3 py-2 rounded hover:bg-gray-100">review words</Link>
      <Link href="/chat" className="px-3 py-2 rounded hover:bg-gray-100">tutor</Link>
      <Link href="/friends" className="px-3 py-2 rounded hover:bg-gray-100">friends</Link>
      <Link href="/profile" className="px-3 py-2 rounded hover:bg-gray-100">profile</Link>
    </aside>
  )
}




