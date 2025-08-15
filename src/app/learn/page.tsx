import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export default async function LearnPage() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get('session_id')?.value

  if (!sessionId) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">learn</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">your learning path</h2>
          <p className="text-gray-600">lesson content will go here</p>
        </div>
      </div>
    </div>
  )
}




