import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { MoneyPeriod } from './types';

export function formatNetEffectiveRentMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Normalize a money amount quoted per month or year into a monthly figure. */
export function toMonthlyAmount(amount: number, period: MoneyPeriod): number | null {
  if (!Number.isFinite(amount)) return null;
  switch (period) {
    case 'month':
      return amount;
    case 'year':
      return amount / 12;
    default:
      return null;
  }
}

/**
 * Net effective rent over the lease, then monthly / annual averages.
 * All money arguments must already be in one currency; rent/op-ex monthly.
 *
 * netLeaseValue = grossLease − rentFree − allowance − totalOpEx
 * monthly = netLeaseValue / leaseMonths
 * annual = monthly × 12
 */
export function calculateNetEffectiveRent(input: {
  leaseMonths: number;
  grossMonthlyRent: number;
  rentFreeMonths: number;
  tenantAllowance: number;
  operatingCostMonthlyFixed: number;
  operatingCostsPercent: number;
}): {
  grossLeaseValue: number;
  rentFreeValue: number;
  totalMonthlyOperatingCost: number;
  totalOperatingCostLease: number;
  netLeaseValue: number;
  netEffectiveRentMonthly: number;
  netEffectiveRentAnnual: number;
} | null {
  const {
    leaseMonths,
    grossMonthlyRent,
    rentFreeMonths,
    tenantAllowance,
    operatingCostMonthlyFixed,
    operatingCostsPercent,
  } = input;

  if (
    ![
      leaseMonths,
      grossMonthlyRent,
      rentFreeMonths,
      tenantAllowance,
      operatingCostMonthlyFixed,
      operatingCostsPercent,
    ].every(Number.isFinite)
  ) {
    return null;
  }
  if (!(leaseMonths > 0)) return null;
  if (grossMonthlyRent < 0) return null;
  if (rentFreeMonths < 0 || rentFreeMonths > leaseMonths) return null;
  if (tenantAllowance < 0) return null;
  if (operatingCostMonthlyFixed < 0 || operatingCostsPercent < 0) return null;

  const grossLeaseValue = grossMonthlyRent * leaseMonths;
  const rentFreeValue = grossMonthlyRent * rentFreeMonths;
  const operatingCostMonthlyPercent =
    grossMonthlyRent * (operatingCostsPercent / 100);
  const totalMonthlyOperatingCost =
    operatingCostMonthlyFixed + operatingCostMonthlyPercent;
  const totalOperatingCostLease = totalMonthlyOperatingCost * leaseMonths;
  const netLeaseValue =
    grossLeaseValue - rentFreeValue - tenantAllowance - totalOperatingCostLease;
  const netEffectiveRentMonthly = netLeaseValue / leaseMonths;
  const netEffectiveRentAnnual = netEffectiveRentMonthly * 12;

  if (
    ![
      grossLeaseValue,
      rentFreeValue,
      totalMonthlyOperatingCost,
      totalOperatingCostLease,
      netLeaseValue,
      netEffectiveRentMonthly,
      netEffectiveRentAnnual,
    ].every(Number.isFinite)
  ) {
    return null;
  }

  return {
    grossLeaseValue,
    rentFreeValue,
    totalMonthlyOperatingCost,
    totalOperatingCostLease,
    netLeaseValue,
    netEffectiveRentMonthly,
    netEffectiveRentAnnual,
  };
}
