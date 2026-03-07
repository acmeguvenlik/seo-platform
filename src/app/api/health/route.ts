import { NextResponse } from "next/server";

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: "1.0.0",
    services: {
      database: await checkDatabase(),
      redis: await checkRedis(),
      ai: await checkAI(),
    },
  };

  const allHealthy = Object.values(health.services).every(
    (service) => service.status === "healthy"
  );

  return NextResponse.json(health, {
    status: allHealthy ? 200 : 503,
  });
}

async function checkDatabase() {
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      return { status: "not_configured", message: "DATABASE_URL not set" };
    }
    return { status: "healthy" };
  } catch (error) {
    return { status: "unhealthy", error: (error as Error).message };
  }
}

async function checkRedis() {
  try {
    // Check if Redis is configured
    if (!process.env.UPSTASH_REDIS_REST_URL) {
      return { status: "not_configured", message: "Redis not configured" };
    }
    return { status: "healthy" };
  } catch (error) {
    return { status: "unhealthy", error: (error as Error).message };
  }
}

async function checkAI() {
  try {
    // Check if Anthropic is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      return { status: "not_configured", message: "AI not configured" };
    }
    return { status: "healthy" };
  } catch (error) {
    return { status: "unhealthy", error: (error as Error).message };
  }
}
