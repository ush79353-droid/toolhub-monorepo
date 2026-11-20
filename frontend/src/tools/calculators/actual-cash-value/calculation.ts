import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { TimeUnit } from './types';

export function convertYearsToMonths(years: number): number {
  return years * 12;
}

export function convertMonthsToYears(months: number): number {
  return months / 12;
}

/** Preserve physical duration when switching years ↔ months. */
export function convertTimeUnitDisplay(
  value: number,
  from: TimeUnit,
  to: TimeUnit
): number {
  if (!Number.isFinite(value) || from === to) return value;
  return from === 'years'
    ? convertYearsToMonths(value)
    : convertMonthsToYears(value);
}

export function toMonths(value: number, unit: TimeUnit): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  const months = unit === 'years' ? convertYearsToMonths(value) : value;
  return Number.isFinite(months) ? months : null;
}

/**
 * ACV = P × max(0, 1 − A/L) using consistent time units.
 * Floors at zero when age ≥ expected life.
 */
export function calculateActualCashValue(
  purchasePrice: number,
  expectedLife: number,
  currentAge: number
): number | null {
  if (
    !Number.isFinite(purchasePrice) ||
    purchasePrice < 0 ||
    !Number.isFinite(expectedLife) ||
    expectedLife <= 0 ||
    !Number.isFinite(currentAge) ||
    currentAge < 0
  ) {
    return null;
  }
  const remainingFraction = Math.max(0, 1 - currentAge / expectedLife);
  const acv = purchasePrice * remainingFraction;
  return Number.isFinite(acv) ? Math.max(0, acv) : null;
}

export function calculateAnnualDepreciation(
  purchasePrice: number,
  expectedLifeYears: number
): number | null {
  if (
    !Number.isFinite(purchasePrice) ||
    purchasePrice < 0 ||
    !Number.isFinite(expectedLifeYears) ||
    expectedLifeYears <= 0
  ) {
    return null;
  }
  const annual = purchasePrice / expectedLifeYears;
  return Number.isFinite(annual) ? annual : null;
}

export function calculateMonthlyDepreciation(
  purchasePrice: number,
  expectedLifeMonths: number
): number | null {
  if (
    !Number.isFinite(purchasePrice) ||
    purchasePrice < 0 ||
    !Number.isFinite(expectedLifeMonths) ||
    expectedLifeMonths <= 0
  ) {
    return null;
  }
  const monthly = purchasePrice / expectedLifeMonths;
  return Number.isFinite(monthly) ? monthly : null;
}

export function calculateAccumulatedDepreciation(
  purchasePrice: number,
  actualCashValue: number
): number | null {
  if (
    !Number.isFinite(purchasePrice) ||
    purchasePrice < 0 ||
    !Number.isFinite(actualCashValue) ||
    actualCashValue < 0
  ) {
    return null;
  }
  const accumulated = Math.min(purchasePrice, purchasePrice - actualCashValue);
  return Number.isFinite(accumulated) ? Math.max(0, accumulated) : null;
}

export function calculateDepreciationPercentage(
  currentAge: number,
  expectedLife: number
): number | null {
  if (
    !Number.isFinite(currentAge) ||
    currentAge < 0 ||
    !Number.isFinite(expectedLife) ||
    expectedLife <= 0
  ) {
    return null;
  }
  const pct = Math.min(100, (currentAge / expectedLife) * 100);
  return Number.isFinite(pct) ? pct : null;
}

export function calculateRemainingValuePercentage(
  depreciationPercentage: number
): number | null {
  if (
    !Number.isFinite(depreciationPercentage) ||
    depreciationPercentage < 0 ||
    depreciationPercentage > 100
  ) {
    return null;
  }
  return 100 - depreciationPercentage;
}

export function calculateRemainingUsefulLife(
  expectedLife: number,
  currentAge: number
): number | null {
  if (
    !Number.isFinite(expectedLife) ||
    expectedLife <= 0 ||
    !Number.isFinite(currentAge) ||
    currentAge < 0
  ) {
    return null;
  }
  return Math.max(0, expectedLife - currentAge);
}

export function formatRemainingLifeLabel(months: number): string {
  if (!Number.isFinite(months) || months < 0) return '';
  if (months === 0) return '0 years';
  if (months % 12 === 0) {
    const years = months / 12;
    return `${years} ${years === 1 ? 'year' : 'years'}`;
  }
  if (months < 12) {
    return `${months} ${months === 1 ? 'month' : 'months'}`;
  }
  const years = Math.floor(months / 12);
  const rem = months - years * 12;
  const yearPart = `${years} ${years === 1 ? 'year' : 'years'}`;
  if (rem === 0) return yearPart;
  // Decimal months possible — show years with 2 dp when fractional.
  if (!Number.isInteger(months)) {
    return `${(months / 12).toFixed(2)} years`;
  }
  return `${yearPart}, ${rem} ${rem === 1 ? 'month' : 'months'}`;
}

export function formatAcvMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatAcvPercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
