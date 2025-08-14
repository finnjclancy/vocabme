import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function supabaseServer() {
  const cookieStore = cookies()
  const url = process.env.SUPABASE_PROJECT_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anon = process.env.SUPABASE_ANON_PUBLIC_API_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      // no-ops in RSC to avoid mutating headers during render
      set() {},
      remove() {},
    },
  })
}




