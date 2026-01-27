import {
  Project,
  ChargerEntry,
  CalculationResult,
  MonthlyCalculation,
  SeasonalSummary,
  YearlySummary,
  TierRates,
  RevenueCalculation,
  DEFAULT_REVENUE_SETTINGS,
} from '../types';
import { getRateTable } from '../data/rates/nationalGrid';
import {
  determineTier,
  HOURS_IN_YEAR,
  SUMMER_MONTHS,
  WINTER_MONTHS,
} from './tierCalculation';

/**
 * Calculate total nameplate kW from EVSE inventory
 * Accounts for individual circuits (multiplies by numberOfPlugs if enabled)
 */
export function calculateNameplateKw(chargers: ChargerEntry[]): number {
  return chargers.reduce((total, charger) => {
    let chargerKw = charger.kwPerCharger * charger.quantity;
    // If individual circuits enabled and multi-plug charger, multiply by number of plugs
    if (charger.individualCircuits && charger.numberOfPlugs > 1) {
      chargerKw *= charger.numberOfPlugs;
    }
    return total + chargerKw;
  }, 0);
}

/**
 * Calculate total number of ports (plugs) across all EVSE units
 */
export function calculateTotalPorts(chargers: ChargerEntry[]): number {
  return chargers.reduce((total, charger) => {
    const plugsPerUnit = charger.numberOfPlugs ?? 1;
    return total + (plugsPerUnit * charger.quantity);
  }, 0);
}

/**
 * Calculate total number of EVSE units
 */
export function calculateTotalUnits(chargers: ChargerEntry[]): number {
  return chargers.reduce((total, charger) => total + charger.quantity, 0);
}

/**
 * Calculate effective kW (considering load management limit if applicable)
 */
export function calculateEffectiveKw(
  nameplateKw: number,
  loadManagementLimit?: number
): number {
  if (loadManagementLimit && loadManagementLimit > 0 && loadManagementLimit < nameplateKw) {
    return loadManagementLimit;
  }
  return nameplateKw;
}

/**
 * Calculate average kW per port based on charger inventory
 */
export function calculateAvgKwPerPort(chargers: ChargerEntry[]): number {
  const totalPorts = calculateTotalPorts(chargers);
  if (totalPorts === 0) return 0;
  const totalKw = calculateNameplateKw(chargers);
  return totalKw / totalPorts;
}

/**
 * Calculate estimated monthly kWh from usage inputs
 * Monthly kWh = Total Daily Charging Hours × Avg kW per Port × Days per Month
 *
 * Total Daily Charging Hours = Avg Daily Ports Used × Avg Hours Per Port Per Day
 * (This is already calculated before being passed in)
 */
export function calculateEstimatedMonthlyKwh(
  chargers: ChargerEntry[],
  totalDailyChargingHours: number,
  daysInMonth: number
): number {
  const avgKwPerPort = calculateAvgKwPerPort(chargers);
  if (avgKwPerPort === 0) return 0;

  const dailyKwh = totalDailyChargingHours * avgKwPerPort;
  return dailyKwh * daysInMonth;
}

/**
 * Calculate estimated annual kWh
 * Annual kWh = Total Daily Charging Hours × Avg kW per Port × 365
 */
export function calculateEstimatedAnnualKwh(
  chargers: ChargerEntry[],
  totalDailyChargingHours: number
): number {
  const avgKwPerPort = calculateAvgKwPerPort(chargers);
  if (avgKwPerPort === 0) return 0;

  const dailyKwh = totalDailyChargingHours * avgKwPerPort;
  return dailyKwh * 365; // Annual estimate
}

/**
 * Calculate load factor from usage inputs
 * Load Factor = Estimated Annual kWh / (Nameplate kW × 8760 hours)
 *
 * Simplified: Load Factor = Total Daily Charging Hours / (Total Ports × 24)
 */
export function calculateLoadFactorFromUsage(
  chargers: ChargerEntry[],
  totalDailyChargingHours: number,
  loadManagementLimit?: number
): number {
  const nameplateKw = calculateNameplateKw(chargers);
  const effectiveKw = calculateEffectiveKw(nameplateKw, loadManagementLimit);

  if (effectiveKw === 0) return 0;

  const annualKwh = calculateEstimatedAnnualKwh(chargers, totalDailyChargingHours);
  const maxPossibleKwh = effectiveKw * HOURS_IN_YEAR;

  return annualKwh / maxPossibleKwh;
}

