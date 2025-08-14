import Link from 'next/link'

export function BottomNav() {
  return (
    <nav className="fixed md:hidden bottom-0 left-0 right-0 bg-white border-t">
      <div className="grid grid-cols-5">
        <Link href="/learn" className="p-3 text-center">learn</Link>
        <Link href="/add" className="p-3 text-center">add</Link>
        <Link href="/review" className="p-3 text-center">review</Link>
        <Link href="/chat" className="p-3 text-center">tutor</Link>
        <Link href="/profile" className="p-3 text-center">profile</Link>
      </div>
    </nav>
  )
}




