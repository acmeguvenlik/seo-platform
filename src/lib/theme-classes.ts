/**
 * Comprehensive Theme System
 * Based on UI Design System with light mode as default
 * Teal accent (#00D4B4) as primary brand color
 */

export const theme = {
  // Page Layouts
  page: {
    base: 'min-h-screen bg-bg-base text-text-primary',
    container: 'container mx-auto px-4 py-8',
    section: 'py-12 md:py-16 lg:py-20',
  },

  // Cards
  card: {
    base: 'card-base',
    hover: 'card-base card-hover',
    padding: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    interactive: 'card-base card-hover cursor-pointer',
  },

  // Typography
  text: {
    display: 'text-display text-text-primary',
    title: 'text-title text-text-primary',
    heading: 'text-heading text-text-primary',
    body: 'text-body text-text-primary',
    small: 'text-small text-text-secondary',
    mono: 'text-mono text-text-primary',
    label: 'text-label text-text-secondary',
    
    // Color variants
    primary: 'text-text-primary',
    secondary: 'text-text-secondary',
    muted: 'text-text-muted',
    disabled: 'text-text-disabled',
    accent: 'text-[var(--accent-teal)]',
    success: 'text-[var(--success)]',
    warning: 'text-[var(--warning)]',
    error: 'text-[var(--error)]',
    info: 'text-[var(--info)]',
  },

  // Buttons
  button: {
    base: 'btn-base',
    primary: 'btn-base btn-primary',
    secondary: 'btn-base btn-secondary',
    ghost: 'btn-base btn-ghost',
    danger: 'btn-base btn-danger',
    
    // Sizes
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
    
    // With icon
    withIcon: 'inline-flex items-center gap-2',
  },

  // Form Elements
  input: {
    base: 'input-base w-full',
    error: 'input-base w-full border-[var(--error)]',
    success: 'input-base w-full border-[var(--success)]',
    
    // Variants
    textarea: 'input-base w-full min-h-[120px] font-mono resize-y',
    select: 'input-base w-full cursor-pointer',
    
    // Label
    label: 'text-label text-text-secondary mb-2 block',
    helper: 'text-small text-text-muted mt-1',
    errorText: 'text-small text-[var(--error)] mt-1',
  },

  // Badges
  badge: {
    base: 'badge-base',
    teal: 'badge-base badge-teal',
    success: 'badge-base badge-success',
    warning: 'badge-base badge-warning',
    error: 'badge-base badge-error',
    info: 'badge-base badge-info',
    
    // Plan badges
    free: 'badge-base bg-[var(--bg-muted)] text-text-muted border border-[var(--border-default)]',
    pro: 'badge-base badge-teal',
    enterprise: 'badge-base badge-warning',
  },

  // Alerts
  alert: {
    base: 'p-4 rounded-lg border flex items-start gap-3',
    success: 'p-4 rounded-lg border flex items-start gap-3 bg-[rgba(16,185,129,0.1)] border-[var(--success)] text-[var(--success)]',
    warning: 'p-4 rounded-lg border flex items-start gap-3 bg-[var(--accent-amber-dim)] border-[var(--accent-amber)] text-[var(--accent-amber)]',
    error: 'p-4 rounded-lg border flex items-start gap-3 bg-[rgba(239,68,68,0.1)] border-[var(--error)] text-[var(--error)]',
    info: 'p-4 rounded-lg border flex items-start gap-3 bg-[rgba(59,130,246,0.1)] border-[var(--info)] text-[var(--info)]',
  },

  // Tables
  table: {
    container: 'table-container',
    header: 'table-header',
    headerCell: 'px-6 py-3 text-left text-label text-text-secondary',
    row: 'table-row',
    cell: 'px-6 py-4 text-body',
    
    // Sortable
    sortable: 'cursor-pointer hover:text-text-primary transition-colors',
    sortIcon: 'inline-block ml-1 w-4 h-4',
  },

  // Stats/Metrics
  stat: {
    card: 'card-base p-6',
    label: 'text-small text-text-secondary mb-1',
    value: 'text-3xl font-semibold text-text-primary font-mono',
    change: 'text-small flex items-center gap-1 mt-2',
    changePositive: 'text-[var(--success)]',
    changeNegative: 'text-[var(--error)]',
  },

  // Score Display (SEO-specific)
  score: {
    ring: 'relative inline-flex items-center justify-center',
    number: 'text-4xl font-bold font-mono',
    label: 'text-label text-text-secondary mt-2',
    
    // Score colors
    excellent: 'text-[var(--score-excellent)]',
    good: 'text-[var(--score-good)]',
    average: 'text-[var(--score-average)]',
    poor: 'text-[var(--score-poor)]',
  },

  // Progress Bars
  progress: {
    container: 'h-2 bg-[var(--bg-muted)] rounded-full overflow-hidden',
    bar: 'h-full transition-all duration-500 ease-out',
    barTeal: 'h-full bg-[var(--accent-teal)] transition-all duration-500 ease-out',
    barSuccess: 'h-full bg-[var(--success)] transition-all duration-500 ease-out',
    barWarning: 'h-full bg-[var(--warning)] transition-all duration-500 ease-out',
    barError: 'h-full bg-[var(--error)] transition-all duration-500 ease-out',
  },

  // Loading States
  loading: {
    spinner: 'animate-spin rounded-full border-2 border-[var(--bg-muted)] border-t-[var(--accent-teal)]',
    skeleton: 'shimmer rounded',
    overlay: 'absolute inset-0 bg-[var(--bg-base)] bg-opacity-50 flex items-center justify-center',
  },

  // Navigation
  nav: {
    header: 'h-16 border-b border-[var(--border-default)] bg-[var(--bg-elevated)]',
    sidebar: 'w-60 border-r border-[var(--border-default)] bg-[var(--bg-elevated)]',
    item: 'px-4 py-2 rounded-lg text-body text-text-secondary hover:text-text-primary hover:bg-[var(--bg-subtle)] transition-colors',
    itemActive: 'px-4 py-2 rounded-lg text-body text-text-primary bg-[var(--bg-subtle)] border-l-2 border-[var(--accent-teal)]',
    groupLabel: 'text-label text-text-muted px-4 py-2',
  },

  // Modals
  modal: {
    overlay: 'fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40',
    container: 'fixed inset-0 flex items-center justify-center z-50 p-4',
    content: 'card-base max-w-2xl w-full max-h-[90vh] overflow-y-auto',
    header: 'p-6 border-b border-[var(--border-default)]',
    body: 'p-6',
    footer: 'p-6 border-t border-[var(--border-default)] flex items-center justify-end gap-3',
  },

  // Dropdowns
  dropdown: {
    trigger: 'btn-base btn-secondary',
    menu: 'absolute mt-2 card-base min-w-[200px] py-2 z-50',
    item: 'px-4 py-2 text-body text-text-primary hover:bg-[var(--bg-subtle)] cursor-pointer transition-colors',
    divider: 'my-2 border-t border-[var(--border-default)]',
  },

  // Tooltips
  tooltip: {
    base: 'absolute z-50 px-3 py-2 text-small bg-[var(--bg-overlay)] border border-[var(--border-default)] rounded-lg shadow-lg',
  },

  // Empty States
  empty: {
    container: 'text-center py-12',
    icon: 'w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-muted)] flex items-center justify-center text-text-muted',
    title: 'text-heading text-text-primary mb-2',
    description: 'text-body text-text-secondary mb-4',
  },

  // Tool Cards (SEO-specific)
  tool: {
    card: 'card-base card-hover p-6 group',
    icon: 'w-8 h-8 p-2 rounded-lg bg-[var(--accent-teal-dim)] text-[var(--accent-teal)] mb-4',
    name: 'text-heading text-text-primary mb-2',
    description: 'text-small text-text-secondary mb-4',
    arrow: 'text-[var(--accent-teal)] opacity-0 group-hover:opacity-100 transition-opacity',
  },

  // Animations
  animation: {
    fadeUp: 'fade-up',
    fadeIn: 'animate-[fadeIn_400ms_ease-out]',
    float: 'animate-[float_6s_ease-in-out_infinite]',
    pulseGlow: 'animate-[pulse-glow_2s_ease-in-out_infinite]',
  },

  // Backgrounds
  background: {
    grid: 'grid-pattern',
    glow: 'gradient-glow',
  },

  // Dividers
  divider: {
    horizontal: 'border-t border-[var(--border-default)] my-6',
    vertical: 'border-l border-[var(--border-default)] mx-6',
  },

  // Spacing
  spacing: {
    section: 'space-y-8',
    stack: 'space-y-4',
    inline: 'space-x-4',
  },
} as const;

/**
 * Helper function to combine class names
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Get score color based on value
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return theme.score.excellent;
  if (score >= 60) return theme.score.good;
  if (score >= 40) return theme.score.average;
  return theme.score.poor;
}

/**
 * Get score badge variant based on value
 */
export function getScoreBadge(score: number): string {
  if (score >= 80) return theme.badge.success;
  if (score >= 60) return theme.badge.info;
  if (score >= 40) return theme.badge.warning;
  return theme.badge.error;
}

/**
 * Format percentage for progress bars
 */
export function formatProgress(used: number, limit: number): number {
  if (limit === -1) return 0; // Unlimited
  return Math.min((used / limit) * 100, 100);
}

/**
 * Get progress bar color based on percentage
 */
export function getProgressColor(percentage: number): string {
  if (percentage >= 100) return theme.progress.barError;
  if (percentage >= 80) return theme.progress.barWarning;
  return theme.progress.barTeal;
}
