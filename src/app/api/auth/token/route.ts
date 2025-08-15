import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { code, code_verifier, state } = await request.json()

    console.log('token api called with:', { 
      code: code ? 'present' : 'missing', 
      code_verifier: code_verifier ? 'present' : 'missing', 
      state: state || 'missing' 
    })

    if (!code || !code_verifier || !state) {
      return NextResponse.json({ error: 'missing required parameters' }, { status: 400 })
    }

    // exchange code for access token with pkce
    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.X_CLIENT_ID}:${process.env.X_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.X_CALLBACK_URI || 'http://localhost:3000/auth/callback',
        code_verifier
      })
    })

    console.log('twitter token response status:', tokenResponse.status)

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('token exchange failed:', errorText)
      return NextResponse.json({ error: 'token exchange failed' }, { status: 400 })
    }

    const tokenData = await tokenResponse.json()
    console.log('token exchange successful')
    const accessToken = tokenData.access_token

    // get user info
    const userResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!userResponse.ok) {
      console.error('user info failed:', await userResponse.text())
      return NextResponse.json({ error: 'failed to get user info' }, { status: 400 })
    }

    const userData = await userResponse.json()
    console.log('user info successful:', userData.data.username)
    const user = userData.data

    // create or update user in our database
    const { supabaseServer } = await import('@/lib/supabase/server')
    
    const { data: profile, error: profileError } = await supabaseServer()
      .from('profiles')
      .upsert({
        id: user.id,
        username: user.username,
        display_name: user.name,
        avatar_url: user.profile_image_url,
        timezone: 'UTC' // default timezone
      }, {
        onConflict: 'id'
      })
      .select()
      .single()

    if (profileError) {
      console.error('profile creation failed:', profileError)
      return NextResponse.json({ error: 'failed to create profile' }, { status: 500 })
    }

    console.log('profile created/updated successfully')

    // create session
    const sessionId = crypto.randomUUID()
    const sessionData = {
      id: sessionId,
      user_id: user.id,
      access_token: accessToken,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    }

    const { error: sessionError } = await supabaseServer()
      .from('sessions')
      .insert(sessionData)

    if (sessionError) {
      console.error('session creation failed:', sessionError)
      return NextResponse.json({ error: 'failed to create session' }, { status: 500 })
    }

    console.log('session created successfully')

    // set session cookie
    const cookieStore = cookies()
    cookieStore.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    })

    return NextResponse.json({ session_id: sessionId })

  } catch (error) {
    console.error('token exchange error:', error)
    return NextResponse.json({ error: 'internal server error' }, { status: 500 })
  }
}
