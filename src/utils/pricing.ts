/**
 * Centralized pricing configuration
 *
 * Single source of truth for all pricing across the application.
 * Update these values to automatically reflect changes in:
 * - Pricing page
 * - ROI calculator
 * - Any other components that reference pricing
 */

export const PRICING = {
  /**
   * Current monthly service price
   */
  current: 5000,

  /**
   * Future monthly price (after rate increase)
   */
  future: 7500,

  /**
   * Date when pricing changes
   */
  rateIncreaseDate: 'June 30, 2026',

  /**
   * Special priority spot pricing (limited time offer)
   */
  prioritySpot: 6500,
} as const;

/**
 * Helper function to format price as currency string
 */
export function formatPrice(price: number): string {
  return `$${price.toLocaleString()}`;
}

/**
 * Get the monthly cost for ROI calculations
 * Uses the current pricing by default
 */
export function getMonthlyServiceCost(): number {
  return PRICING.current;
}
