/**
 * Format currency values
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage values
 */
export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format kWh values
 */
export function formatKwh(value: number, decimals: number = 0): string {
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} kWh`;
}

/**
 * Format kW values
 */
export function formatKw(value: number, decimals: number = 1): string {
  return `${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })} kW`;
}

/**
 * Format rate values (per kWh or per kW)
 * Uses 5 decimal places for kWh rates, 2 for kW rates
 */
export function formatRate(value: number, unit: 'kWh' | 'kW'): string {
  const decimals = unit === 'kWh' ? 5 : 2;
  return `$${value.toFixed(decimals)}/${unit}`;
}

/**
 * Format a number with commas
 */
export function formatNumber(value: number, decimals: number = 0): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date and time for display
 */
export function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Get tier label
 */
export function getTierLabel(tier: number): string {
  if (tier === 0) {
    return 'Standard Rate';
  }
  return `Tier ${tier}`;
}

/**
 * Get tier color class
 */
export function getTierColorClass(tier: number): string {
  switch (tier) {
    case 1:
      return 'bg-green-100 text-green-800';
    case 2:
      return 'bg-blue-100 text-blue-800';
    case 3:
      return 'bg-yellow-100 text-yellow-800';
    case 4:
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-red-100 text-red-800';
  }
}

/**
 * Get savings color class based on amount
 */
export function getSavingsColorClass(savings: number): string {
  if (savings > 0) {
    return 'text-green-600';
  } else if (savings < 0) {
    return 'text-red-600';
  }
  return 'text-neutral-600';
}

/**
 * Format season label
 */
export function formatSeason(season: 'summer' | 'winter'): string {
  return season === 'summer' ? 'Summer (Jun-Sep)' : 'Winter (Oct-May)';
}
