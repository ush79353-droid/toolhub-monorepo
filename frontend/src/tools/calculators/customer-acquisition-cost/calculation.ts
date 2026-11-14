import { formatCurrencyValue } from '@/tools/shared/currency';
import type { SupportedCurrency } from '@/tools/shared/currency';
import type { CustomerAcquisitionCostResult } from './types';

/**
 * CAC = (Cost of Marketing + Cost of Sales) / Number of New Customers
 */
export function calculateCustomerAcquisitionCost(
  costOfMarketing: number,
  costOfSales: number,
  newCustomers: number,
  currency: SupportedCurrency
): CustomerAcquisitionCostResult | null {
  if (![costOfMarketing, costOfSales, newCustomers].every(Number.isFinite)) return null;
  if (costOfMarketing < 0 || costOfSales < 0 || newCustomers <= 0) return null;

  const cac = (costOfMarketing + costOfSales) / newCustomers;
  if (!Number.isFinite(cac)) return null;

  const formattedCac = Number(cac.toFixed(2)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  return {
    costOfMarketing,
    costOfSales,
    newCustomers,
    cac,
    currency,
    formattedCac,
    shareCac: formatCurrencyValue(cac, currency),
  };
}