/**
 * Calculate total daily charging hours from TOU period hours
 * For summer: onPeak + offPeak + superPeak
 * For winter: onPeak + offPeak
 * Returns an average across seasons weighted by months (4 summer, 8 winter)
 */
export function calculateTotalDailyChargingHours(
  summerOnPeak: number,
  summerOffPeak: number,
  summerSuperPeak: number,
  winterOnPeak: number,
  winterOffPeak: number
): number {
  const summerTotal = summerOnPeak + summerOffPeak + summerSuperPeak;
  const winterTotal = winterOnPeak + winterOffPeak;
  // Weight by number of months in each season (4 summer, 8 winter)
  return (summerTotal * 4 + winterTotal * 8) / 12;
}

/**
 * Calculate peak demand kW based on peak ports used
 */
export function calculatePeakDemandKw(
  chargers: ChargerEntry[],
  peakPortsUsed: number,
  loadManagementLimit?: number
): number {
  const avgKwPerPort = calculateAvgKwPerPort(chargers);
  const nameplateKw = calculateNameplateKw(chargers);
  const effectiveKw = calculateEffectiveKw(nameplateKw, loadManagementLimit);

  // Peak demand is limited by effective capacity
  return Math.min(peakPortsUsed * avgKwPerPort, effectiveKw);
}

/**
 * Distribute kWh across time-of-use periods for summer
 */
export function distributeSummerKwh(
  totalKwh: number,
  onPeakHours: number,
  offPeakHours: number,
  superPeakHours: number
): { onPeakKwh: number; offPeakKwh: number; superPeakKwh: number } {
  const totalHours = onPeakHours + offPeakHours + superPeakHours;

  if (totalHours === 0) {
    return { onPeakKwh: 0, offPeakKwh: 0, superPeakKwh: 0 };
  }

  return {
    onPeakKwh: totalKwh * (onPeakHours / totalHours),
    offPeakKwh: totalKwh * (offPeakHours / totalHours),
    superPeakKwh: totalKwh * (superPeakHours / totalHours),
  };
}

/**
 * Distribute kWh across time-of-use periods for winter
 */
export function distributeWinterKwh(
  totalKwh: number,
  onPeakHours: number,
  offPeakHours: number
): { onPeakKwh: number; offPeakKwh: number } {
  const totalHours = onPeakHours + offPeakHours;

  if (totalHours === 0) {
    return { onPeakKwh: 0, offPeakKwh: 0 };
  }

  return {
    onPeakKwh: totalKwh * (onPeakHours / totalHours),
    offPeakKwh: totalKwh * (offPeakHours / totalHours),
  };
}

/**
 * Calculate summer monthly costs under EV PIR
 */
export function calculateSummerMonthlyEvPir(
  demandKw: number,
  onPeakKwh: number,
  offPeakKwh: number,
  superPeakKwh: number,
  rates: TierRates
): {
  demandCharge: number;
  onPeakCharge: number;
  offPeakCharge: number;
  superPeakCharge: number;
  total: number;
} {
  const demandCharge = demandKw * rates.demandPerKw;
  const onPeakCharge = onPeakKwh * rates.onPeakPerKwh;
  const offPeakCharge = offPeakKwh * rates.offPeakPerKwh;
  const superPeakCharge = superPeakKwh * (rates.superPeakPerKwh ?? 0);

  return {
    demandCharge,
    onPeakCharge,
    offPeakCharge,
    superPeakCharge,
    total: demandCharge + onPeakCharge + offPeakCharge + superPeakCharge,
  };
}

/**
 * Calculate winter monthly costs under EV PIR
 */
export function calculateWinterMonthlyEvPir(
  demandKw: number,
  onPeakKwh: number,
  offPeakKwh: number,
  rates: TierRates
): {
  demandCharge: number;
  onPeakCharge: number;
  offPeakCharge: number;
  total: number;
} {
  const demandCharge = demandKw * rates.demandPerKw;
  const onPeakCharge = onPeakKwh * rates.onPeakPerKwh;
  const offPeakCharge = offPeakKwh * rates.offPeakPerKwh;

  return {
    demandCharge,
    onPeakCharge,
    offPeakCharge,
    total: demandCharge + onPeakCharge + offPeakCharge,
  };
}

/**
 * Calculate monthly costs under standard rate (demand only - for comparison)
 */
export function calculateStandardMonthly(
  demandKw: number,
  standardDemandRate: number
): number {
  return demandKw * standardDemandRate;
}

