import { NextRequest } from 'next/server'
import { suggestDefinitions } from '@/lib/openai'

export async function POST(req: NextRequest) {
  const { word } = await req.json()
  if (!word || typeof word !== 'string') {
    return new Response(JSON.stringify({ options: [], error: 'Invalid word' }), { status: 400 })
  }
  
  // test if openai key is set
  console.log('checking openai key:', process.env.OPENAI_API_KEY ? 'present' : 'missing')
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY not set')
    return new Response(JSON.stringify({ options: [], error: 'OpenAI API key not configured' }), { status: 500 })
  }
  
  try {
    console.log('ai route: processing word:', word)
    

    
    const options = await suggestDefinitions(word.trim())
    console.log('ai route: got options:', options)
    
    if (options.length === 0) {
      return new Response(JSON.stringify({ options: [], error: 'No definitions generated' }), { status: 500 })
    }
    
    return new Response(JSON.stringify({ options }), { headers: { 'content-type': 'application/json' } })
  } catch (error) {
    console.error('ai route error:', error)
    return new Response(JSON.stringify({ options: [], error: String(error) }), { status: 500 })
  }
}




