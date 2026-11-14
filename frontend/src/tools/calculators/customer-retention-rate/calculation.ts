import type { CustomerRetentionInput, CustomerRetentionResult } from './types';

function formatPercent(rate: number): string {
  if (!Number.isFinite(rate)) return '';
  const rounded = Math.round(rate * 10000) / 10000;
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(rounded);
}

/**
 * Retained = total − new.
 * Retention % = retained / existing × 100.
 * Attrition % = 100 − retention.
 */
export function calculateCustomerRetention(
  input: CustomerRetentionInput
): CustomerRetentionResult | null {
  const { existingCustomers, newCustomers, totalCustomers } = input;
  if (
    !Number.isFinite(existingCustomers) ||
    !Number.isFinite(newCustomers) ||
    !Number.isFinite(totalCustomers)
  ) {
    return null;
  }
  if (existingCustomers <= 0) return null;
  if (newCustomers < 0 || totalCustomers < 0) return null;

  const retainedCustomers = totalCustomers - newCustomers;
  if (!Number.isFinite(retainedCustomers)) return null;
  if (retainedCustomers < 0 || retainedCustomers > existingCustomers) return null;

  const retentionRatePercent = (retainedCustomers / existingCustomers) * 100;
  if (!Number.isFinite(retentionRatePercent)) return null;

  const attritionRatePercent = 100 - retentionRatePercent;
  if (!Number.isFinite(attritionRatePercent)) return null;

  return {
    existingCustomers,
    newCustomers,
    totalCustomers,
    retainedCustomers,
    retentionRatePercent,
    attritionRatePercent,
    retentionDisplay: formatPercent(retentionRatePercent),
    attritionDisplay: formatPercent(attritionRatePercent),
  };
}
