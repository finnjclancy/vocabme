import { NextRequest } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

// start session
export async function POST(req: NextRequest) {
  const sb = supabaseServer()
  const user = (await sb.auth.getUser()).data.user
  if (!user) return new Response('unauthorized', { status: 401 })

  const { action, session_id, meta, xp_earned } = await req.json()

  if (action === 'start') {
    const { data, error } = await sb
      .from('sessions')
      .insert({ user_id: user.id, meta: meta ?? null })
      .select('id')
      .single()
    if (error) return new Response(error.message, { status: 400 })
    return new Response(JSON.stringify({ session_id: data.id }), { headers: { 'content-type': 'application/json' } })
  }

  if (action === 'finish' && session_id) {
    const { error } = await sb
      .from('sessions')
      .update({ ended_at: new Date().toISOString(), xp_earned: xp_earned ?? 0 })
      .eq('id', session_id)
      .eq('user_id', user.id)
    if (error) return new Response(error.message, { status: 400 })
    return new Response('ok')
  }

  return new Response('bad request', { status: 400 })
}


