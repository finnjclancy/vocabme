console.log('=== MIDDLEWARE FILE LOADED ===')

import { NextResponse } from 'next/server'

export async function middleware(request) {
  console.log('=== MIDDLEWARE RUNNING ===')
  console.log('url:', request.url)
  console.log('pathname:', request.nextUrl.pathname)
  
  // always redirect to sign-in for testing
  return NextResponse.redirect(new URL('/auth/sign-in', request.url))
}

export const config = {
  matcher: [
    /*
     * match all request paths except for the ones starting with:
     * - api (api routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}


