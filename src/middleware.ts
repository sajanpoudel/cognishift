import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/trpc/(.*)' // Keep this if you're using tRPC
]);

export default clerkMiddleware((auth, request) => {
  if (!isPublicRoute(request)) {
    // If the user is not signed in and trying to access a protected route,
    // redirect them to the sign-in page
    if (!auth().userId && !isPublicRoute(request)) {
      const signInUrl = new URL('/sign-in', request.url);
      signInUrl.searchParams.set('redirect_url', request.url);
      return Response.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
