import { db } from "./db";
import crypto from "crypto";

export interface LogUsageParams {
  userId?: string;
  toolSlug: string;
  input: Record<string, any>;
  result: any;
  processingMs: number;
}

/**
 * Log tool usage to database for analytics and rate limiting
 */
export async function logToolUsage({
  userId,
  toolSlug,
  input,
  result,
  processingMs,
}: LogUsageParams): Promise<void> {
  try {
    // Generate hash of input for deduplication
    const inputHash = generateInputHash(input);

    await db.toolUsage.create({
      data: {
        userId: userId || null,
        toolSlug,
        inputHash,
        result,
        processingMs,
      },
    });
  } catch (error) {
    // Don't fail the request if logging fails
    console.error("Failed to log tool usage:", error);
  }
}

/**
 * Generate a hash of the input for deduplication
 */
function generateInputHash(input: Record<string, any>): string {
  // Sort keys for consistent hashing
  const sortedInput = Object.keys(input)
    .sort()
    .reduce((acc, key) => {
      acc[key] = input[key];
      return acc;
    }, {} as Record<string, any>);

  const inputString = JSON.stringify(sortedInput);
  return crypto.createHash("sha256").update(inputString).digest("hex");
}

/**
 * Get usage statistics for a user
 */
export async function getUserUsageStats(userId: string) {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [todayUsage, totalUsage, toolBreakdown] = await Promise.all([
    // Today's usage
    db.toolUsage.count({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
        },
      },
    }),

    // Total usage
    db.toolUsage.count({
      where: {
        userId,
      },
    }),

    // Usage by tool
    db.toolUsage.groupBy({
      by: ["toolSlug"],
      where: {
        userId,
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 10,
    }),
  ]);

  return {
    todayUsage,
    totalUsage,
    toolBreakdown: toolBreakdown.map((item) => ({
      toolSlug: item.toolSlug,
      count: item._count.id,
    })),
  };
}

/**
 * Get recent tool usage history for a user
 */
export async function getUserHistory(
  userId: string,
  limit: number = 20,
  offset: number = 0
) {
  const history = await db.toolUsage.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    skip: offset,
    select: {
      id: true,
      toolSlug: true,
      result: true,
      processingMs: true,
      createdAt: true,
    },
  });

  const total = await db.toolUsage.count({
    where: {
      userId,
    },
  });

  return {
    history,
    total,
    hasMore: offset + limit < total,
  };
}

/**
 * Delete old usage records (for GDPR compliance)
 * Call this from a cron job
 */
export async function cleanupOldUsage(daysToKeep: number = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const result = await db.toolUsage.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDate,
      },
      userId: null, // Only delete anonymous usage
    },
  });

  return result.count;
}
