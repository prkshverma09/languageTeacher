export { default } from "next-auth/middleware"

export const config = {
  // Match all routes except for the login page and all API routes
  matcher: [
    "/((?!api|login|_next/static|_next/image|favicon.ico).*)",
  ],
};
