import React, { useEffect, useMemo } from 'react';
import { Project, DEFAULT_COST_TO_DRIVER, DEFAULT_REVENUE_SETTINGS } from '../../types';

interface RevenueSettingsProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export const RevenueSettings: React.FC<RevenueSettingsProps> = ({
  project,
  onUpdate,
}) => {
  // Calculate suggested cost to driver based on charger mix (weighted by kW capacity)
  const suggestedCostToDriver = useMemo(() => {
    if (project.chargers.length === 0) {
      return DEFAULT_REVENUE_SETTINGS.costToDriverPerKwh;
    }

    let level2Kw = 0;
    let dcfcKw = 0;

    project.chargers.forEach((charger) => {
      const chargerKw = charger.kwPerCharger * charger.quantity;
      if (charger.level === 'Level 2') {
        level2Kw += chargerKw;
      } else {
        dcfcKw += chargerKw;
      }
    });

    const totalKw = level2Kw + dcfcKw;
    if (totalKw === 0) return DEFAULT_REVENUE_SETTINGS.costToDriverPerKwh;

    // Weighted average based on kW capacity
    const weightedAvg =
      (level2Kw * DEFAULT_COST_TO_DRIVER['Level 2'] +
        dcfcKw * DEFAULT_COST_TO_DRIVER['DCFC (Level 3)']) /
      totalKw;

    return Math.round(weightedAvg * 100) / 100; // Round to 2 decimal places
  }, [project.chargers]);

  // Get current settings or use defaults
  const currentSettings = {
    ...DEFAULT_REVENUE_SETTINGS,
    ...project.revenueSettings,
  };

  // Calculate CSEV Rev Share (inverse of customer share)
  const csevRevSharePercent = 100 - currentSettings.customerRevSharePercent;

  // Update cost to driver when chargers change (if user hasn't manually set it)
  useEffect(() => {
    // Only auto-update if revenue settings haven't been manually configured
    if (!project.revenueSettings && project.chargers.length > 0) {
      onUpdate({
        revenueSettings: {
          ...DEFAULT_REVENUE_SETTINGS,
          costToDriverPerKwh: suggestedCostToDriver,
        },
      });
    }
  }, [suggestedCostToDriver, project.chargers.length, project.revenueSettings, onUpdate]);

  const handleCostChange = (value: number) => {
    onUpdate({
      revenueSettings: {
        ...currentSettings,
        costToDriverPerKwh: value,
      },
    });
  };

  const handlePercentChange = (value: number) => {
    onUpdate({
      revenueSettings: {
        ...currentSettings,
        percentTimeChargingDrivers: Math.min(100, Math.max(0, value)),
      },
    });
  };

  const handleNetworkFeeChange = (value: number) => {
    onUpdate({
      revenueSettings: {
        ...currentSettings,
        networkFeePercent: Math.min(100, Math.max(0, value)),
      },
    });
  };

  const handleCustomerRevShareChange = (value: number) => {
    onUpdate({
      revenueSettings: {
        ...currentSettings,
        customerRevSharePercent: Math.min(100, Math.max(0, value)),
      },
    });
  };

  const handleResetToSuggested = () => {
    onUpdate({
      revenueSettings: {
        ...currentSettings,
        costToDriverPerKwh: suggestedCostToDriver,
      },
    });
  };

  // Determine what type of chargers are in the project
  const hasLevel2 = project.chargers.some((c) => c.level === 'Level 2');
  const hasDCFC = project.chargers.some((c) => c.level === 'DCFC (Level 3)');
  const chargerTypeLabel = hasLevel2 && hasDCFC
    ? 'Mixed (L2 + DCFC)'
    : hasDCFC
      ? 'DCFC'
      : 'Level 2';

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
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        EV Driver Revenue
      </h2>

      <div className="space-y-4">
        {/* Cost to Driver */}
        <div>
          <label className="label flex items-center justify-between">
            <span>Cost to Driver ($/kWh)</span>
            {project.chargers.length > 0 && (
              <span className="text-xs text-neutral-500">
                Charger type: {chargerTypeLabel}
              </span>
            )}
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
                $
              </span>
              <input
                type="number"
                className="input-field pl-7"
                value={currentSettings.costToDriverPerKwh}
                onChange={(e) =>
                  handleCostChange(parseFloat(e.target.value) || 0)
                }
                step="0.01"
                min="0"
              />
            </div>
            <span className="text-neutral-600">/kWh</span>
            {currentSettings.costToDriverPerKwh !== suggestedCostToDriver && (
              <button
                onClick={handleResetToSuggested}
                className="text-xs text-primary-600 hover:text-primary-700 underline"
                title={`Reset to suggested rate: $${suggestedCostToDriver.toFixed(2)}/kWh`}
              >
                Reset
              </button>
            )}
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Default: ${DEFAULT_COST_TO_DRIVER['Level 2'].toFixed(2)}/kWh (L2) or $
            {DEFAULT_COST_TO_DRIVER['DCFC (Level 3)'].toFixed(2)}/kWh (DCFC)
          </p>
        </div>

        {/* Percentage of Time Charging Drivers */}
        <div>
          <label className="label">Percentage of Usage from Paid Charging</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              value={currentSettings.percentTimeChargingDrivers}
              onChange={(e) => handlePercentChange(parseInt(e.target.value))}
              min="0"
              max="100"
              step="5"
            />
            <div className="flex items-center gap-1 w-20">
              <input
                type="number"
                className="input-field w-16 text-center py-1"
                value={currentSettings.percentTimeChargingDrivers}
                onChange={(e) =>
                  handlePercentChange(parseInt(e.target.value) || 0)
                }
                min="0"
                max="100"
              />
              <span className="text-neutral-600">%</span>
            </div>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Percentage of total kWh that will be billed to EV drivers (vs. free/employee charging)
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-200 pt-4">
          <h3 className="text-sm font-semibold text-neutral-700 mb-3">Revenue Share Settings</h3>
        </div>

        {/* Network Fee */}
        <div>
          <label className="label">Network Fee</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              className="input-field w-24"
              value={currentSettings.networkFeePercent}
              onChange={(e) =>
                handleNetworkFeeChange(parseFloat(e.target.value) || 0)
              }
              step="0.5"
              min="0"
              max="100"
            />
            <span className="text-neutral-600">%</span>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Network/processing fee deducted from gross revenue (default: 9%)
          </p>
        </div>

        {/* Customer Revenue Share */}
        <div>
          <label className="label">Customer Rev Share</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              className="flex-1 h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
              value={currentSettings.customerRevSharePercent}
              onChange={(e) => handleCustomerRevShareChange(parseInt(e.target.value))}
              min="0"
              max="100"
              step="5"
            />
            <div className="flex items-center gap-1 w-20">
              <input
                type="number"
                className="input-field w-16 text-center py-1"
                value={currentSettings.customerRevSharePercent}
                onChange={(e) =>
                  handleCustomerRevShareChange(parseInt(e.target.value) || 0)
                }
                min="0"
                max="100"
              />
              <span className="text-neutral-600">%</span>
            </div>
          </div>
          <p className="text-sm text-neutral-500 mt-1">
            Customer's share of net revenue after network fee
          </p>
        </div>

        {/* CSEV Revenue Share (Read-only display) */}
        <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-700">CSEV Rev Share</span>
            <span className="text-lg font-bold text-primary-600">{csevRevSharePercent}%</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            CSEV's share of net revenue (100% - Customer Rev Share)
          </p>
        </div>
      </div>
    </div>
  );
};

export default RevenueSettings;
