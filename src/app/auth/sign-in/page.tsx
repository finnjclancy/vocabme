"use client"
import { supabaseBrowser } from '@/lib/supabase/client'
import { useState } from 'react'

export default function SignInPage() {
  const [loading, setLoading] = useState(false)

  async function signInWithX() {
    setLoading(true)
    try {
      const origin = window.location.origin
      await supabaseBrowser.auth.signInWithOAuth({
        provider: 'twitter',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm border rounded p-6 space-y-4 text-center">
        <h1 className="text-2xl font-semibold">sign in</h1>
        <p className="text-gray-600">continue with x</p>
        <button onClick={signInWithX} disabled={loading} className="w-full px-4 py-2 rounded bg-black text-white disabled:opacity-50">
          sign in with x
        </button>
      </div>
    </main>
  )
}


