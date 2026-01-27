import React from 'react';
import { RevenueCalculation } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/formatters';

interface RevenueResultsProps {
  revenue: RevenueCalculation;
  totalAnnualKwh: number;
}

export const RevenueResults: React.FC<RevenueResultsProps> = ({
  revenue,
  totalAnnualKwh,
}) => {
  const isProfit = revenue.netRevenue >= 0;

  return (
    <div className="card">
      <h3 className="section-title flex items-center gap-2">
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
        Annual Revenue Analysis
      </h3>

      {/* Revenue Settings Summary */}
      <div className="mb-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-neutral-500">Rate charged:</span>{' '}
            <span className="font-semibold text-neutral-900">
              ${revenue.costToDriverPerKwh.toFixed(2)}/kWh
            </span>
          </div>
          <div>
            <span className="text-neutral-500">Paid charging:</span>{' '}
            <span className="font-semibold text-neutral-900">
              {revenue.percentTimeChargingDrivers}%
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="space-y-3">
        {/* Total kWh */}
        <div className="flex justify-between items-center py-2 border-b border-neutral-100">
          <span className="text-neutral-600">Total Annual kWh</span>
          <span className="font-medium text-neutral-900">
            {formatNumber(totalAnnualKwh, 0)} kWh
          </span>
        </div>

        {/* Billable kWh */}
        <div className="flex justify-between items-center py-2 border-b border-neutral-100">
          <span className="text-neutral-600">
            Billable kWh ({revenue.percentTimeChargingDrivers}%)
          </span>
          <span className="font-medium text-neutral-900">
            {formatNumber(revenue.billableKwh, 0)} kWh
          </span>
        </div>

        {/* Gross Revenue */}
        <div className="flex justify-between items-center py-2 border-b border-neutral-100">
          <div>
            <span className="text-neutral-600">Gross Charging Revenue</span>
            <span className="text-xs text-neutral-400 ml-1">
              ({formatNumber(revenue.billableKwh, 0)} kWh x ${revenue.costToDriverPerKwh.toFixed(2)})
            </span>
          </div>
          <span className="font-semibold text-green-600">
            +{formatCurrency(revenue.grossRevenue)}
          </span>
        </div>

        {/* Energy Costs */}
        <div className="flex justify-between items-center py-2 border-b border-neutral-100">
          <div>
            <span className="text-neutral-600">Total Energy Costs</span>
            <span className="text-xs text-neutral-400 ml-1">
              (Delivery + Supply)
            </span>
          </div>
          <span className="font-semibold text-red-600">
            -{formatCurrency(revenue.totalEnergyCost)}
          </span>
        </div>

        {/* Net Revenue */}
        <div
          className={`flex justify-between items-center py-3 px-4 rounded-lg ${
            isProfit ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}
        >
          <span className={`font-semibold ${isProfit ? 'text-green-800' : 'text-red-800'}`}>
            Net Revenue
          </span>
          <span className={`text-xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {isProfit ? '+' : ''}{formatCurrency(revenue.netRevenue)}
          </span>
        </div>

        {/* Net Revenue per kWh */}
        {revenue.billableKwh > 0 && (
          <div className="text-center text-sm text-neutral-500 mt-2">
            Net margin: {' '}
            <span className={`font-semibold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              ${revenue.netRevenuePerKwh.toFixed(3)}/kWh
            </span>
          </div>
        )}
      </div>

      {/* Insights */}
      {revenue.percentTimeChargingDrivers < 100 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note:</span> {100 - revenue.percentTimeChargingDrivers}% of
            charging ({formatNumber(totalAnnualKwh - revenue.billableKwh, 0)} kWh) is not generating
            revenue (e.g., free/employee charging).
          </p>
        </div>
      )}
    </div>
  );
};

export default RevenueResults;
