import type { ChurnRateInput, ChurnRateResult } from './types';

function formatPercent(rate: number): string {
  if (!Number.isFinite(rate)) return '';
  const rounded = Math.round(rate * 10000) / 10000;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

function formatLifetime(periods: number): string {
  const rounded = Math.round(periods * 10000) / 10000;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

/**
 * Churn % = (lost / starting) × 100.
 * Lifetime (periods) = starting / lost when lost > 0; otherwise "No finite estimate".
 */
export function calculateChurnRate(input: ChurnRateInput): ChurnRateResult | null {
  const { startingCustomers, customersLost } = input;
  if (!Number.isFinite(startingCustomers) || !Number.isFinite(customersLost)) return null;
  if (startingCustomers <= 0) return null;
  if (customersLost < 0 || customersLost > startingCustomers) return null;

  const churnRatePercent = (customersLost / startingCustomers) * 100;
  if (!Number.isFinite(churnRatePercent)) return null;

  const hasFiniteLifetime = customersLost > 0;
  const customerLifetimePeriods = hasFiniteLifetime
    ? startingCustomers / customersLost
    : null;
  if (customerLifetimePeriods !== null && !Number.isFinite(customerLifetimePeriods)) return null;

  return {
    startingCustomers,
    customersLost,
    churnRatePercent,
    customerLifetimePeriods,
    churnRateDisplay: formatPercent(churnRatePercent),
    lifetimeDisplay: hasFiniteLifetime
      ? formatLifetime(customerLifetimePeriods!)
      : 'No finite estimate',
  };
}
