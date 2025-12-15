/**
 * Utility functions for handling image URLs
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

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
    if (type === 'avatar') return '/images/user/user-01.jpg';
    if (type === 'course') return '/images/placeholder-course.jpg';
    return '/images/placeholder.jpg';
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
