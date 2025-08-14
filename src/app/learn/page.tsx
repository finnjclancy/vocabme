"use client"
import { useEffect, useMemo, useState } from 'react'
import { Sidebar } from '../(shell)/sidebar'
import { BottomNav } from '../(shell)/bottom-nav'
import type { Word } from '@/lib/supabase/types'

type Card = { wordId: string; mode: 'blank' | 'match_def' }

export default function LearnPage() {
  const [loading, setLoading] = useState(true)
  const [queue, setQueue] = useState<Card[]>([])
  const [words, setWords] = useState<Record<string, Word>>({})
  const [current, setCurrent] = useState<Card | null>(null)
  const [hint, setHint] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const start = await fetch('/api/sessions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'start' }) })
        if (!start.ok) {
          console.log('session start failed:', start.status)
          setLoading(false)
          return
        }
        const { session_id } = await start.json()
        setSessionId(session_id)

        const res = await fetch('/api/lessons')
        if (!res.ok) {
          console.log('lessons failed:', res.status)
          setLoading(false)
          return
        }
        const data = await res.json()
        const dict: Record<string, Word> = {}
        for (const w of data.words as Word[]) dict[w.id] = w
        setWords(dict)
        setQueue(data.cards as Card[])
        setCurrent((data.cards as Card[])[0] ?? null)
      } catch (error) {
        console.error('learn page error:', error)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function next(correct: boolean, payload?: any) {
    if (!current) return
    // queue rule: wrong goes to end; right disappears
    const [, ...rest] = queue
    const newQueue = correct ? rest : [...rest, current]
    setQueue(newQueue)
    setCurrent(newQueue[0] ?? null)
    // log attempt
    const word = words[current.wordId]
    fetch('/api/attempts', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ word_id: current.wordId, type: current.mode, correct, prompt: { word: word.word_text }, reply: payload ?? null })
    }).catch(() => {})

    // if finished, end session
    if (newQueue.length === 0 && sessionId) {
      fetch('/api/sessions', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ action: 'finish', session_id: sessionId, xp_earned: 10 }) }).catch(() => {})
    }
  }

  return (
    <div className="min-h-screen md:flex">
      <Sidebar />
      <main className="flex-1 p-4 pb-16 md:pb-4 space-y-4">
        <h1 className="text-2xl font-semibold">learn</h1>
        {loading && <div className="rounded border p-4">loading…</div>}
        {!loading && !current && <div className="rounded border p-4">lesson complete</div>}
        {!loading && current && (
          <CardView
            card={current}
            word={words[current.wordId]}
            allWords={Object.values(words)}
            onAnswer={(correct, payload) => next(correct, payload)}
            onHint={setHint}
          />
        )}
        {hint && <p className="text-sm text-gray-600">hint: {hint}</p>}
      </main>
      <BottomNav />
    </div>
  )
}

function CardView({ card, word, allWords, onAnswer, onHint }: { card: Card; word: Word; allWords: Word[]; onAnswer: (c: boolean, payload?: any) => void; onHint: (h: string) => void }) {
  if (card.mode === 'blank') return <BlankCard word={word} allWords={allWords} onAnswer={onAnswer} onHint={onHint} />
  return <MatchDefCard word={word} allWords={allWords} onAnswer={onAnswer} />
}

function BlankCard({ word, allWords, onAnswer, onHint }: { word: Word; allWords: Word[]; onAnswer: (c: boolean, payload?: any) => void; onHint: (h: string) => void }) {
  const [sentence, setSentence] = useState<string>('')
  const [choices, setChoices] = useState<string[]>([])
  const [picked, setPicked] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/ai/sentence', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ word: word.word_text, definition: word.definition }) })
      const data = await res.json()
      const s: string = data.sentence || ''
      const blanked = s.replace(new RegExp(word.word_text, 'ig'), '____') || '____'
      setSentence(blanked)
      const distractors = shuffle(allWords.filter(w => w.id !== word.id).map(w => w.word_text)).slice(0, 3)
      setChoices(shuffle([word.word_text, ...distractors]))
    })()
  }, [word.id])

  return (
    <div className="rounded border p-4 space-y-4">
      <div className="text-lg">fill the blank:</div>
      <div className="text-2xl font-medium">{sentence}</div>
      <div className="flex gap-2 flex-wrap">
        {choices.map((c, i) => (
          <button key={i} className={`px-3 py-2 rounded border ${picked === c ? 'border-brand-600' : ''}`} onClick={() => setPicked(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button className="px-3 py-2 rounded bg-black text-white" onClick={() => onAnswer(picked === word.word_text, { picked, sentence })}>check</button>
        <button className="px-3 py-2 rounded border" onClick={() => onHint(word.definition)}>hint</button>
      </div>
    </div>
  )
}

function MatchDefCard({ word, allWords, onAnswer }: { word: Word; allWords: Word[]; onAnswer: (c: boolean, payload?: any) => void }) {
  const [picked, setPicked] = useState<string | null>(null)
  const options = useMemo(() => {
    const wrongs = shuffle(allWords.filter(w => w.id !== word.id).map(w => w.definition)).slice(0, 3)
    return shuffle([word.definition, ...wrongs])
  }, [word.id, allWords.length])
  return (
    <div className="rounded border p-4 space-y-4">
      <div className="text-lg">pick the correct definition for:</div>
      <div className="text-2xl font-medium">{word.word_text}</div>
      <div className="grid gap-2">
        {options.map((opt, i) => (
          <button key={i} className={`text-left px-3 py-2 rounded border ${picked === opt ? 'border-brand-600' : ''}`} onClick={() => setPicked(opt)}>
            {opt}
          </button>
        ))}
      </div>
      <button className="px-3 py-2 rounded bg-black text-white" onClick={() => onAnswer(picked === word.definition, { picked })}>check</button>
    </div>
  )
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}




