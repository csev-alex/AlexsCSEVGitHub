import React from 'react';
import { CalculationResult } from '../../types';
import {
  formatPercent,
  formatKw,
  formatKwh,
  getTierLabel,
  getTierColorClass,
} from '../../utils/formatters';

interface ResultsSummaryProps {
  results: CalculationResult;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ results }) => {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 mb-1">Calculation Summary</h2>
          <p className="text-neutral-500 text-sm">
            Based on your inputs and current rate structure
          </p>
        </div>
        <div
          className={`px-4 py-2 rounded-lg font-medium text-sm ${getTierColorClass(
            results.tier
          )}`}
        >
          {getTierLabel(results.tier)} • {formatPercent(results.loadFactorPercent)} Load Factor
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Equipment Summary */}
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
          <h3 className="text-neutral-600 text-sm font-medium mb-3">
            Equipment Capacity
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Nameplate:</span>
              <span className="font-medium text-neutral-900">{formatKw(results.nameplatekW)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Effective:</span>
              <span className="font-medium text-neutral-900">{formatKw(results.effectiveKw)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">EVSE Units:</span>
              <span className="font-medium text-neutral-900">
                {results.project.chargers.reduce((sum, c) => sum + c.quantity, 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Total Plugs:</span>
              <span className="font-medium text-neutral-900">
                {results.project.chargers.reduce((sum, c) => sum + (c.numberOfPlugs ?? 1) * c.quantity, 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Usage Estimates */}
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
          <h3 className="text-neutral-600 text-sm font-medium mb-3">
            Estimated Usage
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Peak Demand:</span>
              <span className="font-medium text-neutral-900">{formatKw(results.peakDemandKw)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Monthly kWh:</span>
              <span className="font-medium text-neutral-900">{formatKwh(results.estimatedMonthlyKwh)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Annual kWh:</span>
              <span className="font-medium text-neutral-900">{formatKwh(results.estimatedAnnualKwh)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Load Factor:</span>
              <span className="font-medium text-neutral-900">{formatPercent(results.loadFactorPercent)}</span>
            </div>
          </div>
        </div>

        {/* Rates Applied */}
        <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-200">
          <h3 className="text-neutral-600 text-sm font-medium mb-3">
            EV PIR Rates ({getTierLabel(results.tier)})
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-500">Demand:</span>
              <span className="font-medium text-neutral-900">
                ${results.ratesUsed.demandRate.toFixed(2)}/kW
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">On-Peak:</span>
              <span className="font-medium text-neutral-900">
                ${results.ratesUsed.onPeakRate.toFixed(5)}/kWh
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Off-Peak:</span>
              <span className="font-medium text-neutral-900">
                ${results.ratesUsed.offPeakRate.toFixed(5)}/kWh
              </span>
            </div>
            {results.ratesUsed.superPeakRate !== undefined && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Super-Peak:</span>
                <span className="font-medium text-neutral-900">
                  ${results.ratesUsed.superPeakRate.toFixed(5)}/kWh
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsSummary;
