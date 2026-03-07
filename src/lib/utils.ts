import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number, locale: string = "en"): string {
  return new Intl.NumberFormat(locale).format(num);
}

export function formatDate(
  date: Date | string,
  locale: string = "en",
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
}

export function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url;
  
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const path = urlObj.pathname + urlObj.search;
    
    if (domain.length + 3 >= maxLength) {
      return domain.substring(0, maxLength - 3) + "...";
    }
    
    const remainingLength = maxLength - domain.length - 3;
    if (path.length > remainingLength) {
      return domain + path.substring(0, remainingLength) + "...";
    }
    
    return domain + path;
  } catch {
    return url.substring(0, maxLength - 3) + "...";
  }
}

export function generateHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
