import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

/** Simple payday APR uses a 365-day year (not APY, not 360-day broker convention). */
export const PAYDAY_LOAN_DAY_BASIS = 365;

export function formatPaydayMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function formatPaydayPercent(value: number): string {
  const rounded = Number(value.toFixed(4));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

/**
 * Simple annualized payday APR (%):
 * APR = (F / P) × (365 / d) × 100
 * Example: P=1000, F=150, d=14 → 391.0714…%
 */
export function calculatePaydayAprPercent(
  loanAmount: number,
  financeCharge: number,
  loanTermDays: number
): number | null {
  if (![loanAmount, financeCharge, loanTermDays].every(Number.isFinite)) return null;
  if (!(loanAmount > 0) || !(loanTermDays > 0)) return null;
  if (financeCharge < 0) return null;
  const apr =
    (financeCharge / loanAmount) * (PAYDAY_LOAN_DAY_BASIS / loanTermDays) * 100;
  return Number.isFinite(apr) ? apr : null;
}

/**
 * Finance charge implied by APR over the term:
 * F = P × (APR / 100) × (d / 365)
 */
export function calculateFinanceChargeFromApr(
  loanAmount: number,
  aprPercent: number,
  loanTermDays: number
): number | null {
  if (![loanAmount, aprPercent, loanTermDays].every(Number.isFinite)) return null;
  if (!(loanAmount > 0) || !(loanTermDays > 0)) return null;
  if (aprPercent < 0) return null;
  const charge =
    loanAmount * (aprPercent / 100) * (loanTermDays / PAYDAY_LOAN_DAY_BASIS);
  return Number.isFinite(charge) ? charge : null;
}

/**
 * APR Amount = annualized monetary finance charge:
 * F × (365 / d)
 * Not added again into total debt (it re-expresses F).
 */
export function calculateAprAmount(
  financeCharge: number,
  loanTermDays: number
): number | null {
  if (![financeCharge, loanTermDays].every(Number.isFinite)) return null;
  if (!(loanTermDays > 0) || financeCharge < 0) return null;
  const amount = financeCharge * (PAYDAY_LOAN_DAY_BASIS / loanTermDays);
  return Number.isFinite(amount) ? amount : null;
}

/**
 * Limited assumption (reference omitted period treatment):
 * one monthly-fee assessment = P × (q / 100), added once to total debt.
 * Not prorated by loan days; not compounded.
 */
export function calculateMonthlyFeeAmount(
  loanAmount: number,
  monthlyFeePercent: number
): number | null {
  if (![loanAmount, monthlyFeePercent].every(Number.isFinite)) return null;
  if (!(loanAmount > 0) || monthlyFeePercent < 0) return null;
  const fee = loanAmount * (monthlyFeePercent / 100);
  return Number.isFinite(fee) ? fee : null;
}

/**
 * Total debt = principal + term finance charge + one monthly-fee assessment.
 * APR Amount is excluded (annualized view of F only).
 */
export function calculateTotalDebt(
  loanAmount: number,
  financeCharge: number,
  monthlyFee: number
): number | null {
  if (![loanAmount, financeCharge, monthlyFee].every(Number.isFinite)) return null;
  if (loanAmount < 0 || financeCharge < 0 || monthlyFee < 0) return null;
  const total = loanAmount + financeCharge + monthlyFee;
  return Number.isFinite(total) ? total : null;
}
