import { NextRequest } from 'next/server'
import { suggestDefinitions } from '@/lib/openai'

export async function POST(req: NextRequest) {
  const { word } = await req.json()
  if (!word || typeof word !== 'string') {
    return new Response(JSON.stringify({ options: [] }), { status: 400 })
  }
  const options = await suggestDefinitions(word.trim())
  return new Response(JSON.stringify({ options }), { headers: { 'content-type': 'application/json' } })
}




