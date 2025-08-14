export type Word = {
  id: string
  user_id: string
  word_text: string
  definition: string
  touches: number
  is_learned: boolean
  created_at: string
}

export type Profile = {
  id: string
  x_id: string | null
  name: string | null
  timezone: string | null
  streak: number
  xp: number
  last_active: string | null
  allow_new_words_from_dictionary: boolean
}




