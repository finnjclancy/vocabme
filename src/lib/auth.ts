import { cookies } from 'next/headers'
import { supabaseServer } from './supabase/server'

export async function getCurrentUser() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get('session_id')?.value

  if (!sessionId) {
    return null
  }

  try {
    // get session and check if it's expired
    const { data: session, error: sessionError } = await supabaseServer()
      .from('sessions')
      .select('*, profiles(*)')
      .eq('id', sessionId)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (sessionError || !session) {
      return null
    }

    return session.profiles
  } catch (error) {
    console.error('getCurrentUser error:', error)
    return null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  
  if (!user) {
    throw new Error('unauthorized')
  }
  
  return user
}

export async function getSession() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get('session_id')?.value

  if (!sessionId) {
    return null
  }

  try {
    const { data: session, error } = await supabaseServer()
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (error || !session) {
      return null
    }

    return session
  } catch (error) {
    console.error('getSession error:', error)
    return null
  }
}
