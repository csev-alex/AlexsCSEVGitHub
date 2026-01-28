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
  const isProfit = revenue.customerFinalRevenue >= 0;

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
        Charging Revenue
      </h3>

      {/* Revenue Settings Summary */}
      <div className="mb-4 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="text-neutral-500">Rate:</span>{' '}
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
          <div>
            <span className="text-neutral-500">Processing fees:</span>{' '}
            <span className="font-semibold text-neutral-900">
              {revenue.networkFeePercent}%
            </span>
          </div>
          <div>
            <span className="text-neutral-500">Customer share:</span>{' '}
            <span className="font-semibold text-neutral-900">
              {revenue.customerRevSharePercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Revenue Breakdown - Annual */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-neutral-700 mb-2">Annual Breakdown</h4>

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
            Annual Billable kWh ({revenue.percentTimeChargingDrivers}%)
          </span>
          <span className="font-medium text-neutral-900">
            {formatNumber(revenue.billableKwh, 0)} kWh
          </span>
        </div>

        {/* Gross Revenue */}
        <div className="flex justify-between items-center py-2 border-b border-neutral-100 bg-green-50 -mx-4 px-4">
          <div>
            <span className="text-neutral-700 font-medium">Gross Charging Revenue</span>
            <span className="text-xs text-neutral-400 ml-1 block">
              {formatNumber(revenue.billableKwh, 0)} kWh x ${revenue.costToDriverPerKwh.toFixed(2)}
            </span>
          </div>
          <span className="font-bold text-green-600">
            {formatCurrency(revenue.grossRevenue)}
          </span>
        </div>

        {/* Processing Fees */}
        <div className="flex justify-between items-center py-2 border-b border-neutral-100">
          <div>
            <span className="text-neutral-600">Less: Processing Fees</span>
          </div>
          <span className="font-medium text-red-600">
            -{formatCurrency(revenue.networkFeeAmount)}
          </span>
        </div>

        {/* Revenue After Processing Fees */}
        <div className="flex justify-between items-center py-2 border-b border-neutral-200">
          <span className="text-neutral-700 font-medium">Net After Processing Fees</span>
          <span className="font-semibold text-neutral-900">
            {formatCurrency(revenue.revenueAfterNetworkFee)}
          </span>
        </div>

        {/* Revenue Share Split - only show customer share when less than 100% */}
        {revenue.customerRevSharePercent < 100 && (
          <div className="flex justify-between items-center py-2 border-b border-neutral-100">
            <span className="text-neutral-600">
              Cust Rev Share ({revenue.customerRevSharePercent}%)
            </span>
            <span className="font-medium text-neutral-900">
              {formatCurrency(revenue.customerNetChargingRevenue)}
            </span>
          </div>
        )}

        {/* Customer Net Charging Revenue */}
        <div className="flex justify-between items-center py-2 border-b border-neutral-100 bg-blue-50 -mx-4 px-4">
          <span className="text-neutral-700 font-medium">Customer Net Charging Revenue</span>
          <span className="font-bold text-blue-600">
            {formatCurrency(revenue.customerNetChargingRevenue)}
          </span>
        </div>

        {/* Energy Costs */}
        <div className="flex justify-between items-center py-2 border-b border-neutral-100">
          <div>
            <span className="text-neutral-600">Less: Total Energy Costs</span>
            <span className="text-xs text-neutral-400 ml-1 block">
              (EV PIR Delivery + Supply)
            </span>
          </div>
          <span className="font-medium text-red-600">
            -{formatCurrency(revenue.totalEnergyCost)}
          </span>
        </div>

        {/* Final Customer Revenue - Annual */}
        <div
          className={`flex justify-between items-center py-3 px-4 rounded-lg -mx-4 ${
            isProfit ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
          }`}
        >
          <div>
            <span className={`font-bold ${isProfit ? 'text-green-800' : 'text-red-800'}`}>
              Annual Cust Profit
            </span>
          </div>
          <span className={`text-xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(revenue.customerFinalRevenue)}
          </span>
        </div>

        {/* Monthly Breakdown */}
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-semibold text-neutral-700 mb-3">Monthly Averages</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-xs text-neutral-500 block">Monthly Gross Revenue</span>
              <span className="text-lg font-bold text-neutral-900">
                {formatCurrency(revenue.monthlyGrossRevenue)}
              </span>
            </div>
            <div className={`p-3 rounded-lg border ${isProfit ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <span className="text-xs text-neutral-500 block">Monthly Cust Profit</span>
              <span className={`text-lg font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(revenue.monthlyCustomerFinalRevenue)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      {revenue.percentTimeChargingDrivers < 100 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Note:</span> {100 - revenue.percentTimeChargingDrivers}% of
            charging ({formatNumber(totalAnnualKwh - revenue.billableKwh, 0)} kWh/year) is not generating
            revenue (e.g., free/employee charging).
          </p>
        </div>
      )}
    </div>
  );
};

export default RevenueResults;
