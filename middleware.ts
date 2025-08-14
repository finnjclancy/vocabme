import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const protectedRoots = ['/learn', '/add', '/review', '/chat', '/friends', '/profile']

export function middleware(req: NextRequest) {
  // temporarily disabled for debugging
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/learn', '/add', '/review', '/chat', '/friends', '/profile'],
}


