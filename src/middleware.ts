import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Only protect dashboard routes, not tools
const isProtectedRoute = createRouteMatcher([
  "/:locale/dashboard(.*)",
  "/:locale/analyses(.*)",
  "/:locale/analytics(.*)",
  "/:locale/billing(.*)",
  "/:locale/settings(.*)",
]);

export default clerkMiddleware(
  async (auth, req: NextRequest) => {
    // Check if route requires authentication
    if (isProtectedRoute(req)) {
      await auth.protect();
    }

    // Apply i18n middleware
    return intlMiddleware(req);
  },
  {
    // Make Clerk optional - don't fail if keys are missing
    debug: false,
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
