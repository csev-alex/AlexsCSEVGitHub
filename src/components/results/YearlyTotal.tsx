import React from 'react';
import { YearlySummary } from '../../types';
import {
  formatCurrency,
  formatKwh,
} from '../../utils/formatters';

interface YearlyTotalProps {
  yearly: YearlySummary;
}

export const YearlyTotal: React.FC<YearlyTotalProps> = ({ yearly }) => {
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
            d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
        Annual Cost Summary
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Period</th>
              <th className="text-right">Months</th>
              <th className="text-right">Total kWh</th>
              <th className="text-right">Monthly Cost</th>
              <th className="text-right">Seasonal Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-medium">Summer (Jun-Sep)</td>
              <td className="text-right">{yearly.summer.months}</td>
              <td className="text-right">{formatKwh(yearly.summer.totalKwh)}</td>
              <td className="text-right">
                {formatCurrency(yearly.summer.avgMonthlyKwh > 0 ? yearly.summer.totalEvPirCost / yearly.summer.months : 0)}
              </td>
              <td className="text-right font-medium text-primary-600">
                {formatCurrency(yearly.summer.totalEvPirCost)}
              </td>
            </tr>
            <tr>
              <td className="font-medium">Winter (Oct-May)</td>
              <td className="text-right">{yearly.winter.months}</td>
              <td className="text-right">{formatKwh(yearly.winter.totalKwh)}</td>
              <td className="text-right">
                {formatCurrency(yearly.winter.avgMonthlyKwh > 0 ? yearly.winter.totalEvPirCost / yearly.winter.months : 0)}
              </td>
              <td className="text-right font-medium text-primary-600">
                {formatCurrency(yearly.winter.totalEvPirCost)}
              </td>
            </tr>
            <tr className="bg-primary-50 font-semibold">
              <td className="text-primary-800">Annual Total</td>
              <td className="text-right text-primary-800">12</td>
              <td className="text-right text-primary-800">{formatKwh(yearly.totalKwh)}</td>
              <td className="text-right text-primary-800">
                {formatCurrency(yearly.totalEvPirCost / 12)}
              </td>
              <td className="text-right text-primary-700 text-lg">
                {formatCurrency(yearly.totalEvPirCost)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-neutral-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-600">
              Estimated annual energy usage: {formatKwh(yearly.totalKwh)}
            </p>
            <p className="text-sm text-neutral-600">
              Average monthly EV PIR cost: {formatCurrency(yearly.totalEvPirCost / 12)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-600">Estimated Annual Cost</p>
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(yearly.totalEvPirCost)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearlyTotal;
