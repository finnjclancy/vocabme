import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code = searchParams.get('code')
  if (!code) return NextResponse.redirect(`${origin}/`)

  const sb = supabaseServer()
  const { error } = await sb.auth.exchangeCodeForSession(code)
  if (error) return NextResponse.redirect(`${origin}/auth/sign-in`)
  return NextResponse.redirect(`${origin}/learn`)
}


