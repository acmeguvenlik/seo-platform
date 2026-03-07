import { z } from "zod";

// Common validation schemas
export const urlSchema = z
  .string()
  .url({ message: "Geçerli bir URL giriniz" })
  .refine(
    (url) => {
      try {
        const parsed = new URL(url);
        return ["http:", "https:"].includes(parsed.protocol);
      } catch {
        return false;
      }
    },
    { message: "URL http:// veya https:// ile başlamalıdır" }
  );

export const emailSchema = z
  .string()
  .email({ message: "Geçerli bir e-posta adresi giriniz" });

// Tool validation schemas
export const metaAnalyzerSchema = z.object({
  url: urlSchema,
});

export const keywordDensitySchema = z.object({
  url: urlSchema.optional(),
  content: z.string().min(50, "İçerik en az 50 karakter olmalıdır").optional(),
}).refine(
  (data) => data.url || data.content,
  { message: "URL veya içerik gereklidir" }
);

export const sitemapGeneratorSchema = z.object({
  url: urlSchema,
  maxPages: z.number().min(1).max(1000).default(100),
  includeImages: z.boolean().default(true),
});

export const backlinkAnalyzerSchema = z.object({
  url: urlSchema,
});

export const pageSpeedSchema = z.object({
  url: urlSchema,
  strategy: z.enum(["mobile", "desktop"]).default("mobile"),
});

export const imageOptimizerSchema = z.object({
  url: urlSchema,
});

export const robotsValidatorSchema = z.object({
  url: urlSchema.optional(),
  content: z.string().min(1, "Robots.txt içeriği gereklidir").optional(),
}).refine(
  (data) => data.url || data.content,
  { message: "URL veya içerik gereklidir" }
);

export const schemaGeneratorSchema = z.object({
  type: z.enum([
    "Article",
    "Product",
    "LocalBusiness",
    "Organization",
    "Person",
    "Event",
    "Recipe",
    "FAQ",
  ]),
  data: z.record(z.string(), z.any()),
});

export const headingAnalyzerSchema = z.object({
  url: urlSchema.optional(),
  content: z.string().min(50).optional(),
}).refine(
  (data) => data.url || data.content,
  { message: "URL veya içerik gereklidir" }
);

export const internalLinksSchema = z.object({
  url: urlSchema,
  maxDepth: z.number().min(1).max(5).default(3),
});

// AI tool validation schemas
export const aiMetaGeneratorSchema = z.object({
  url: urlSchema,
  currentTitle: z.string().optional(),
  currentDescription: z.string().optional(),
  content: z.string().optional(),
  targetKeywords: z.array(z.string()).optional(),
  language: z.enum(["en", "tr", "de", "es", "fr"]).default("en"),
});

export const aiContentOptimizerSchema = z.object({
  content: z.string().min(100, "İçerik en az 100 karakter olmalıdır"),
  targetKeyword: z.string().min(2, "Hedef anahtar kelime gereklidir"),
  competitorUrls: z.array(urlSchema).max(3).optional(),
  language: z.enum(["en", "tr", "de", "es", "fr"]).default("en"),
});

// Helper function to validate request body
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const body = await request.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return {
        success: false,
        error: firstError.message,
      };
    }
    return {
      success: false,
      error: "Geçersiz istek verisi",
    };
  }
}
