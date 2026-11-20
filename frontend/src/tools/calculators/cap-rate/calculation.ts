import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { IncomePeriod } from './types';

/** Normalize rental (or other) income to an annual amount. */
export function toAnnualIncome(
  amount: number,
  period: IncomePeriod
): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  return period === 'monthly' ? amount * 12 : amount;
}

/** Preserve annual economic value when switching period presentation. */
export function convertIncomePeriodDisplay(
  amount: number,
  from: IncomePeriod,
  to: IncomePeriod
): number {
  if (!Number.isFinite(amount) || from === to) return amount;
  const annual = from === 'monthly' ? amount * 12 : amount;
  return to === 'monthly' ? annual / 12 : annual;
}

export function calculatePotentialGrossIncome(
  annualGrossRental: number,
  annualOtherIncome: number
): number | null {
  if (
    !Number.isFinite(annualGrossRental) ||
    !Number.isFinite(annualOtherIncome) ||
    annualGrossRental < 0 ||
    annualOtherIncome < 0
  ) {
    return null;
  }
  const pgi = annualGrossRental + annualOtherIncome;
  return Number.isFinite(pgi) ? pgi : null;
}

export function calculateVacancyLoss(
  potentialGrossIncome: number,
  vacancyRatePercent: number
): number | null {
  if (
    !Number.isFinite(potentialGrossIncome) ||
    !Number.isFinite(vacancyRatePercent) ||
    potentialGrossIncome < 0 ||
    vacancyRatePercent < 0 ||
    vacancyRatePercent > 100
  ) {
    return null;
  }
  const loss = potentialGrossIncome * (vacancyRatePercent / 100);
  return Number.isFinite(loss) ? loss : null;
}

export function calculateEffectiveGrossIncome(
  potentialGrossIncome: number,
  vacancyLoss: number
): number | null {
  if (
    !Number.isFinite(potentialGrossIncome) ||
    !Number.isFinite(vacancyLoss)
  ) {
    return null;
  }
  const egi = potentialGrossIncome - vacancyLoss;
  return Number.isFinite(egi) ? egi : null;
}

/**
 * NOI = Effective Gross Income − Operating Expenses.
 * Negative NOI is returned as-is (not clamped to zero).
 */
export function calculateNoi(
  effectiveGrossIncome: number,
  operatingExpenses: number
): number | null {
  if (
    !Number.isFinite(effectiveGrossIncome) ||
    !Number.isFinite(operatingExpenses) ||
    operatingExpenses < 0
  ) {
    return null;
  }
  const noi = effectiveGrossIncome - operatingExpenses;
  return Number.isFinite(noi) ? noi : null;
}

/**
 * Cap Rate (%) = (NOI / Property Value) × 100.
 * Property value must be > 0. Zero NOI → 0%. Negative NOI → negative rate.
 */
export function calculateCapRate(
  noi: number,
  propertyValue: number
): number | null {
  if (!Number.isFinite(noi) || !Number.isFinite(propertyValue)) return null;
  if (propertyValue <= 0) return null;
  const rate = (noi / propertyValue) * 100;
  return Number.isFinite(rate) ? rate : null;
}

/**
 * Property Value = NOI / (Cap Rate / 100).
 * Cap rate must be > 0 (standard valuation mode).
 */
export function calculatePropertyValueFromCapRate(
  noi: number,
  capRatePercent: number
): number | null {
  if (!Number.isFinite(noi) || !Number.isFinite(capRatePercent)) return null;
  if (capRatePercent <= 0) return null;
  const value = noi / (capRatePercent / 100);
  return Number.isFinite(value) ? value : null;
}

/** Required NOI = Property Value × (Target Cap Rate / 100). */
export function calculateRequiredNoi(
  propertyValue: number,
  targetCapRatePercent: number
): number | null {
  if (
    !Number.isFinite(propertyValue) ||
    !Number.isFinite(targetCapRatePercent) ||
    propertyValue < 0 ||
    targetCapRatePercent < 0
  ) {
    return null;
  }
  const noi = propertyValue * (targetCapRatePercent / 100);
  return Number.isFinite(noi) ? noi : null;
}

/**
 * Operating Expense Ratio (%) = (OpEx / EGI) × 100.
 * Unavailable when EGI is zero.
 */
export function calculateOperatingExpenseRatio(
  operatingExpenses: number,
  effectiveGrossIncome: number
): number | null {
  if (
    !Number.isFinite(operatingExpenses) ||
    !Number.isFinite(effectiveGrossIncome) ||
    operatingExpenses < 0
  ) {
    return null;
  }
  if (effectiveGrossIncome === 0) return null;
  const ratio = (operatingExpenses / effectiveGrossIncome) * 100;
  return Number.isFinite(ratio) ? ratio : null;
}

export function formatCapRateMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatCapRatePercent(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
