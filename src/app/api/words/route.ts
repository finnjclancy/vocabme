import { NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const { word_text, definition } = await req.json()
  if (!word_text || !definition) {
    return new Response('bad request', { status: 400 })
  }
  const sb = supabaseServer()
  const user = (await sb.auth.getUser()).data.user
  if (!user) return new Response('unauthorized', { status: 401 })

  const { data, error } = await sb
    .from('words')
    .insert({ word_text, definition, user_id: user.id })
    .select('*')
    .single()
  if (error) return new Response(error.message, { status: 400 })
  return new Response(JSON.stringify(data), { headers: { 'content-type': 'application/json' } })
}




