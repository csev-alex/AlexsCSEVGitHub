import { MeteringType } from '../types';

/**
 * Tier Calculation Logic for EV Phase-In Rate
 *
 * Load Factor = Total kWh / (kW × Hours in period)
 *
 * For separately metered EV: kW = Nameplate capacity
 * For combined metered: kW = Max Demand from billing
 *
 * Tier Assignment:
 *   ≤10%  → Tier 1
 *   >10% and ≤15% → Tier 2
 *   >15% and ≤20% → Tier 3
 *   >20% and ≤25% → Tier 4
 *   >25% → Standard rate (Tier 0 - not eligible for EV PIR)
 */

// Hours in a standard year (8,760 hours)
export const HOURS_IN_YEAR = 8760;

// Hours in each month (average)
export const HOURS_IN_MONTH = 730;

// Summer months (June - September)
export const SUMMER_MONTHS = 4;

// Winter months (October - May)
export const WINTER_MONTHS = 8;

/**
 * Calculate load factor based on metering type
 */
export function calculateLoadFactor(
  totalKwh: number,
  capacityKw: number,
  hoursInPeriod: number = HOURS_IN_YEAR
): number {
  if (capacityKw <= 0 || hoursInPeriod <= 0) {
    return 0;
  }

  const maxPossibleKwh = capacityKw * hoursInPeriod;
  return totalKwh / maxPossibleKwh;
}

/**
 * Get the capacity to use for load factor calculation
 * For separate metering: use nameplate capacity
 * For combined metering: use max demand from the last 12 months
 */
export function getCapacityForLoadFactor(
  meteringType: MeteringType,
  nameplateKw: number,
  maxDemandKw?: number
): number {
  if (meteringType === 'separate') {
    return nameplateKw;
  }
  return maxDemandKw ?? nameplateKw;
}

/**
 * Determine tier based on load factor
 * Returns 0 for standard rate (>25%), or 1-4 for EV PIR tiers
 */
export function determineTier(loadFactor: number): number {
  const loadFactorPercent = loadFactor * 100;

  if (loadFactorPercent <= 10) {
    return 1;
  } else if (loadFactorPercent <= 15) {
    return 2;
  } else if (loadFactorPercent <= 20) {
    return 3;
  } else if (loadFactorPercent <= 25) {
    return 4;
  } else {
    return 0; // Standard rate - not eligible for EV PIR discount
  }
}

/**
 * Get tier description
 */
export function getTierDescription(tier: number): string {
  switch (tier) {
    case 1:
      return 'Tier 1 (≤10% load factor) - Maximum discount';
    case 2:
      return 'Tier 2 (10-15% load factor)';
    case 3:
      return 'Tier 3 (15-20% load factor)';
    case 4:
      return 'Tier 4 (20-25% load factor) - Minimum discount';
    case 0:
      return 'Standard Rate (>25% load factor) - Not eligible for EV PIR';
    default:
      return 'Unknown tier';
  }
}

/**
 * Get load factor range for a tier
 */
export function getTierLoadFactorRange(tier: number): { min: number; max: number } {
  switch (tier) {
    case 1:
      return { min: 0, max: 0.1 };
    case 2:
      return { min: 0.1, max: 0.15 };
    case 3:
      return { min: 0.15, max: 0.2 };
    case 4:
      return { min: 0.2, max: 0.25 };
    default:
      return { min: 0.25, max: 1 };
  }
}

/**
 * Calculate the maximum kWh usage allowed to maintain a specific tier
 */
export function getMaxKwhForTier(tier: number, capacityKw: number): number {
  const range = getTierLoadFactorRange(tier);
  return capacityKw * HOURS_IN_YEAR * range.max;
}

/**
 * Calculate the minimum kWh needed for a specific tier
 */
export function getMinKwhForTier(tier: number, capacityKw: number): number {
  const range = getTierLoadFactorRange(tier);
  return capacityKw * HOURS_IN_YEAR * range.min;
}
