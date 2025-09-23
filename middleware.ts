import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /admin, /login)
  const path = request.nextUrl.pathname

  // Check if the path starts with /admin
  if (path.startsWith("/admin")) {
    // Get auth data from cookies or headers if available
    // For now, we'll let the client-side handle the auth check
    // In a real app, you'd verify the JWT token here

    // Allow the request to continue to the admin page
    // The AdminGuard component will handle the actual auth check
    return NextResponse.next()
  }

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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
