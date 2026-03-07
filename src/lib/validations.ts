import { z } from "zod";

// URL validation
export const urlSchema = z.string().url("Geçerli bir URL girin");

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Email validation
export const emailSchema = z.string().email("Geçerli bir e-posta adresi girin");

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Contact form validation
export const contactFormSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: emailSchema,
  subject: z.string().min(5, "Konu en az 5 karakter olmalı"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalı"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Meta analyzer validation
export const metaAnalyzerSchema = z.object({
  url: urlSchema,
});

// Keyword density validation
export const keywordDensitySchema = z.object({
  url: urlSchema,
});

// AI meta generator validation
export const aiMetaGeneratorSchema = z.object({
  url: urlSchema,
  currentTitle: z.string().optional(),
  currentDescription: z.string().optional(),
  content: z.string().optional(),
});

// Password validation
export const passwordSchema = z
  .string()
  .min(8, "Şifre en az 8 karakter olmalı")
  .regex(/[A-Z]/, "Şifre en az bir büyük harf içermeli")
  .regex(/[a-z]/, "Şifre en az bir küçük harf içermeli")
  .regex(/[0-9]/, "Şifre en az bir rakam içermeli");

// Sanitize HTML
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "");
}

// Validate and sanitize URL
export function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (!["http:", "https:"].includes(urlObj.protocol)) {
      throw new Error("Invalid protocol");
    }
    return urlObj.toString();
  } catch {
    throw new Error("Invalid URL");
  }
}
