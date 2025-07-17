/**
 * Theme configuration for the Subscription Tracker application
 * This file centralizes all theme-related constants and utilities
 */

export const themeConfig = {
  // Application name and metadata
  name: "Subscription Tracker",
  description: "Track and manage your subscriptions efficiently",
  
  // Plan types
  plans: {
    BASIC: "basic",
    PRO: "pro",
    TEAM: "team",
  },
  
  // Color palette for charts and visualizations
  chartColors: {
    blue: "var(--chart-1)",
    teal: "var(--chart-2)",
    purple: "var(--chart-3)",
    amber: "var(--chart-4)",
    orange: "var(--chart-5)",
  },
  
  // Default currency symbol and format
  currency: {
    symbol: "$",
    code: "USD",
    position: "before", // 'before' or 'after'
  },
  
  // Date formats
  dateFormats: {
    display: "MMM d, yyyy", // e.g., Jan 1, 2023
    input: "yyyy-MM-dd",    // e.g., 2023-01-01
    api: "yyyy-MM-dd",      // Format used for API requests/responses
  },
  
  // Animation durations
  animation: {
    fast: "0.2s",
    normal: "0.3s",
    slow: "0.5s",
  },
  
  // Breakpoints (matching Tailwind defaults)
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
  
  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};

/**
 * Format a number as currency based on the theme configuration
 */
export function formatCurrency(amount: number, options?: { 
  currency?: string, 
  maximumFractionDigits?: number,
  minimumFractionDigits?: number
}): string {
  const { currency = themeConfig.currency.code, maximumFractionDigits = 2, minimumFractionDigits = 2 } = options || {};
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(amount);
}

/**
 * Get chart color by index (cycles through available colors)
 */
export function getChartColorByIndex(index: number): string {
  const colors = Object.values(themeConfig.chartColors);
  return colors[index % colors.length];
}

/**
 * Check if the current color mode is dark
 */
export function isDarkMode(): boolean {
  if (typeof window === 'undefined') return false;
  return document.documentElement.classList.contains('dark');
}

export default themeConfig;