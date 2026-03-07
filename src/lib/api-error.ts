export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown): {
  message: string;
  statusCode: number;
  code?: string;
} {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      statusCode: 500,
    };
  }

  return {
    message: "Bilinmeyen bir hata oluştu",
    statusCode: 500,
  };
}

export function createApiError(
  statusCode: number,
  message: string,
  code?: string
): ApiError {
  return new ApiError(statusCode, message, code);
}

// Common API errors
export const ApiErrors = {
  Unauthorized: () => createApiError(401, "Giriş yapmanız gerekiyor", "UNAUTHORIZED"),
  Forbidden: () => createApiError(403, "Bu işlem için yetkiniz yok", "FORBIDDEN"),
  NotFound: (resource: string = "Kaynak") =>
    createApiError(404, `${resource} bulunamadı`, "NOT_FOUND"),
  BadRequest: (message: string = "Geçersiz istek") =>
    createApiError(400, message, "BAD_REQUEST"),
  RateLimitExceeded: () =>
    createApiError(429, "Çok fazla istek gönderdiniz. Lütfen bekleyin.", "RATE_LIMIT"),
  InternalError: () =>
    createApiError(500, "Sunucu hatası oluştu", "INTERNAL_ERROR"),
};
