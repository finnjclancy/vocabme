import OpenAI from 'openai'

export function openai() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

export async function suggestDefinitions(word: string): Promise<string[]> {
  console.log('suggestDefinitions called with:', word)
  

  
  const client = openai()
  const prompt = `read this message and respond with an array of 3 definitions for the highlighted word/phrase in this message: "${word}"`
  console.log('sending prompt:', prompt)

  try {
    const res = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'you are a helpful assistant that provides concise definitions. always respond with a valid json array of exactly 3 strings.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.2,
    })
    const text = res.choices[0]?.message?.content || '[]'
    console.log('openai raw response:', JSON.stringify(text))
    try {
      // clean up the text - remove markdown code blocks and extra whitespace
      let cleanText = text.trim()
      
      // remove markdown code blocks (```json ... ```)
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      
      // remove extra whitespace and newlines
      cleanText = cleanText.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
      console.log('cleaned text:', cleanText)
      const arr = JSON.parse(cleanText)
      console.log('parsed array:', arr)
      const result = Array.isArray(arr) ? arr.slice(0, 5) : []
      console.log('final result:', result)
      return result
    } catch (parseError) {
      console.error('json parse error:', parseError, 'on text:', text)
      return []
    }
  } catch (openaiError) {
    console.error('openai error:', openaiError)
    return []
  }
}

export async function makeSentence(word: string, definition: string): Promise<string> {
  const client = openai()
  const prompt = `write one simple english sentence (<= 12 words) that uses the word "${word}" in the specific sense: "${definition}". return only the sentence.`
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'you write short simple sentences, no quotes, no explanations.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
  })
  return (res.choices[0]?.message?.content || '').trim()
}

export async function gradeFreeDefine(userText: string, definition: string): Promise<{ correct: boolean; hint: string }>{
  const client = openai()
  const prompt = `does the user's text match definition at a beginner level? respond as json {"correct": boolean, "hint": string}. definition: "${definition}". user: "${userText}".`
  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'return strict json only.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0,
  })
  const text = res.choices[0]?.message?.content || '{"correct":false,"hint":"try to capture the core meaning."}'
  try {
    const obj = JSON.parse(text)
    return { correct: !!obj.correct, hint: String(obj.hint || '') }
  } catch {
    return { correct: false, hint: 'try to capture the core meaning.' }
  }
}




