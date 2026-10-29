import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getTierFromHost } from "@/lib/domains";

// Routes that require Clerk authentication on organizer portal
const isOrganizerAuthRequired = createRouteMatcher([
  "/organizer/dashboard(.*)",
  "/organizer/create(.*)",
  "/dashboard(.*)",
  "/create(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";
  const tier = getTierFromHost(hostname);
  const pathname = url.pathname;

  // Always pass API and internal routes through without subdomain rewriting
  if (pathname.startsWith("/api") || pathname.startsWith("/trpc")) {
    return NextResponse.next();
  }

  // =========================================================================
  // 1. ORGANIZER TIER (e.g. org.lvh.me:3000, org.getmyshow.in, getmyshow-org.vercel.app)
  // =========================================================================
  if (tier === "org") {
    // Check Clerk Authentication for protected organizer areas
    if (isOrganizerAuthRequired(req)) {
      const session = await auth();
      if (!session.userId) {
        return session.redirectToSignIn({ returnBackUrl: req.url });
      }
    }

    // Rewrite clean subdomain paths to internal App Router /organizer routes:
    //  - org.domain.com/              -> /organizer
    //  - org.domain.com/create        -> /organizer/create
    //  - org.domain.com/dashboard/123 -> /organizer/dashboard/123
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/organizer", req.url));
    }
    if (pathname === "/create" || pathname.startsWith("/create/")) {
      return NextResponse.rewrite(new URL(`/organizer${pathname}`, req.url));
    }
    if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
      return NextResponse.rewrite(new URL(`/organizer${pathname}`, req.url));
    }

    return NextResponse.next();
  }

  // =========================================================================
  // 2. GATE SCANNER TIER (e.g. scan.lvh.me:3000, scan.getmyshow.in, getmyshow-scan.vercel.app)
  // =========================================================================
  if (tier === "scan") {
    // Rewrite clean scanner paths:
    //  - scan.domain.com/          -> /scan/login
    //  - scan.domain.com/login     -> /scan/login
    //  - scan.domain.com/:eventId  -> /scan/:eventId
    if (pathname === "/" || pathname === "/login") {
      return NextResponse.rewrite(new URL("/scan/login", req.url));
    }
    // If not already starting with /scan or /staff, rewrite to /scan/:eventId
    if (!pathname.startsWith("/scan") && !pathname.startsWith("/staff")) {
      return NextResponse.rewrite(new URL(`/scan${pathname}`, req.url));
    }

    return NextResponse.next();
  }

  // =========================================================================
  // 3. PUBLIC ATTENDEE TIER (e.g. localhost:3000, getmyshow-nine.vercel.app, getmyshow.in)
  // =========================================================================
  // Maintain backward-compatible Clerk protection on public domain if accessed directly
  if (isOrganizerAuthRequired(req)) {
    const session = await auth();
    if (!session.userId) {
      return session.redirectToSignIn({ returnBackUrl: req.url });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals (including _next, _not-found, _error) and all static files
    "/((?!_next|_not-found|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
