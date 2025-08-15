'use client'

import { useState } from 'react'

// generate a random string for pkce
function generateRandomString(length: number) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let text = ''
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

// generate code verifier and challenge for pkce
function generateCodeVerifier() {
  return generateRandomString(128)
}

async function generateCodeChallenge(verifier: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleXSignIn = async () => {
    setIsLoading(true)
    
    try {
      // generate pkce values
      const codeVerifier = generateCodeVerifier()
      const codeChallenge = await generateCodeChallenge(codeVerifier)
      
      // store code verifier in session storage for the callback
      sessionStorage.setItem('code_verifier', codeVerifier)
      
      // redirect to x oauth
      const clientId = process.env.NEXT_PUBLIC_X_CLIENT_ID
      const redirectUri = process.env.NEXT_PUBLIC_X_CALLBACK_URI || 'http://localhost:3000/auth/callback'
      const scope = 'tweet.read users.read'
      const state = generateRandomString(32)
      
      // store state for verification
      sessionStorage.setItem('oauth_state', state)
      
      const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`
      
      window.location.href = authUrl
    } catch (error) {
      console.error('oauth error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            sign in to vocabme
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            learn words with your x account
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleXSignIn}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
          >
            {isLoading ? (
              <span>signing in...</span>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
                sign in with x
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}


