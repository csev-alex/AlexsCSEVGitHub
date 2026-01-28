import React from 'react';
import {
  Project,
  DEFAULT_SITE_HOST_SETTINGS,
  DEFAULT_UTILIZATION_GROWTH,
  OwnershipType,
  SiteHostSettings,
  UtilizationGrowthSettings,
} from '../../types';
import { calculateTotalPorts } from '../../utils/calculations';

interface OwnershipSettingsProps {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
}

export const OwnershipSettings: React.FC<OwnershipSettingsProps> = ({
  project,
  onUpdate,
}) => {
  const isSiteHost = project.ownershipType === 'site-host';
  const siteHostSettings = project.siteHostSettings || DEFAULT_SITE_HOST_SETTINGS;
  const utilizationGrowth = project.utilizationGrowth || DEFAULT_UTILIZATION_GROWTH;
  const isManualMode = utilizationGrowth.mode === 'manual';

  // Calculate total ports from chargers
  const totalPorts = calculateTotalPorts(project.chargers);

  // Calculate Base Site Rent
  const totalSpaces = totalPorts + siteHostSettings.additionalEquipmentSpaces;
  const monthlyBaseRent = totalSpaces * siteHostSettings.leasePerSpace;
  const annualBaseRent = monthlyBaseRent * 12;

  const handleOwnershipChange = (type: OwnershipType) => {
    const updates: Partial<Project> = { ownershipType: type };
    if (type === 'site-host' && !project.siteHostSettings) {
      updates.siteHostSettings = { ...DEFAULT_SITE_HOST_SETTINGS };
    }
    if (type === 'site-host' && !project.utilizationGrowth) {
      updates.utilizationGrowth = { ...DEFAULT_UTILIZATION_GROWTH };
    }
    onUpdate(updates);
  };

  const handleSiteHostSettingChange = (
    field: keyof SiteHostSettings,
    value: number
  ) => {
    onUpdate({
      siteHostSettings: {
        ...siteHostSettings,
        [field]: value,
      },
    });
  };

  const handleConstantRateChange = (value: number) => {
    const newSettings: UtilizationGrowthSettings = {
      ...utilizationGrowth,
      constantRate: value,
      // Also update yearlyRates to match when in constant mode
      yearlyRates:
        utilizationGrowth.mode === 'constant'
          ? Array(9).fill(value)
          : utilizationGrowth.yearlyRates,
    };
    onUpdate({ utilizationGrowth: newSettings });
  };

  const handleModeToggle = () => {
    if (isManualMode) {
      // Switching back to constant mode
      onUpdate({
        utilizationGrowth: {
          ...utilizationGrowth,
          mode: 'constant',
        },
      });
    } else {
      // Switching to manual mode - pre-fill with current constant rate
      onUpdate({
        utilizationGrowth: {
          ...utilizationGrowth,
          mode: 'manual',
          yearlyRates: Array(9).fill(utilizationGrowth.constantRate),
        },
      });
    }
  };

  const handleYearlyRateChange = (yearIndex: number, value: number) => {
    const newRates = [...utilizationGrowth.yearlyRates];
    newRates[yearIndex] = value;
    onUpdate({
      utilizationGrowth: {
        ...utilizationGrowth,
        yearlyRates: newRates,
      },
    });
  };

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
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        Ownership Settings
      </h2>

      {/* Ownership Type Dropdown */}
      <div className="mb-4">
        <label className="label">Project Ownership Type</label>
        <select
          className="input-field"
          value={project.ownershipType || 'customer-owned'}
          onChange={(e) => handleOwnershipChange(e.target.value as OwnershipType)}
        >
          <option value="customer-owned">Customer Owned</option>
          <option value="site-host">Site Host</option>
        </select>
      </div>

      {/* Site Host Fields - shown only when Site Host is selected */}
      {isSiteHost && (
        <div className="space-y-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-2 text-amber-800 text-sm font-semibold">
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Site Host Agreement - CSEV Pays Electric
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">Lease $ / Space</label>
              <div className="flex items-center gap-2">
                <span className="text-neutral-500">$</span>
                <input
                  type="number"
                  className="input-field"
                  value={siteHostSettings.leasePerSpace}
                  onChange={(e) =>
                    handleSiteHostSettingChange(
                      'leasePerSpace',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  min="0"
                  step="10"
                />
              </div>
            </div>

            <div>
              <label className="label">Add'l Equipment Spaces</label>
              <input
                type="number"
                className="input-field"
                value={siteHostSettings.additionalEquipmentSpaces}
                onChange={(e) =>
                  handleSiteHostSettingChange(
                    'additionalEquipmentSpaces',
                    parseInt(e.target.value) || 0
                  )
                }
                min="0"
              />
            </div>

            <div>
              <label className="label">Revenue Share %</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="input-field"
                  value={siteHostSettings.revenueSharePercent}
                  onChange={(e) =>
                    handleSiteHostSettingChange(
                      'revenueSharePercent',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  min="0"
                  max="100"
                  step="1"
                />
                <span className="text-neutral-500">%</span>
              </div>
            </div>
          </div>

          {/* Base Site Rent Calculation Display */}
          <div className="bg-white rounded-lg p-4 border border-amber-200">
            <div className="text-sm text-neutral-600 mb-1">Base Site Rent</div>
            <div className="text-2xl font-bold text-amber-700">
              ${monthlyBaseRent.toLocaleString()}/mo
            </div>
            <div className="text-sm text-neutral-500 mt-1">
              ({totalPorts} ports + {siteHostSettings.additionalEquipmentSpaces} add'l
              spaces) x ${siteHostSettings.leasePerSpace}/space ={' '}
              <span className="font-medium">
                ${annualBaseRent.toLocaleString()}/year
              </span>
            </div>
          </div>

          {/* YOY Utilization Growth Section */}
          <div className="pt-4 border-t border-amber-200">
            <div className="flex items-center justify-between mb-3">
              <label className="label mb-0">YOY Utilization Increase</label>
              <button
                type="button"
                onClick={handleModeToggle}
                className={`text-sm px-3 py-1 rounded-lg font-medium transition-colors ${
                  isManualMode
                    ? 'bg-amber-200 text-amber-800'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {isManualMode ? 'Use Constant Rate' : 'Manually Edit'}
              </button>
            </div>

            {!isManualMode ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="input-field w-24"
                  value={utilizationGrowth.constantRate}
                  onChange={(e) =>
                    handleConstantRateChange(parseFloat(e.target.value) || 0)
                  }
                  min="0"
                  max="50"
                  step="0.5"
                />
                <span className="text-neutral-500">% per year (all years)</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 bg-white p-3 rounded-lg border border-amber-100">
                {utilizationGrowth.yearlyRates.map((rate, index) => (
                  <div key={index}>
                    <label className="text-xs text-neutral-500 block mb-1">
                      Y{index + 1} → Y{index + 2}
                    </label>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        className="input-field text-sm py-1 px-2"
                        value={rate}
                        onChange={(e) =>
                          handleYearlyRateChange(
                            index,
                            parseFloat(e.target.value) || 0
                          )
                        }
                        min="0"
                        max="50"
                        step="0.5"
                      />
                      <span className="text-xs text-neutral-400">%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnershipSettings;
