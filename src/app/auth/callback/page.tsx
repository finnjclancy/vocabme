'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function CallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [debug, setDebug] = useState<string[]>([])

  const addDebug = (message: string) => {
    setDebug(prev => [...prev, message])
    console.log('callback debug:', message)
  }

  useEffect(() => {
    const handleCallback = async () => {
      addDebug('callback started')
      
      const code = searchParams.get('code')
      const error = searchParams.get('error')
      const state = searchParams.get('state')

      addDebug(`code: ${code ? 'present' : 'missing'}`)
      addDebug(`error: ${error || 'none'}`)
      addDebug(`state: ${state || 'missing'}`)

      if (error) {
        setError(`oauth error: ${error}`)
        return
      }

      if (!code) {
        setError('no authorization code received')
        return
      }

      if (!state) {
        setError('no state parameter received')
        return
      }

      // verify state matches what we stored
      const storedState = sessionStorage.getItem('oauth_state')
      addDebug(`stored state: ${storedState || 'missing'}`)
      
      if (state !== storedState) {
        setError('state mismatch')
        return
      }

      // get code verifier from session storage
      const codeVerifier = sessionStorage.getItem('code_verifier')
      addDebug(`code verifier: ${codeVerifier ? 'present' : 'missing'}`)
      
      if (!codeVerifier) {
        setError('no code verifier found')
        return
      }

      try {
        addDebug('calling token api...')
        
        // exchange code for token
        const tokenResponse = await fetch('/api/auth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code,
            code_verifier: codeVerifier,
            state
          })
        })

        addDebug(`token response status: ${tokenResponse.status}`)

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json()
          addDebug(`token error: ${JSON.stringify(errorData)}`)
          setError(errorData.error || 'token exchange failed')
          return
        }

        const responseData = await tokenResponse.json()
        addDebug(`token success: ${JSON.stringify(responseData)}`)

        const { session_id } = responseData

        // clear session storage
        sessionStorage.removeItem('oauth_state')
        sessionStorage.removeItem('code_verifier')

        addDebug('redirecting to /learn')
        
        // redirect to learn page
        router.push('/learn')

      } catch (error) {
        console.error('callback error:', error)
        addDebug(`exception: ${error}`)
        setError('callback failed')
      }
    }

    handleCallback()
  }, [searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">authentication failed</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <div className="mt-4 text-left text-sm text-gray-500">
              <h3 className="font-semibold">debug info:</h3>
              {debug.map((msg, i) => (
                <div key={i} className="mt-1">{msg}</div>
              ))}
            </div>
            <button
              onClick={() => router.push('/auth/sign-in')}
              className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              try again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">completing sign in...</h2>
        <p className="mt-2 text-gray-600">please wait while we complete your authentication</p>
        <div className="mt-4 text-left text-sm text-gray-500">
          <h3 className="font-semibold">debug info:</h3>
          {debug.map((msg, i) => (
            <div key={i} className="mt-1">{msg}</div>
          ))}
        </div>
      </div>
    </div>
  )
}
