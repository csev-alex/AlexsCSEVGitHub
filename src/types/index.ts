// Service class types
export type ServiceClass =
  | 'SC-2D'
  | 'SC-3 Secondary'
  | 'SC-3 Primary'
  | 'SC-3 SubT/Trans'
  | 'SC-3A Sec/Pri'
  | 'SC-3A SubT'
  | 'SC-3A Trans';

// Metering options
export type MeteringType = 'separate' | 'combined';

// Charger level types
export type ChargerLevel = 'Level 2' | 'DCFC (Level 3)';

// Legacy charger type (for backwards compatibility)
export type ChargerType = 'Level2' | 'DCFC';

// Site voltage options
export type SiteVoltage = 208 | 240 | 480;

// Season types
export type Season = 'summer' | 'winter';

// EVSE Equipment from catalog
export interface EVSEEquipment {
  id: string;
  level: ChargerLevel;
  name: string;
  description: string;
  manufacturer: string;
  numberOfPlugs: number;
  amperage: number | null;
  kw208V: number | null;
  kw240V: number | null;
  kw480V: number | null;
}

// Charger entry in inventory (EVSE Installed)
export interface ChargerEntry {
  id: string;
  evseId: string; // Reference to EVSEEquipment
  name: string; // Display name (from EVSEEquipment)
  type: ChargerType; // Legacy field for calculations
  level: ChargerLevel;
  siteVoltage: SiteVoltage;
  kwPerCharger: number; // Calculated based on voltage selection
  quantity: number;
  numberOfPlugs: number; // Per unit
  individualCircuits: boolean; // If true, multiply kW by numberOfPlugs for nameplate
}

// Summer hour distribution
export interface SummerHours {
  onPeakHours: number;
  offPeakHours: number;
  superPeakHours: number;
}

// Winter hour distribution
export interface WinterHours {
  onPeakHours: number;
  offPeakHours: number;
}

// Billing inputs from user
export interface BillingInputs {
  daysInMonth: number;
  avgDailyPortsUsed: number;
  avgHoursPerPortPerDay: number; // Hours each port is used per day on average
  peakPortsUsed: number;
  summer: SummerHours;
  winter: WinterHours;
  timePerSessionMinutes: number; // Legacy - kept for backwards compatibility
}

// Revenue settings for charging EV drivers
export interface RevenueSettings {
  costToDriverPerKwh: number; // $/kWh charged to drivers
  percentTimeChargingDrivers: number; // 0-100, percentage of usage that is paid charging
  networkFeePercent: number; // 0-100, network fee percentage (default 9%)
  customerRevSharePercent: number; // 0-100, customer's share of net revenue after network fee (default 100%)
}

// Full project state
export interface Project {
  id: string;
  name: string;
  customerName: string;
  projectAddress: string;
  createdAt: string;
  updatedAt: string;

  // Configuration
  utility: 'national-grid' | string;
  serviceClass: ServiceClass;
  meteringType: MeteringType;

  // EVSE Installed
  chargers: ChargerEntry[];
  loadManagementLimit?: number;

  // Usage Inputs (for load factor and cost calculations)
  billingInputs: BillingInputs;

  // Optional supply rate
  supplyRatePerKwh?: number;

  // Revenue settings for charging EV drivers
  revenueSettings?: RevenueSettings;
}

// Rate tier structure
export interface TierRates {
  demandPerKw: number;
  onPeakPerKwh: number;
  offPeakPerKwh: number;
  superPeakPerKwh?: number; // Only in summer
}

// Service class rate definition
export interface ServiceClassRates {
  name: string;
  description: string;
  minKw?: number;
  maxKw?: number;
  tiers: {
    [tier: number]: TierRates;
  };
  standardDemandRate: number; // Tier 0 / standard rate
}

// Full rate table for a utility
export interface RateTable {
  utility: string;
  utilityDisplayName: string;
  effectiveDate: string;
  serviceClasses: {
    [key: string]: ServiceClassRates;
  };
}

// Calculation results for a single month
export interface MonthlyCalculation {
  season: Season;
  month: string;

  // Usage breakdown
  totalKwh: number;
  onPeakKwh: number;
  offPeakKwh: number;
  superPeakKwh?: number;
  demandKw: number;

  // Costs under EV PIR (delivery only)
  demandCharge: number;
  onPeakCharge: number;
  offPeakCharge: number;
  superPeakCharge?: number;
  totalEvPirCost: number;

  // Supply charge
  supplyCharge: number;
  totalWithSupply: number;

  // Costs under standard rate
  standardDemandCharge: number;
  totalStandardCost: number;

