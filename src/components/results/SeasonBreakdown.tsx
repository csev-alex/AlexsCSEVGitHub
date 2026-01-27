import React from 'react';
import { MonthlyCalculation } from '../../types';
import {
  formatCurrency,
  formatKwh,
  formatKw,
  formatSeason,
} from '../../utils/formatters';

interface SeasonBreakdownProps {
  summer: MonthlyCalculation;
  winter: MonthlyCalculation;
}

export const SeasonBreakdown: React.FC<SeasonBreakdownProps> = ({
  summer,
  winter,
}) => {
  const renderSeasonCard = (data: MonthlyCalculation, isSummer: boolean) => {
    const bgColor = isSummer ? 'bg-orange-50' : 'bg-blue-50';
    const borderColor = isSummer ? 'border-orange-200' : 'border-blue-200';
    const headerBg = isSummer ? 'bg-orange-100' : 'bg-blue-100';
    const headerText = isSummer ? 'text-orange-800' : 'text-blue-800';

    return (
      <div className={`rounded-lg border ${borderColor} overflow-hidden`}>
        <div className={`${headerBg} px-4 py-3`}>
          <h3 className={`font-semibold ${headerText} flex items-center gap-2`}>
            {isSummer ? (
              <svg
                className="w-5 h-5"
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
            ) : (
              <svg
                className="w-5 h-5"
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
            )}
            {formatSeason(data.season)}
          </h3>
          <p className="text-sm opacity-75 mt-1">
            {isSummer ? '4 months' : '8 months'} • Estimated Monthly Costs
          </p>
        </div>

        <div className={`${bgColor} p-4 space-y-4`}>
          {/* Usage Breakdown */}
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">
              Monthly Usage
            </h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-white rounded p-2">
                <span className="text-neutral-500 block">Total kWh</span>
                <span className="font-medium">{formatKwh(data.totalKwh)}</span>
              </div>
              <div className="bg-white rounded p-2">
                <span className="text-neutral-500 block">Peak Demand</span>
                <span className="font-medium">{formatKw(data.demandKw)}</span>
              </div>
            </div>
          </div>

          {/* kWh Distribution */}
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">
              Time-of-Use Distribution
            </h4>
            <div className="space-y-1 text-sm">
              {isSummer && data.superPeakKwh !== undefined && (
                <div className="flex justify-between bg-white rounded px-2 py-1">
                  <span className="text-neutral-600">Super-Peak:</span>
                  <span className="font-medium">
                    {formatKwh(data.superPeakKwh)}
                  </span>
                </div>
              )}
              <div className="flex justify-between bg-white rounded px-2 py-1">
                <span className="text-neutral-600">On-Peak:</span>
                <span className="font-medium">{formatKwh(data.onPeakKwh)}</span>
              </div>
              <div className="flex justify-between bg-white rounded px-2 py-1">
                <span className="text-neutral-600">Off-Peak:</span>
                <span className="font-medium">{formatKwh(data.offPeakKwh)}</span>
              </div>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div>
            <h4 className="text-sm font-medium text-neutral-700 mb-2">
              Monthly EV PIR Cost Breakdown
            </h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between bg-white rounded px-2 py-1">
                <span className="text-neutral-600">Demand Charge:</span>
                <span className="font-medium">
                  {formatCurrency(data.demandCharge)}
                </span>
              </div>
              {isSummer && data.superPeakCharge !== undefined && (
                <div className="flex justify-between bg-white rounded px-2 py-1">
                  <span className="text-neutral-600">Super-Peak Energy:</span>
                  <span className="font-medium">
                    {formatCurrency(data.superPeakCharge)}
                  </span>
                </div>
              )}
              <div className="flex justify-between bg-white rounded px-2 py-1">
                <span className="text-neutral-600">On-Peak Energy:</span>
                <span className="font-medium">
                  {formatCurrency(data.onPeakCharge)}
                </span>
              </div>
              <div className="flex justify-between bg-white rounded px-2 py-1">
                <span className="text-neutral-600">Off-Peak Energy:</span>
                <span className="font-medium">
                  {formatCurrency(data.offPeakCharge)}
                </span>
              </div>
              <div className="flex justify-between bg-primary-100 rounded px-2 py-2 mt-2">
                <span className="font-medium text-primary-800">Total Monthly Cost:</span>
                <span className="font-bold text-primary-800">
                  {formatCurrency(data.totalEvPirCost)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        Seasonal Cost Breakdown
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderSeasonCard(summer, true)}
        {renderSeasonCard(winter, false)}
      </div>
    </div>
  );
};

export default SeasonBreakdown;