/**
 * Round to 2 decimal places for currency calculations
 */
function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calculate revenue from charging EV drivers
 */
export function calculateRevenue(
  totalAnnualKwh: number,
  totalEnergyCost: number,
  costToDriverPerKwh: number,
  percentTimeChargingDrivers: number,
  networkFeePercent: number,
  customerRevSharePercent: number
): RevenueCalculation {
  const percentDecimal = percentTimeChargingDrivers / 100;
  const billableKwh = roundCurrency(totalAnnualKwh * percentDecimal);

  // Gross revenue - round after multiplication to fix precision issues
  const grossRevenue = roundCurrency(billableKwh * costToDriverPerKwh);

  // Network fee deduction
  const networkFeeAmount = roundCurrency(grossRevenue * (networkFeePercent / 100));
  const revenueAfterNetworkFee = roundCurrency(grossRevenue - networkFeeAmount);

  // Revenue share split
  const csevRevSharePercent = 100 - customerRevSharePercent;
  const customerNetChargingRevenue = roundCurrency(revenueAfterNetworkFee * (customerRevSharePercent / 100));
  const csevNetChargingRevenue = roundCurrency(revenueAfterNetworkFee * (csevRevSharePercent / 100));

  // Final customer revenue after energy costs
  const customerFinalRevenue = roundCurrency(customerNetChargingRevenue - totalEnergyCost);

  // Monthly breakdowns (divide annual by 12)
  const monthlyGrossRevenue = roundCurrency(grossRevenue / 12);
  const monthlyCustomerFinalRevenue = roundCurrency(customerFinalRevenue / 12);

  return {
    costToDriverPerKwh,
    percentTimeChargingDrivers,
    billableKwh,
    grossRevenue,
    networkFeePercent,
    networkFeeAmount,
    revenueAfterNetworkFee,
    customerRevSharePercent,
    csevRevSharePercent,
    customerNetChargingRevenue,
    csevNetChargingRevenue,
    totalEnergyCost,
    customerFinalRevenue,
    monthlyGrossRevenue,
    monthlyCustomerFinalRevenue,
  };
}

/**
 * Map old service class names to new ones for backwards compatibility
 */
function mapServiceClass(serviceClass: string): string {
  const mapping: Record<string, string> = {
    'SC-1': 'SC-2D',
    'SC-2': 'SC-2D',
    'SC-3': 'SC-3 Secondary',
    'SC-2-MRP': 'SC-2D',
  };
  return mapping[serviceClass] || serviceClass;
}

/**
 * Main calculation function - computes all results for a project
 */
