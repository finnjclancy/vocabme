import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function HomePage() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get('session_id')?.value

  if (sessionId) {
    redirect('/learn')
  } else {
    redirect('/auth/sign-in')
  }
}


