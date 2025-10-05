export { default } from "next-auth/middleware"

export const config = {
  // Match all routes except for the login page and the API routes
  matcher: [
    "/((?!api/auth|login).*)",
  ],
};