  // Savings
  savings: number;
  savingsPercent: number;
}

// Seasonal summary
export interface SeasonalSummary {
  season: Season;
  months: number; // 4 for summer, 8 for winter
  totalKwh: number;
  avgMonthlyKwh: number;
  totalEvPirCost: number;
  totalSupplyCharge: number;
  totalWithSupply: number;
  totalStandardCost: number;
  totalSavings: number;
  savingsPercent: number;
}

// Yearly summary
export interface YearlySummary {
  totalKwh: number;
  totalEvPirCost: number;
  totalSupplyCharge: number;
  totalWithSupply: number;
  totalStandardCost: number;
  totalSavings: number;
  savingsPercent: number;
  summer: SeasonalSummary;
  winter: SeasonalSummary;
  tier: number;
  loadFactor: number;
}

// Revenue calculation results
export interface RevenueCalculation {
  costToDriverPerKwh: number;
  percentTimeChargingDrivers: number;
  billableKwh: number; // Total kWh × percent charging drivers
  grossRevenue: number; // Billable kWh × cost to driver
  // Network fee
  networkFeePercent: number;
  networkFeeAmount: number; // Gross revenue × network fee %
  revenueAfterNetworkFee: number; // Gross revenue - network fee
  // Revenue share split
  customerRevSharePercent: number;
  csevRevSharePercent: number; // 100 - customer rev share %
  customerNetChargingRevenue: number; // Revenue after network fee × customer share %
  csevNetChargingRevenue: number; // Revenue after network fee × CSEV share %
  // Final customer revenue
  totalEnergyCost: number; // EV PIR delivery + supply costs
  customerFinalRevenue: number; // Customer net charging revenue - energy costs
  // Monthly breakdowns
  monthlyGrossRevenue: number;
  monthlyCustomerFinalRevenue: number;
}

// Full calculation result
export interface CalculationResult {
  project: Project;
  tier: number;
  loadFactor: number;
  loadFactorPercent: number;
  nameplatekW: number;
  effectiveKw: number;
  totalPorts: number;
  estimatedAnnualKwh: number;
  estimatedMonthlyKwh: number;
  peakDemandKw: number;
  monthly: {
    summer: MonthlyCalculation;
    winter: MonthlyCalculation;
  };
  yearly: YearlySummary;
  ratesUsed: {
    tier: number;
    demandRate: number;
    onPeakRate: number;
    offPeakRate: number;
    superPeakRate?: number;
    standardDemandRate: number;
    supplyRate: number;
  };
  revenue?: RevenueCalculation;
}

// Default values for new project
export const DEFAULT_BILLING_INPUTS: BillingInputs = {
  daysInMonth: 30,
  avgDailyPortsUsed: 2,
  avgHoursPerPortPerDay: 4, // 4 hours per port per day
  peakPortsUsed: 4,
  summer: {
    // Default split: 30% super-peak, 50% on-peak, 20% off-peak of (2 ports × 4 hrs = 8 hrs)
    superPeakHours: 2.5, // 30% of 8 = 2.4, rounded to 0.25
    onPeakHours: 4, // 50% of 8 = 4
    offPeakHours: 1.5, // 20% of 8 = 1.6, rounded to 0.25
  },
  winter: {
    // Default split: 80% on-peak, 20% off-peak of 8 hrs
    onPeakHours: 6.5, // 80% of 8 = 6.4, rounded to 0.25
    offPeakHours: 1.5, // 20% of 8 = 1.6, rounded to 0.25
  },
  timePerSessionMinutes: 60, // Legacy
};

// Default revenue settings
export const DEFAULT_REVENUE_SETTINGS: RevenueSettings = {
  costToDriverPerKwh: 0.40, // Default for Level 2, will be recalculated based on charger mix
  percentTimeChargingDrivers: 100,
  networkFeePercent: 9.00, // Default 9% network fee
  customerRevSharePercent: 100, // Default 100% to customer
};

// Default cost to driver by charger level
export const DEFAULT_COST_TO_DRIVER = {
  'Level 2': 0.40,
  'DCFC (Level 3)': 0.55,
};

export const DEFAULT_PROJECT: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
  name: 'New Project',
  customerName: '',
  projectAddress: '',
  utility: 'national-grid',
  serviceClass: 'SC-2D',
  meteringType: 'separate',
  chargers: [],
  billingInputs: DEFAULT_BILLING_INPUTS,
  supplyRatePerKwh: 0.10,
  revenueSettings: DEFAULT_REVENUE_SETTINGS,
};
