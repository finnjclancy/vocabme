import OpenAI from 'openai'

export function openai() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
}

export async function suggestDefinitions(word: string): Promise<string[]> {
  const client = openai()
  const prompt = `give 3 concise learner-friendly definitions for the english word "${word}" in 12 words or fewer each. no examples. simple language. return as a json array of strings.`

  const res = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'you write very short learner-friendly definitions.' },
      { role: 'user', content: prompt },
    ],
    temperature: 0.2,
  })
  const text = res.choices[0]?.message?.content || '[]'
  try {
    const arr = JSON.parse(text)
    return Array.isArray(arr) ? arr.slice(0, 5) : []
  } catch {
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




