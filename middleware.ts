import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isOrganizerRoute = createRouteMatcher([
  "/organizer/dashboard(.*)",
  "/organizer/create(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isOrganizerRoute(req)) {
    const session = await auth();
    if (!session.userId) {
      return session.redirectToSignIn({ returnBackUrl: req.url });
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals (including _next, _not-found, _error) and all static files
    "/((?!_next|_not-found|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
