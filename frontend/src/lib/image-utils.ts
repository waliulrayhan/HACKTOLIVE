/**
 * Utility functions for handling image URLs
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const FALLBACK_IMAGE_URLS = {
  general: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1600&auto=format&fit=crop',
  course: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1600&auto=format&fit=crop',
  avatar: 'https://ui-avatars.com/api/?name=User&background=e2e8f0&color=64748b&size=128&rounded=true',
} as const;

export function getFallbackImageUrl(
  type: 'course' | 'avatar' | 'general' = 'general'
): string {
  return FALLBACK_IMAGE_URLS[type];
}

/**
 * Transform image URL from backend to full URL
 * Handles relative paths from uploads directory and ensures they point to the backend server
 */
export function getFullImageUrl(
  url: string | null | undefined,
  type: 'course' | 'avatar' | 'general' = 'general'
): string {
  // Return default image if URL is empty
  if (!url || url.trim() === '') {
    return getFallbackImageUrl(type);
  }

  // If it's already a full URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it starts with /uploads/, prepend the API URL
  if (url.startsWith('/uploads/')) {
    return `${API_URL}${url}`;
  }

  // For local static files (in public folder), return as-is
  if (url.startsWith('/images/') || url.startsWith('/static/')) {
    return url;
  }

  // Default: assume it's an upload path
  return `${API_URL}${url}`;
}

/**
 * Transform an object's image fields to full URLs
 */
export function transformImageFields<T extends Record<string, any>>(
  obj: T,
  imageFields: string[] = ['thumbnail', 'avatar', 'image']
): T {
  const transformed = { ...obj } as any;

  imageFields.forEach((field) => {
    if (field in transformed) {
      const fieldType = field === 'avatar' ? 'avatar' : field === 'thumbnail' ? 'course' : 'general';
      transformed[field] = getFullImageUrl(transformed[field], fieldType);
    }
  });

  return transformed as T;
}
