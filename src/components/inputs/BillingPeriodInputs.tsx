import React, { useEffect, useCallback } from 'react';
import { Project, BillingInputs } from '../../types';
import {
  calculateNameplateKw,
  calculateTotalPorts,
  calculateLoadFactorFromUsage,
  calculateEstimatedAnnualKwh,
} from '../../utils/calculations';
import { determineTier } from '../../utils/tierCalculation';
import { formatPercent, formatKwh, getTierLabel, getTierColorClass } from '../../utils/formatters';

interface BillingPeriodInputsProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

// Round to nearest 0.25 hours
function roundToQuarter(value: number): number {
  return Math.round(value * 4) / 4;
}

// TOU time window limits (hours per port per day)
const SUMMER_SUPER_PEAK_WINDOW = 4;   // 2pm-6pm = 4 hrs
const SUMMER_ON_PEAK_WINDOW = 12;     // 6am-2pm + 6pm-10pm = 12 hrs
const SUMMER_OFF_PEAK_WINDOW = 8;     // 10pm-6am = 8 hrs
const WINTER_ON_PEAK_WINDOW = 16;     // 6am-10pm = 16 hrs
const WINTER_OFF_PEAK_WINDOW = 8;     // 10pm-6am = 8 hrs

// Target distribution ratios (before capping)
const SUMMER_SUPER_PEAK_RATIO = 0.30;
const SUMMER_ON_PEAK_RATIO = 0.50;
// Off-peak gets remainder

const WINTER_ON_PEAK_RATIO = 0.80;
// Off-peak gets remainder

