import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "./redis";

// Plan-based rate limits
export const RATE_LIMITS = {
  FREE: {
    tools: 10, // per day
    ai: 3, // per day
  },
  PRO: {
    tools: 500,
    ai: 100,
  },
  ENTERPRISE: {
    tools: -1, // unlimited
    ai: -1,
  },
} as const;

// Create rate limiters for different plans
export const rateLimiters = {
  free: {
    tools: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 d"),
      analytics: true,
      prefix: "ratelimit:free:tools",
    }),
    ai: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 d"),
      analytics: true,
      prefix: "ratelimit:free:ai",
    }),
  },
  pro: {
    tools: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(500, "1 d"),
      analytics: true,
      prefix: "ratelimit:pro:tools",
    }),
    ai: new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "1 d"),
      analytics: true,
      prefix: "ratelimit:pro:ai",
    }),
  },
};

export type UserPlan = "FREE" | "PRO" | "ENTERPRISE";
export type ToolType = "tools" | "ai";

export async function checkRateLimit(
  userId: string,
  plan: UserPlan,
  toolType: ToolType
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}> {
  // Enterprise has unlimited access
  if (plan === "ENTERPRISE") {
    return {
      success: true,
      limit: -1,
      remaining: -1,
      reset: 0,
    };
  }

  const limiter =
    plan === "PRO"
      ? rateLimiters.pro[toolType]
      : rateLimiters.free[toolType];

  const result = await limiter.limit(userId);

  return {
    success: result.success,
    limit: result.limit,
    remaining: result.remaining,
    reset: result.reset,
  };
}

// Get current usage for a user
export async function getUserUsage(
  userId: string,
  plan: UserPlan
): Promise<{
  tools: { used: number; limit: number };
  ai: { used: number; limit: number };
}> {
  if (plan === "ENTERPRISE") {
    return {
      tools: { used: 0, limit: -1 },
      ai: { used: 0, limit: -1 },
    };
  }

  const toolsKey = `ratelimit:${plan.toLowerCase()}:tools:${userId}`;
  const aiKey = `ratelimit:${plan.toLowerCase()}:ai:${userId}`;

  const [toolsUsed, aiUsed] = await Promise.all([
    redis.get<number>(toolsKey),
    redis.get<number>(aiKey),
  ]);

  const limits = RATE_LIMITS[plan];

  return {
    tools: {
      used: toolsUsed || 0,
      limit: limits.tools,
    },
    ai: {
      used: aiUsed || 0,
      limit: limits.ai,
    },
  };
}
