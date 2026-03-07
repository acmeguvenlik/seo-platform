import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./auth";
import { checkRateLimit, type UserPlan, type ToolType } from "./rate-limiter";
import { getCached, setCache, generateCacheKey } from "./redis";
import { logToolUsage } from "./usage-logger";
import { z } from "zod";

export interface ApiHandlerOptions {
  requireAuth?: boolean;
  toolType?: ToolType;
  enableCache?: boolean;
  cacheTTL?: number;
  validationSchema?: z.ZodSchema;
}

export interface ApiContext {
  user: Awaited<ReturnType<typeof getCurrentUser>>;
  userId?: string;
  userPlan: UserPlan;
}

/**
 * Wrapper for API route handlers with common middleware
 */
export function withApiMiddleware<T = any>(
  handler: (
    request: NextRequest,
    context: ApiContext,
    validatedData?: any
  ) => Promise<NextResponse<T>>,
  options: ApiHandlerOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const startTime = Date.now();

    try {
      // 1. Authentication check
      const user = await getCurrentUser();

      if (options.requireAuth && !user) {
        return NextResponse.json(
          { error: "Giriş yapmanız gerekiyor" },
          { status: 401 }
        );
      }

      const userId = user?.id;
      const userPlan = (user?.plan as UserPlan) || "FREE";

      // 2. Rate limiting
      if (options.toolType && userId) {
        const rateLimit = await checkRateLimit(userId, userPlan, options.toolType);

        if (!rateLimit.success) {
          return NextResponse.json(
            {
              error: "Günlük kullanım limitiniz doldu",
              limit: rateLimit.limit,
              remaining: rateLimit.remaining,
              reset: rateLimit.reset,
            },
            { status: 429 }
          );
        }
      }

      // 3. Input validation
      let validatedData: any = undefined;
      if (options.validationSchema) {
        try {
          const body = await request.json();
          validatedData = options.validationSchema.parse(body);
        } catch (error) {
          if (error instanceof z.ZodError) {
            const firstError = error.issues[0];
            return NextResponse.json(
              { error: firstError.message },
              { status: 400 }
            );
          }
          return NextResponse.json(
            { error: "Geçersiz istek verisi" },
            { status: 400 }
          );
        }
      }

      // 4. Cache check (if enabled)
      if (options.enableCache && validatedData) {
        const toolSlug = request.nextUrl.pathname.split("/").pop() || "unknown";
        const cacheKey = generateCacheKey(toolSlug, validatedData);
        const cached = await getCached<T>(cacheKey);

        if (cached) {
          return NextResponse.json({
            ...cached,
            cached: true,
            processingTime: Date.now() - startTime,
          });
        }
      }

      // 5. Execute handler
      const context: ApiContext = { user, userId, userPlan };
      const response = await handler(request, context, validatedData);

      // 6. Cache response (if enabled and successful)
      if (
        options.enableCache &&
        validatedData &&
        response.status === 200
      ) {
        const toolSlug = request.nextUrl.pathname.split("/").pop() || "unknown";
        const cacheKey = generateCacheKey(toolSlug, validatedData);
        const responseData = await response.json();
        await setCache(cacheKey, responseData, options.cacheTTL || 3600);
        return NextResponse.json(responseData);
      }

      // 7. Log usage (if successful)
      if (response.status === 200 && options.toolType) {
        const toolSlug = request.nextUrl.pathname.split("/").pop() || "unknown";
        const responseData = await response.clone().json();

        // Log asynchronously (don't wait)
        logToolUsage({
          userId,
          toolSlug,
          input: validatedData || {},
          result: responseData,
          processingMs: Date.now() - startTime,
        }).catch((error) => {
          console.error("Failed to log usage:", error);
        });
      }

      return response;
    } catch (error: any) {
      console.error("API middleware error:", error);
      return NextResponse.json(
        {
          error: error.message || "Bir hata oluştu",
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Helper to create error responses
 */
export function errorResponse(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Helper to create success responses
 */
export function successResponse<T>(data: T, status: number = 200) {
  return NextResponse.json(data, { status });
}
