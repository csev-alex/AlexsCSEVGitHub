import React from 'react';
import { CalculationResult } from '../../types';
import { formatCurrency, formatKwh, formatPercent, getTierLabel } from '../../utils/formatters';

interface CostHighlightProps {
  results: CalculationResult;
}

export const CostHighlight: React.FC<CostHighlightProps> = ({ results }) => {
  const { yearly, estimatedAnnualKwh, estimatedMonthlyKwh } = results;

  return (
    <div className="rounded-xl p-6 text-white" style={{ backgroundColor: '#4CBC88' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
          <svg
            className="w-6 h-6"
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
        </div>
        <div>
          <h3 className="text-lg font-semibold">Estimated Annual EV Charging Cost</h3>
          <p className="text-sm opacity-80">
            Based on EV Phase-In Rate • {getTierLabel(results.tier)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm opacity-80 mb-1">Annual EV PIR Cost</p>
          <p className="text-3xl font-bold">{formatCurrency(yearly.totalEvPirCost)}</p>
        </div>
        <div>
          <p className="text-sm opacity-80 mb-1">Monthly Average</p>
          <p className="text-3xl font-bold">{formatCurrency(yearly.totalEvPirCost / 12)}</p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/20">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-80">Est. Annual kWh</p>
            <p className="font-semibold text-lg">{formatKwh(estimatedAnnualKwh)}</p>
          </div>
          <div>
            <p className="opacity-80">Est. Monthly kWh</p>
            <p className="font-semibold text-lg">{formatKwh(estimatedMonthlyKwh)}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-80">Load Factor</p>
            <p className="font-semibold text-lg">{formatPercent(results.loadFactorPercent)}</p>
          </div>
          <div>
            <p className="opacity-80">Rate Tier</p>
            <p className="font-semibold text-lg">{getTierLabel(results.tier)}</p>
          </div>
        </div>
      </div>

      {results.tier > 0 && yearly.totalSavings > 0 && (
        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <p className="text-sm">
            <strong>Note:</strong> EV PIR saves you {formatCurrency(yearly.totalSavings)} ({formatPercent(yearly.savingsPercent)}) annually compared to standard demand rates.
          </p>
        </div>
      )}

      {results.tier === 0 && (
        <div className="mt-4 p-3 bg-white/10 rounded-lg">
          <p className="text-sm">
            <strong>Note:</strong> Load factor exceeds 25% - standard rate applies. Consider load management to reduce peak demand.
          </p>
        </div>
      )}
    </div>
  );
};

export default CostHighlight;
