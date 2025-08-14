import { supabaseServer } from '@/lib/supabase/server'
import { buildLesson } from '@/lib/lesson'

// pick lesson batch (skeleton)
export async function GET() {
  const sb = supabaseServer()
  const user = (await sb.auth.getUser()).data.user
  if (!user) return new Response('unauthorized', { status: 401 })

  // fetch pools
  const { data: words } = await sb
    .from('words')
    .select('*')
    .eq('user_id', user.id)
  const cards = buildLesson(words ?? [])
  return new Response(JSON.stringify({ cards, words: words ?? [] }), {
    headers: { 'content-type': 'application/json' },
  })
}


