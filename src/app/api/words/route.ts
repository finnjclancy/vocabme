import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { supabaseServer } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { word, definition } = await request.json()

    if (!word || !definition) {
      return NextResponse.json({ error: 'word and definition required' }, { status: 400 })
    }

    // check if word already exists for this user
    const { data: existingWord } = await supabaseServer()
      .from('words')
      .select('id')
      .eq('user_id', user.id)
      .eq('word_text', word.toLowerCase())
      .single()

    if (existingWord) {
      return NextResponse.json({ error: 'word already exists' }, { status: 409 })
    }

    // insert new word
    const { data: newWord, error } = await supabaseServer()
      .from('words')
      .insert({
        user_id: user.id,
        word_text: word.toLowerCase(),
        definition: definition
      })
      .select()
      .single()

    if (error) {
      console.error('insert word error:', error)
      return NextResponse.json({ error: 'failed to save word' }, { status: 500 })
    }

    return NextResponse.json({ word: newWord })

  } catch (error) {
    console.error('words api error:', error)
    return NextResponse.json({ error: 'internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const { data: words, error } = await supabaseServer()
      .from('words')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('get words error:', error)
      return NextResponse.json({ error: 'failed to get words' }, { status: 500 })
    }

    return NextResponse.json({ words })

  } catch (error) {
    console.error('words api error:', error)
    return NextResponse.json({ error: 'internal server error' }, { status: 500 })
  }
}




