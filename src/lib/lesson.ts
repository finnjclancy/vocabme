import type { Word } from './supabase/types'

export type CardMode = 'blank' | 'match_def'
export type Card = { wordId: string; mode: CardMode }

export function buildLesson(words: Word[], learnedWeight = 0.15, target = 14): Card[] {
  const notLearned = words.filter(w => !w.is_learned)
  const learned = words.filter(w => w.is_learned)

  // base selection
  const numLearned = Math.max(2, Math.floor(target * learnedWeight))
  const numNotLearned = Math.max(8, target - numLearned)

  const pick = <T,>(arr: T[], n: number) => shuffle(arr).slice(0, Math.min(n, arr.length))
  const a = pick(notLearned, numNotLearned)
  const b = pick(learned, numLearned)
  const pool = shuffle([...a, ...b])

  // assign modes alternating to guarantee variety
  const modes: CardMode[] = ['blank', 'match_def']
  const cards: Card[] = pool.map((w, i) => ({ wordId: w.id, mode: modes[i % modes.length] }))
  return cards
}

export function runQueueRule(prevQueue: Card[], current: Card, correct: boolean): Card[] {
  const q = [...prevQueue]
  if (correct) return q
  // wrong → push to end
  q.push(current)
  return q
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}


