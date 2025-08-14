import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_PROJECT_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const anon = process.env.SUPABASE_ANON_PUBLIC_API_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabaseBrowser = createClient(url, anon)




