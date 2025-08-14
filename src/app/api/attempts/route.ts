import { NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

// submit attempt
export async function POST(req: NextRequest) {
  const sb = supabaseServer()
  const user = (await sb.auth.getUser()).data.user
  if (!user) return new Response('unauthorized', { status: 401 })

  const body = await req.json()
  const { word_id, type, correct, prompt, reply, meta } = body
  if (!word_id || !type || typeof correct !== 'boolean') {
    return new Response('bad request', { status: 400 })
  }

  const { error } = await sb.from('attempts').insert({
    user_id: user.id,
    word_id,
    type,
    correct,
    prompt: prompt ?? null,
    reply: reply ?? null,
    meta: meta ?? null,
  })
  if (error) return new Response(error.message, { status: 400 })
  return new Response('ok')
}