export function calculateResults(project: Project): CalculationResult | null {
  // Get rate table
  const rateTable = getRateTable(project.utility);
  if (!rateTable) {
    console.error(`Rate table not found for utility: ${project.utility}`);
    return null;
  }

  // Map old service class names to new ones
  const mappedServiceClass = mapServiceClass(project.serviceClass);

  // Get service class rates
  const serviceClassRates = rateTable.serviceClasses[mappedServiceClass];
  if (!serviceClassRates) {
    console.error(`Service class not found: ${project.serviceClass} (mapped to ${mappedServiceClass})`);
    return null;
  }

  // Calculate nameplate and effective kW
  const nameplateKw = calculateNameplateKw(project.chargers);
  const effectiveKw = calculateEffectiveKw(nameplateKw, project.loadManagementLimit);
  const totalPorts = calculateTotalPorts(project.chargers);

  if (nameplateKw === 0) {
    // No EVSE configured
    return null;
  }

  // Calculate estimated usage from inputs
  const { daysInMonth, peakPortsUsed, summer, winter } = project.billingInputs;

  // Calculate total daily charging hours from TOU hours
  const summerDailyHours = summer.onPeakHours + summer.offPeakHours + summer.superPeakHours;
  const winterDailyHours = winter.onPeakHours + winter.offPeakHours;
  const avgDailyChargingHours = calculateTotalDailyChargingHours(
    summer.onPeakHours,
    summer.offPeakHours,
    summer.superPeakHours,
    winter.onPeakHours,
    winter.offPeakHours
  );

  // Calculate seasonal monthly kWh (different hours per season)
  const summerMonthlyKwh = calculateEstimatedMonthlyKwh(
    project.chargers,
    summerDailyHours,
    daysInMonth
  );

  const winterMonthlyKwh = calculateEstimatedMonthlyKwh(
    project.chargers,
    winterDailyHours,
    daysInMonth
  );

  // For annual calculations, use weighted average
  const estimatedMonthlyKwh = (summerMonthlyKwh * SUMMER_MONTHS + winterMonthlyKwh * WINTER_MONTHS) / 12;

  const estimatedAnnualKwh = calculateEstimatedAnnualKwh(
    project.chargers,
    avgDailyChargingHours
  );

  // Calculate load factor from usage inputs
  const loadFactor = calculateLoadFactorFromUsage(
    project.chargers,
    avgDailyChargingHours,
    project.loadManagementLimit
  );

  // Determine tier based on calculated load factor
  const tier = determineTier(loadFactor);

  // Get the appropriate rates based on tier
  const standardDemandRate = serviceClassRates.standardDemandRate;

  // Tier 0 (>25% load factor) = Standard Rate: demand charge only, no kWh rates
  const tierRates: TierRates = tier > 0
    ? serviceClassRates.tiers[tier]
    : {
        demandPerKw: standardDemandRate,
        onPeakPerKwh: 0,
        offPeakPerKwh: 0,
        superPeakPerKwh: 0,
      };

  // Calculate peak demand
  const peakDemandKw = calculatePeakDemandKw(project.chargers, peakPortsUsed, project.loadManagementLimit);

  // Get supply rate (default to 0.10 if not set)
  const supplyRate = project.supplyRatePerKwh ?? 0.10;

  // Summer calculations - use summer-specific monthly kWh
  const summerDistribution = distributeSummerKwh(
    summerMonthlyKwh,
    summer.onPeakHours,
    summer.offPeakHours,
    summer.superPeakHours
  );

  const summerEvPir = calculateSummerMonthlyEvPir(
    peakDemandKw,
    summerDistribution.onPeakKwh,
    summerDistribution.offPeakKwh,
    summerDistribution.superPeakKwh,
    tierRates
  );

  const summerStandard = calculateStandardMonthly(peakDemandKw, standardDemandRate);

  const summerSupplyCharge = summerMonthlyKwh * supplyRate;
  const summerMonthly: MonthlyCalculation = {
    season: 'summer',
    month: 'Summer (avg)',
    totalKwh: summerMonthlyKwh,
    onPeakKwh: summerDistribution.onPeakKwh,
    offPeakKwh: summerDistribution.offPeakKwh,
    superPeakKwh: summerDistribution.superPeakKwh,
    demandKw: peakDemandKw,
    demandCharge: summerEvPir.demandCharge,
    onPeakCharge: summerEvPir.onPeakCharge,
    offPeakCharge: summerEvPir.offPeakCharge,
    superPeakCharge: summerEvPir.superPeakCharge,
    totalEvPirCost: summerEvPir.total,
    supplyCharge: summerSupplyCharge,
    totalWithSupply: summerEvPir.total + summerSupplyCharge,
    standardDemandCharge: summerStandard,
    totalStandardCost: summerStandard,
    savings: summerStandard - summerEvPir.total,
    savingsPercent:
      summerStandard > 0
        ? ((summerStandard - summerEvPir.total) / summerStandard) * 100
        : 0,
  };

  // Winter calculations - use winter-specific monthly kWh
  const winterDistribution = distributeWinterKwh(
    winterMonthlyKwh,
    winter.onPeakHours,
    winter.offPeakHours
  );

  const winterEvPir = calculateWinterMonthlyEvPir(
    peakDemandKw,
    winterDistribution.onPeakKwh,
    winterDistribution.offPeakKwh,
    tierRates
  );

  const winterStandard = calculateStandardMonthly(peakDemandKw, standardDemandRate);

  const winterSupplyCharge = winterMonthlyKwh * supplyRate;
  const winterMonthly: MonthlyCalculation = {
    season: 'winter',
    month: 'Winter (avg)',
    totalKwh: winterMonthlyKwh,
    onPeakKwh: winterDistribution.onPeakKwh,
    offPeakKwh: winterDistribution.offPeakKwh,
    demandKw: peakDemandKw,
    demandCharge: winterEvPir.demandCharge,
    onPeakCharge: winterEvPir.onPeakCharge,
    offPeakCharge: winterEvPir.offPeakCharge,
    totalEvPirCost: winterEvPir.total,
    supplyCharge: winterSupplyCharge,
    totalWithSupply: winterEvPir.total + winterSupplyCharge,
    standardDemandCharge: winterStandard,
    totalStandardCost: winterStandard,
    savings: winterStandard - winterEvPir.total,
    savingsPercent:
      winterStandard > 0
        ? ((winterStandard - winterEvPir.total) / winterStandard) * 100
        : 0,
  };

  // Seasonal summaries
  const summerSeasonalSupply = summerSupplyCharge * SUMMER_MONTHS;
  const summerSummary: SeasonalSummary = {
    season: 'summer',
    months: SUMMER_MONTHS,
    totalKwh: summerMonthlyKwh * SUMMER_MONTHS,
    avgMonthlyKwh: summerMonthlyKwh,
    totalEvPirCost: summerEvPir.total * SUMMER_MONTHS,
    totalSupplyCharge: summerSeasonalSupply,
    totalWithSupply: (summerEvPir.total * SUMMER_MONTHS) + summerSeasonalSupply,
    totalStandardCost: summerStandard * SUMMER_MONTHS,
    totalSavings: (summerStandard - summerEvPir.total) * SUMMER_MONTHS,
    savingsPercent: summerMonthly.savingsPercent,
  };

  const winterSeasonalSupply = winterSupplyCharge * WINTER_MONTHS;
  const winterSummary: SeasonalSummary = {
    season: 'winter',
    months: WINTER_MONTHS,
    totalKwh: winterMonthlyKwh * WINTER_MONTHS,
    avgMonthlyKwh: winterMonthlyKwh,
    totalEvPirCost: winterEvPir.total * WINTER_MONTHS,
    totalSupplyCharge: winterSeasonalSupply,
    totalWithSupply: (winterEvPir.total * WINTER_MONTHS) + winterSeasonalSupply,
    totalStandardCost: winterStandard * WINTER_MONTHS,
    totalSavings: (winterStandard - winterEvPir.total) * WINTER_MONTHS,
    savingsPercent: winterMonthly.savingsPercent,
  };

  // Yearly summary
  const yearlyTotalKwh = summerSummary.totalKwh + winterSummary.totalKwh;
  const yearlyEvPirCost = summerSummary.totalEvPirCost + winterSummary.totalEvPirCost;
  const yearlySupplyCharge = summerSummary.totalSupplyCharge + winterSummary.totalSupplyCharge;
  const yearlyTotalWithSupply = yearlyEvPirCost + yearlySupplyCharge;
  const yearlyStandardCost = summerSummary.totalStandardCost + winterSummary.totalStandardCost;
  const yearlySavings = yearlyStandardCost - yearlyEvPirCost;

  const yearlySummary: YearlySummary = {
    totalKwh: yearlyTotalKwh,
    totalEvPirCost: yearlyEvPirCost,
    totalSupplyCharge: yearlySupplyCharge,
    totalWithSupply: yearlyTotalWithSupply,
    totalStandardCost: yearlyStandardCost,
    totalSavings: yearlySavings,
    savingsPercent:
      yearlyStandardCost > 0 ? (yearlySavings / yearlyStandardCost) * 100 : 0,
    summer: summerSummary,
    winter: winterSummary,
    tier,
    loadFactor,
  };

  // Calculate revenue if revenue settings exist
  const revenueSettings = project.revenueSettings ?? DEFAULT_REVENUE_SETTINGS;
  const revenue = calculateRevenue(
    yearlyTotalKwh,
    yearlyTotalWithSupply, // Total energy cost = EV PIR delivery + supply
    revenueSettings.costToDriverPerKwh,
    revenueSettings.percentTimeChargingDrivers,
    revenueSettings.networkFeePercent ?? DEFAULT_REVENUE_SETTINGS.networkFeePercent,
    revenueSettings.customerRevSharePercent ?? DEFAULT_REVENUE_SETTINGS.customerRevSharePercent
  );

  return {
    project,
    tier,
    loadFactor,
    loadFactorPercent: loadFactor * 100,
    nameplatekW: nameplateKw,
    effectiveKw,
    totalPorts,
    estimatedAnnualKwh,
    estimatedMonthlyKwh,
    peakDemandKw,
    monthly: {
      summer: summerMonthly,
      winter: winterMonthly,
    },
    yearly: yearlySummary,
    ratesUsed: {
      tier,
      demandRate: tierRates.demandPerKw,
      onPeakRate: tierRates.onPeakPerKwh,
      offPeakRate: tierRates.offPeakPerKwh,
      superPeakRate: tierRates.superPeakPerKwh,
      standardDemandRate,
      supplyRate,
    },
    revenue,
  };
}
