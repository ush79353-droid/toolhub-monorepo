import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { RevenuePerEmployeeResult } from './types';

/**
 * Revenue Per Employee = Total Revenue / Number of Employees
 */
export function calculateRevenuePerEmployee(
  revenue: number,
  employeeCount: number,
  currency: SupportedCurrency
): RevenuePerEmployeeResult | null {
  if (!Number.isFinite(revenue) || !Number.isFinite(employeeCount)) return null;
  if (revenue < 0 || employeeCount <= 0) return null;
  if (!Number.isInteger(employeeCount)) return null;

  const revenuePerEmployee = revenue / employeeCount;
  if (!Number.isFinite(revenuePerEmployee)) return null;

  const digits = getCurrencyFractionDigits(currency);
  const formattedRevenuePerEmployee = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(revenuePerEmployee);

  return {
    revenue,
    employeeCount,
    revenuePerEmployee,
    currency,
    formattedRevenuePerEmployee,
  };
}
