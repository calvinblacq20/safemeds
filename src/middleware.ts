import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isPublicRoute } from '@/lib/publicRoutes'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  
  // Get the session token from cookies
  const sessionToken = request.cookies.get('authjs.session-token')?.value ||
                      request.cookies.get('__Secure-authjs.session-token')?.value
 
  // If no session token, redirect to auth
  if (!sessionToken) {
    const authUrl = new URL('/auth', request.url)
    return NextResponse.redirect(authUrl)
  }
 
  // If we have a token, allow the request to continue
  // The actual token validation happens in the NextAuth API routes
  return NextResponse.next()
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - any other path with a file extension (public/ static assets —
     *   images, fonts, 3D models, etc. — none of which need an auth check)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
}