"use client"
import { useState } from 'react'
import { Sidebar } from '../(shell)/sidebar'
import { BottomNav } from '../(shell)/bottom-nav'

export default function AddPage() {
  const [word, setWord] = useState('')
  const [candidates, setCandidates] = useState<string[]>([])
  const [definition, setDefinition] = useState('')
  const [loading, setLoading] = useState(false)

  async function suggest() {
    setLoading(true)
    setCandidates([])
    setDefinition('')
    try {
      const res = await fetch('/api/ai/definitions', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ word })
      })
      const data = await res.json()
      setCandidates(data.options ?? [])
    } finally {
      setLoading(false)
    }
  }

  async function save() {
    setLoading(true)
    try {
      const res = await fetch('/api/words', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ word_text: word, definition })
      })
      if (!res.ok) throw new Error('failed')
      setWord('')
      setDefinition('')
      setCandidates([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="flex-1 p-4 pb-16 md:pb-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold">add words</h1>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="type a word"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
          <div className="flex gap-2">
            <button onClick={suggest} disabled={!word || loading} className="px-3 py-2 rounded bg-brand-600 text-white disabled:opacity-50">suggest definitions</button>
          </div>
          <textarea
            className="w-full border rounded px-3 py-2 h-40"
            placeholder="or write your own definition"
            value={definition}
            onChange={(e) => setDefinition(e.target.value)}
          />
          <button onClick={save} disabled={!word || !definition || loading} className="px-3 py-2 rounded bg-black text-white disabled:opacity-50">save</button>
        </div>
        <div className="space-y-2">
          <h2 className="font-medium">suggestions</h2>
          <div className="grid gap-2">
            {candidates.map((opt, i) => (
              <button key={i} className={`text-left border rounded p-3 hover:bg-gray-50 ${definition === opt ? 'border-brand-600' : ''}`} onClick={() => setDefinition(opt)}>
                {opt}
              </button>
            ))}
            {!loading && candidates.length === 0 && <p className="text-gray-500">no suggestions yet</p>}
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}




