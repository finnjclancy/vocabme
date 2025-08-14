import { NextRequest } from 'next/server'
import { makeSentence } from '@/lib/openai'

export async function POST(req: NextRequest) {
  const { word, definition } = await req.json()
  if (!word || !definition) return new Response('bad request', { status: 400 })
  const sentence = await makeSentence(word, definition)
  return new Response(JSON.stringify({ sentence }), { headers: { 'content-type': 'application/json' } })
}