export const BillingPeriodInputs: React.FC<BillingPeriodInputsProps> = ({
  project,
  onUpdate,
}) => {
  const { avgDailyPortsUsed, avgHoursPerPortPerDay = 4 } = project.billingInputs;

  // Total daily charging hours = ports used × hours per port
  const totalDailyChargingHours = avgDailyPortsUsed * avgHoursPerPortPerDay;

  // Calculate totals for validation
  const summerTotalHours =
    project.billingInputs.summer.superPeakHours +
    project.billingInputs.summer.onPeakHours +
    project.billingInputs.summer.offPeakHours;

  const winterTotalHours =
    project.billingInputs.winter.onPeakHours +
    project.billingInputs.winter.offPeakHours;

  // Validation - allow small floating point tolerance
  const summerValid = Math.abs(summerTotalHours - totalDailyChargingHours) < 0.01;
  const winterValid = Math.abs(winterTotalHours - totalDailyChargingHours) < 0.01;

  // Calculate load factor and tier
  const nameplateKw = calculateNameplateKw(project.chargers);
  const totalPorts = calculateTotalPorts(project.chargers);

  // Use weighted average of summer/winter hours for annual calculations
  const avgWeightedDailyHours = (summerTotalHours * 4 + winterTotalHours * 8) / 12;

  const loadFactor = calculateLoadFactorFromUsage(
    project.chargers,
    avgWeightedDailyHours,
    project.loadManagementLimit
  );
  const tier = determineTier(loadFactor);
  const estimatedAnnualKwh = calculateEstimatedAnnualKwh(
    project.chargers,
    avgWeightedDailyHours
  );

  // Calculate theoretical max hours for context
  const maxPossibleHours = totalPorts * 24;

  const updateBilling = useCallback((updates: Partial<BillingInputs>) => {
    onUpdate({
      billingInputs: {
        ...project.billingInputs,
        ...updates,
      },
    });
  }, [onUpdate, project.billingInputs]);

  // Auto-populate TOU hours when main inputs change
  // Caps hours based on TOU time windows (max = ports × window hours)
  const redistributeHours = useCallback((newTotalHours: number, portsUsed: number) => {
    // Calculate max hours for each period based on time windows
    const summerSuperMax = portsUsed * SUMMER_SUPER_PEAK_WINDOW;
    const summerOnMax = portsUsed * SUMMER_ON_PEAK_WINDOW;
    const summerOffMax = portsUsed * SUMMER_OFF_PEAK_WINDOW;
    const winterOnMax = portsUsed * WINTER_ON_PEAK_WINDOW;
    const winterOffMax = portsUsed * WINTER_OFF_PEAK_WINDOW;

    // Summer distribution with caps
    let summerSuper = Math.min(newTotalHours * SUMMER_SUPER_PEAK_RATIO, summerSuperMax);
    let summerOn = Math.min(newTotalHours * SUMMER_ON_PEAK_RATIO, summerOnMax);
    let summerOff = newTotalHours - summerSuper - summerOn;

    // If off-peak exceeds max, redistribute overflow to on-peak (then super-peak)
    if (summerOff > summerOffMax) {
      const overflow = summerOff - summerOffMax;
      summerOff = summerOffMax;
      // Try to add overflow to on-peak
      const onPeakRoom = summerOnMax - summerOn;
      if (onPeakRoom >= overflow) {
        summerOn += overflow;
      } else {
        summerOn += onPeakRoom;
        // Remaining goes to super-peak (shouldn't exceed due to total constraint)
        summerSuper = Math.min(summerSuper + (overflow - onPeakRoom), summerSuperMax);
      }
    }

    // Winter distribution with caps
    let winterOn = Math.min(newTotalHours * WINTER_ON_PEAK_RATIO, winterOnMax);
    let winterOff = newTotalHours - winterOn;

    // If off-peak exceeds max, add overflow to on-peak
    if (winterOff > winterOffMax) {
      const overflow = winterOff - winterOffMax;
      winterOff = winterOffMax;
      winterOn = Math.min(winterOn + overflow, winterOnMax);
    }

    return {
      summer: {
        superPeakHours: roundToQuarter(summerSuper),
        onPeakHours: roundToQuarter(summerOn),
        offPeakHours: roundToQuarter(summerOff),
      },
      winter: {
        onPeakHours: roundToQuarter(winterOn),
        offPeakHours: roundToQuarter(winterOff),
      },
    };
  }, []);

  const handleMainInputChange = useCallback((
    newPortsUsed: number,
    newHoursPerPort: number
  ) => {
    const newTotal = newPortsUsed * newHoursPerPort;
    const newDistribution = redistributeHours(newTotal, newPortsUsed);

    updateBilling({
      avgDailyPortsUsed: newPortsUsed,
      avgHoursPerPortPerDay: newHoursPerPort,
      ...newDistribution,
    });
  }, [redistributeHours, updateBilling]);

  const updateSummer = (updates: Partial<typeof project.billingInputs.summer>) => {
    updateBilling({
      summer: {
        ...project.billingInputs.summer,
        ...updates,
      },
    });
  };

  const updateWinter = (updates: Partial<typeof project.billingInputs.winter>) => {
    updateBilling({
      winter: {
        ...project.billingInputs.winter,
        ...updates,
      },
    });
  };

  // Initialize avgHoursPerPortPerDay if not set (migration from old data)
  useEffect(() => {
    if (project.billingInputs.avgHoursPerPortPerDay === undefined) {
      // Calculate from existing TOU hours
      const existingTotal = Math.max(summerTotalHours, winterTotalHours);
      const hoursPerPort = avgDailyPortsUsed > 0
        ? existingTotal / avgDailyPortsUsed
        : 4;
      updateBilling({ avgHoursPerPortPerDay: roundToQuarter(hoursPerPort) });
    }
  }, []);

  return (
    <div className="card">
      <h2 className="section-title flex items-center gap-2">
        <svg
          className="w-5 h-5 text-primary-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Usage & Billing Inputs
      </h2>

      {/* Load Factor Summary - only show if EVSE is configured */}
      {nameplateKw > 0 && (
        <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-neutral-500 mb-1">Calculated Load Factor</p>
              <p className="text-2xl font-bold text-neutral-900">
                {formatPercent(loadFactor * 100)}
              </p>
            </div>
            <div>
              <p className="text-sm text-neutral-500 mb-1">Est. Annual Usage</p>
              <p className="text-2xl font-bold text-neutral-900">
                {formatKwh(estimatedAnnualKwh)}
              </p>
            </div>
            <div className={`px-4 py-2 rounded-lg font-medium ${getTierColorClass(tier)}`}>
              {getTierLabel(tier)}
            </div>
          </div>
          <p className="text-xs text-neutral-500 mt-3">
            Load factor = Daily charging hours / (Total ports × 24).
            Lower load factors qualify for better rate tiers.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Primary Usage Inputs */}
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <h3 className="font-medium text-neutral-800 mb-4">Daily Usage Pattern</h3>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label htmlFor="daysInMonth" className="label">
                Days in Month
              </label>
              <input
                type="number"
                id="daysInMonth"
                className="input-field"
                value={project.billingInputs.daysInMonth}
                onChange={(e) =>
                  updateBilling({ daysInMonth: parseInt(e.target.value) || 30 })
                }
                min="28"
                max="31"
              />
            </div>

            <div>
              <label htmlFor="avgDailyPorts" className="label">
                Avg Daily Ports Used
              </label>
              <input
                type="number"
                id="avgDailyPorts"
                className="input-field"
                value={avgDailyPortsUsed}
                onChange={(e) => {
                  const newPorts = parseFloat(e.target.value) || 0;
                  handleMainInputChange(newPorts, avgHoursPerPortPerDay);
                }}
                min="0"
                step="0.5"
              />
              <p className="help-text">Ports charging at any given time</p>
            </div>

            <div>
              <label htmlFor="avgHoursPerPort" className="label">
                Avg Hours Per Port/Day
              </label>
              <input
                type="number"
                id="avgHoursPerPort"
                className="input-field"
                value={avgHoursPerPortPerDay}
                onChange={(e) => {
                  const newHours = parseFloat(e.target.value) || 0;
                  handleMainInputChange(avgDailyPortsUsed, newHours);
                }}
                min="0"
                max="24"
                step="0.25"
              />
              <p className="help-text">Hours each port is used daily</p>
            </div>

            <div>
              <label htmlFor="peakPorts" className="label">
                Peak Ports Used
              </label>
              <input
                type="number"
                id="peakPorts"
                className="input-field"
                value={project.billingInputs.peakPortsUsed}
                onChange={(e) =>
                  updateBilling({
                    peakPortsUsed: parseInt(e.target.value) || 0,
                  })
                }
                min="0"
              />
              <p className="help-text">Max simultaneous charging</p>
            </div>

            <div>
              <label htmlFor="supplyRate" className="label">
                Supply Rate ($/kWh)
              </label>
              <input
                type="number"
                id="supplyRate"
                className="input-field"
                value={project.supplyRatePerKwh ?? 0.10}
                onChange={(e) =>
                  onUpdate({
                    supplyRatePerKwh: parseFloat(e.target.value) || 0,
                  })
                }
                min="0"
                step="0.01"
              />
              <p className="help-text">Energy supply cost</p>
            </div>
          </div>

          {/* Calculated totals display */}
          <div className="mt-4 pt-4 border-t border-neutral-200">
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-neutral-500">Total Daily Charging Hours: </span>
                <span className="font-semibold text-neutral-900">
                  {totalDailyChargingHours.toFixed(2)} hrs
                </span>
              </div>
              {totalPorts > 0 && (
                <div>
                  <span className="text-neutral-500">Max Possible Hours: </span>
                  <span className="font-medium text-neutral-700">
                    {maxPossibleHours} hrs ({totalPorts} ports × 24 hrs)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Summer Time-of-Use Distribution */}
        <div className={`p-4 rounded-lg border ${summerValid ? 'bg-orange-50 border-orange-200' : 'bg-red-50 border-red-300'}`}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-orange-800 flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Summer (June - September)
            </h3>
            <span className={`text-sm font-medium ${summerValid ? 'text-green-600' : 'text-red-600'}`}>
              Total: {summerTotalHours.toFixed(2)} / {totalDailyChargingHours.toFixed(2)} hrs
            </span>
          </div>

          {!summerValid && (
            <p className="text-sm text-red-600 mb-3">
              Summer hours must equal total daily charging hours ({totalDailyChargingHours.toFixed(2)} hrs)
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Super-Peak (max {(avgDailyPortsUsed * SUMMER_SUPER_PEAK_WINDOW).toFixed(1)}h)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="input-field"
                  value={project.billingInputs.summer.superPeakHours}
                  onChange={(e) =>
                    updateSummer({
                      superPeakHours: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  max={avgDailyPortsUsed * SUMMER_SUPER_PEAK_WINDOW}
                  step="0.25"
                />
                <span className="text-sm text-neutral-500">hrs</span>
              </div>
              <p className="text-xs text-orange-600 mt-1">2pm-6pm wkdays (4h window)</p>
            </div>

            <div>
              <label className="label">On-Peak (max {(avgDailyPortsUsed * SUMMER_ON_PEAK_WINDOW).toFixed(1)}h)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="input-field"
                  value={project.billingInputs.summer.onPeakHours}
                  onChange={(e) =>
                    updateSummer({
                      onPeakHours: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  max={avgDailyPortsUsed * SUMMER_ON_PEAK_WINDOW}
                  step="0.25"
                />
                <span className="text-sm text-neutral-500">hrs</span>
              </div>
              <p className="text-xs text-orange-600 mt-1">6am-2pm, 6pm-10pm (12h window)</p>
            </div>

            <div>
              <label className="label">Off-Peak (max {(avgDailyPortsUsed * SUMMER_OFF_PEAK_WINDOW).toFixed(1)}h)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="input-field"
                  value={project.billingInputs.summer.offPeakHours}
                  onChange={(e) =>
                    updateSummer({
                      offPeakHours: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  max={avgDailyPortsUsed * SUMMER_OFF_PEAK_WINDOW}
                  step="0.25"
                />
                <span className="text-sm text-neutral-500">hrs</span>
              </div>
              <p className="text-xs text-orange-600 mt-1">10pm-6am (8h window)</p>
            </div>
          </div>
        </div>

        {/* Winter Time-of-Use Distribution */}
        <div className={`p-4 rounded-lg border ${winterValid ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-300'}`}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-blue-800 flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              Winter (October - May)
            </h3>
            <span className={`text-sm font-medium ${winterValid ? 'text-green-600' : 'text-red-600'}`}>
              Total: {winterTotalHours.toFixed(2)} / {totalDailyChargingHours.toFixed(2)} hrs
            </span>
          </div>

          {!winterValid && (
            <p className="text-sm text-red-600 mb-3">
              Winter hours must equal total daily charging hours ({totalDailyChargingHours.toFixed(2)} hrs)
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">On-Peak (max {(avgDailyPortsUsed * WINTER_ON_PEAK_WINDOW).toFixed(1)}h)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="input-field"
                  value={project.billingInputs.winter.onPeakHours}
                  onChange={(e) =>
                    updateWinter({
                      onPeakHours: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  max={avgDailyPortsUsed * WINTER_ON_PEAK_WINDOW}
                  step="0.25"
                />
                <span className="text-sm text-neutral-500">hrs</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">6am-10pm wkdays (16h window)</p>
            </div>

            <div>
              <label className="label">Off-Peak (max {(avgDailyPortsUsed * WINTER_OFF_PEAK_WINDOW).toFixed(1)}h)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="input-field"
                  value={project.billingInputs.winter.offPeakHours}
                  onChange={(e) =>
                    updateWinter({
                      offPeakHours: parseFloat(e.target.value) || 0,
                    })
                  }
                  min="0"
                  max={avgDailyPortsUsed * WINTER_OFF_PEAK_WINDOW}
                  step="0.25"
                />
                <span className="text-sm text-neutral-500">hrs</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">10pm-6am (8h window)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPeriodInputs;
