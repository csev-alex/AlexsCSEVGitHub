import { RateTable } from '../../types';

/**
 * National Grid Electric Vehicle Phase-In Rate (EV PIR) Schedule
 *
 * This rate structure provides reduced demand charges for EV charging based on load factor.
 * Load factor determines the tier, with lower load factors receiving greater discounts.
 *
 * Tier 0: Standard rate (>25% load factor) - demand charge only, no kWh rates
 * Tier 1: ≤10% load factor - $0 demand, highest kWh rates
 * Tier 2: >10% and ≤15% load factor
 * Tier 3: >15% and ≤20% load factor
 * Tier 4: >20% and ≤25% load factor
 *
 * Summer: June - September (4 months)
 * Winter: October - May (8 months)
 *
 * Time-of-Use Periods (Summer):
 * - Super-Peak: 2pm - 6pm weekdays
 * - On-Peak: 6am - 2pm, 6pm - 10pm weekdays
 * - Off-Peak: All other hours (nights, weekends, holidays)
 *
 * Time-of-Use Periods (Winter):
 * - On-Peak: 6am - 10pm weekdays
 * - Off-Peak: All other hours (nights, weekends, holidays)
 *
 * Data sourced from EV_PIR_Estimator v1.0.0.xlsx "Rates" tab
 */

