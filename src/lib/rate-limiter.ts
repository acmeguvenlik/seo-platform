import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// Free tier: 10 requests per hour
export const freeTierLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  analytics: true,
  prefix: "@ratelimit/free",
});

// Pro tier: 100 requests per hour
export const proTierLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 h"),
  analytics: true,
  prefix: "@ratelimit/pro",
});

// Enterprise tier: 1000 requests per hour
export const enterpriseTierLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1000, "1 h"),
  analytics: true,
  prefix: "@ratelimit/enterprise",
});

// Anonymous users: 3 requests per hour
export const anonymousLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  analytics: true,
  prefix: "@ratelimit/anonymous",
});

export function getRateLimiter(plan: "FREE" | "PRO" | "ENTERPRISE" | null) {
  if (!plan) return anonymousLimiter;
  
  switch (plan) {
    case "FREE":
      return freeTierLimiter;
    case "PRO":
      return proTierLimiter;
    case "ENTERPRISE":
      return enterpriseTierLimiter;
    default:
      return anonymousLimiter;
  }
}
