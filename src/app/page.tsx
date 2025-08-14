import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">vocabme</h1>
        <p className="text-gray-600">learn the words you want</p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/learn" className="px-4 py-2 rounded bg-brand-600 text-white">start learning</Link>
          <Link href="/add" className="px-4 py-2 rounded border">add words</Link>
        </div>
      </div>
    </main>
  )
}