export const nationalGridRates: RateTable = {
  utility: 'national-grid',
  utilityDisplayName: 'National Grid',
  effectiveDate: '2024-01-01',
  serviceClasses: {
    'SC-2D': {
      name: 'SC-2D',
      description: 'Commercial service with demand metering',
      standardDemandRate: 16.99,
      tiers: {
        1: {
          demandPerKw: 0,
          onPeakPerKwh: 0.0742,
          offPeakPerKwh: 0.0371,
          superPeakPerKwh: 0.11131,
        },
        2: {
          demandPerKw: 4.25,
          onPeakPerKwh: 0.05565,
          offPeakPerKwh: 0.02783,
          superPeakPerKwh: 0.08348,
        },
        3: {
          demandPerKw: 8.50,
          onPeakPerKwh: 0.0371,
          offPeakPerKwh: 0.01855,
          superPeakPerKwh: 0.05565,
        },
        4: {
          demandPerKw: 12.74,
          onPeakPerKwh: 0.01855,
          offPeakPerKwh: 0.00928,
          superPeakPerKwh: 0.02783,
        },
      },
    },
    'SC-3 Secondary': {
      name: 'SC-3 Secondary',
      description: 'Large commercial service - Secondary voltage',
      standardDemandRate: 14.28,
      tiers: {
        1: {
          demandPerKw: 0,
          onPeakPerKwh: 0.04805,
          offPeakPerKwh: 0.02403,
          superPeakPerKwh: 0.07208,
        },
        2: {
          demandPerKw: 3.57,
          onPeakPerKwh: 0.03604,
          offPeakPerKwh: 0.01802,
          superPeakPerKwh: 0.05406,
        },
        3: {
          demandPerKw: 7.14,
          onPeakPerKwh: 0.02403,
          offPeakPerKwh: 0.01201,
          superPeakPerKwh: 0.03604,
        },
        4: {
          demandPerKw: 10.71,
          onPeakPerKwh: 0.01201,
          offPeakPerKwh: 0.00601,
          superPeakPerKwh: 0.01802,
        },
      },
    },
    'SC-3 Primary': {
      name: 'SC-3 Primary',
      description: 'Large commercial service - Primary voltage',
      standardDemandRate: 12.88,
      tiers: {
        1: {
          demandPerKw: 0,
          onPeakPerKwh: 0.03984,
          offPeakPerKwh: 0.01992,
          superPeakPerKwh: 0.05976,
        },
        2: {
          demandPerKw: 3.22,
          onPeakPerKwh: 0.02988,
          offPeakPerKwh: 0.01494,
          superPeakPerKwh: 0.04482,
        },
        3: {
          demandPerKw: 6.44,
          onPeakPerKwh: 0.01992,
          offPeakPerKwh: 0.00996,
          superPeakPerKwh: 0.02988,
        },
        4: {
          demandPerKw: 9.66,
          onPeakPerKwh: 0.00996,
          offPeakPerKwh: 0.00498,
          superPeakPerKwh: 0.01494,
        },
      },
    },
    'SC-3 SubT/Trans': {
      name: 'SC-3 SubT/Trans',
      description: 'Large commercial service - Subtransmission/Transmission voltage',
      standardDemandRate: 4.07,
      tiers: {
        1: {
          demandPerKw: 0,
          onPeakPerKwh: 0.01257,
          offPeakPerKwh: 0.00629,
          superPeakPerKwh: 0.01886,
        },
        2: {
          demandPerKw: 1.02,
          onPeakPerKwh: 0.00943,
          offPeakPerKwh: 0.00472,
          superPeakPerKwh: 0.01415,
        },
        3: {
          demandPerKw: 2.04,
          onPeakPerKwh: 0.00629,
          offPeakPerKwh: 0.00314,
          superPeakPerKwh: 0.00943,
        },
        4: {
          demandPerKw: 3.05,
          onPeakPerKwh: 0.00314,
          offPeakPerKwh: 0.00157,
          superPeakPerKwh: 0.00472,
        },
      },
    },
    'SC-3A Sec/Pri': {
      name: 'SC-3A Sec/Pri',
      description: 'Large commercial service with TOU - Secondary/Primary voltage',
      standardDemandRate: 14.07,
      tiers: {
        1: {
          demandPerKw: 0,
          onPeakPerKwh: 0.04033,
          offPeakPerKwh: 0.02017,
          superPeakPerKwh: 0.0605,
        },
        2: {
          demandPerKw: 3.52,
          onPeakPerKwh: 0.03025,
          offPeakPerKwh: 0.01512,
          superPeakPerKwh: 0.04537,
        },
        3: {
          demandPerKw: 7.04,
          onPeakPerKwh: 0.02017,
          offPeakPerKwh: 0.01008,
          superPeakPerKwh: 0.03025,
        },
        4: {
          demandPerKw: 10.55,
          onPeakPerKwh: 0.01008,
          offPeakPerKwh: 0.00504,
          superPeakPerKwh: 0.01512,
        },
      },
    },
    'SC-3A SubT': {
      name: 'SC-3A SubT',
      description: 'Large commercial service with TOU - Subtransmission voltage',
      standardDemandRate: 4.97,
      tiers: {
        1: {
          demandPerKw: 0,
          onPeakPerKwh: 0.01329,
          offPeakPerKwh: 0.00664,
          superPeakPerKwh: 0.01993,
        },
        2: {
          demandPerKw: 1.24,
          onPeakPerKwh: 0.00997,
          offPeakPerKwh: 0.00498,
          superPeakPerKwh: 0.01495,
        },
        3: {
          demandPerKw: 2.49,
          onPeakPerKwh: 0.00664,
          offPeakPerKwh: 0.00332,
          superPeakPerKwh: 0.00997,
        },
        4: {
          demandPerKw: 3.73,
          onPeakPerKwh: 0.00332,
          offPeakPerKwh: 0.00166,
          superPeakPerKwh: 0.00498,
        },
      },
    },
    'SC-3A Trans': {
      name: 'SC-3A Trans',
      description: 'Large commercial service with TOU - Transmission voltage',
      standardDemandRate: 4.36,
      tiers: {
        1: {
          demandPerKw: 0,
          onPeakPerKwh: 0.01194,
          offPeakPerKwh: 0.00597,
          superPeakPerKwh: 0.0179,
        },
        2: {
          demandPerKw: 1.09,
          onPeakPerKwh: 0.00895,
          offPeakPerKwh: 0.00448,
          superPeakPerKwh: 0.01343,
        },
        3: {
          demandPerKw: 2.18,
          onPeakPerKwh: 0.00597,
          offPeakPerKwh: 0.00298,
          superPeakPerKwh: 0.00895,
        },
        4: {
          demandPerKw: 3.27,
          onPeakPerKwh: 0.00298,
          offPeakPerKwh: 0.00149,
          superPeakPerKwh: 0.00448,
        },
      },
    },
  },
};

// Export a function to get rates for a specific utility
export function getRateTable(utility: string): RateTable | undefined {
  if (utility === 'national-grid') {
    return nationalGridRates;
  }
  return undefined;
}

// Export available utilities
export const availableUtilities = [
  { id: 'national-grid', name: 'National Grid' },
];
