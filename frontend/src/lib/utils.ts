/**
 * Utility functions for the application
 */

/**
 * Get initials from a name (first letter of each word, max 2 letters)
 * @param name - The full name
 * @returns Uppercase initials (e.g., "John Doe" -> "JD")
 */
export function getInitials(name: string): string {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2); // Max 2 letters
}

/**
 * Get a consistent color class based on the name for avatar backgrounds
 * @param name - The user's name
 * @returns Tailwind CSS color classes
 */
export function getAvatarColorClass(name: string): string {
  const colors = [
    "bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-200",
    "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-200",
    "bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-200",
    "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-200",
    "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200",
    "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-200",
    "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-200",
    "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-200",
  ];

  if (!name) return colors[0]; // Default color for undefined names

  const index = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}
