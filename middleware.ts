import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  // Custom logic if needed
  return NextResponse.next();
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (API routes for auth)
     * - login (login page)
     * - cadastro (signup page)
     * - pricing (pricing page)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/auth|login|cadastro|pricing|_next/static|_next/image|favicon.ico).*)",
  ],
};
