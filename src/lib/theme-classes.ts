/**
 * Theme utility classes for consistent styling across the application
 * Based on white/dark theme design system
 */

export const themeClasses = {
  // Page layouts
  page: {
    container: 'min-h-screen bg-white dark:bg-gray-900',
    section: 'container mx-auto px-4 py-8',
  },

  // Cards
  card: {
    base: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
    hover: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow',
    padding: 'p-6',
  },

  // Typography
  text: {
    primary: 'text-gray-900 dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-400',
    muted: 'text-gray-500 dark:text-gray-500',
    heading: 'text-3xl font-bold text-gray-900 dark:text-white',
    subheading: 'text-xl font-semibold text-gray-900 dark:text-white',
    label: 'block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300',
  },

  // Form elements
  input: {
    base: 'w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors',
    textarea: 'w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors',
    select: 'w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors',
  },

  // Buttons
  button: {
    primary: 'px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors',
    secondary: 'px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors',
    danger: 'px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors',
    success: 'px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors',
  },

  // Links
  link: {
    primary: 'text-blue-600 dark:text-blue-400 hover:underline',
    secondary: 'text-gray-600 dark:text-gray-400 hover:underline',
    success: 'text-green-600 dark:text-green-400 hover:underline',
    danger: 'text-red-600 dark:text-red-400 hover:underline',
  },

  // Tables
  table: {
    container: 'bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden',
    header: 'bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600',
    headerCell: 'px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase',
    row: 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
    cell: 'px-6 py-4',
    divider: 'divide-y divide-gray-200 dark:divide-gray-700',
  },

  // Stats/Metrics
  stat: {
    card: 'bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700',
    label: 'text-sm text-gray-600 dark:text-gray-400',
    value: 'text-2xl font-bold text-gray-900 dark:text-white',
  },

  // Badges
  badge: {
    base: 'px-3 py-1 rounded-full text-sm font-medium',
    primary: 'px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    success: 'px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    warning: 'px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    danger: 'px-3 py-1 rounded-full text-sm font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  },

  // Alerts
  alert: {
    info: 'p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300',
    success: 'p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300',
    warning: 'p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300',
    danger: 'p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300',
  },

  // Loading states
  loading: {
    spinner: 'animate-spin rounded-full border-b-2 border-blue-600',
    skeleton: 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded',
  },
} as const;

// Helper function to combine classes
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
