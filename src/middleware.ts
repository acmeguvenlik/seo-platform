import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Simple i18n middleware without Clerk
export default createMiddleware(routing);

export const config = {
  matcher: [
    // Skip API routes, Next.js internals and static files
    "/((?!api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
