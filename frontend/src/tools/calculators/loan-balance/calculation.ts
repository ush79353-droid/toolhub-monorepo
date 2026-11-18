import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { LoanBalanceResult } from './types';

export function formatLoanBalanceAmount(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Total months = years × 12 + months (months 0–11). */
export function durationToMonths(years: number, months: number): number | null {
  if (![years, months].every(Number.isFinite)) return null;
  if (years < 0 || months < 0 || months > 11) return null;
  const total = Math.round(years * 12 + months);
  return Number.isFinite(total) ? total : null;
}

/**
 * Standard monthly payment for a fixed-rate amortizing loan.
 * M = P × r / (1 − (1+r)^(-n)) when r > 0; M = P / n when r = 0.
 */
export function calculateMonthlyPayment(
  principal: number,
  monthlyRate: number,
  termMonths: number
): number | null {
  if (![principal, monthlyRate, termMonths].every(Number.isFinite)) return null;
  if (!(principal > 0) || !(termMonths > 0) || monthlyRate < 0) return null;

  if (monthlyRate === 0) {
    const m = principal / termMonths;
    return Number.isFinite(m) ? m : null;
  }

  const growth = Math.pow(1 + monthlyRate, termMonths);
  if (!Number.isFinite(growth) || growth === 0) return null;
  const m = (principal * monthlyRate) / (1 - 1 / growth);
  return Number.isFinite(m) ? m : null;
}

/**
 * Remaining balance after k scheduled end-of-month payments.
 * Nonzero r: B = P(1+r)^k − M(((1+r)^k − 1) / r)
 * Zero r: B = P(1 − k/n)
 * Clamps tiny float residue and never returns a negative balance.
 */
export function calculateRemainingBalance(input: {
  principal: number;
  monthlyRate: number;
  termMonths: number;
  elapsedMonths: number;
  monthlyPayment: number;
}): number | null {
  const { principal, monthlyRate, termMonths, elapsedMonths, monthlyPayment } = input;

  if (
    ![principal, monthlyRate, termMonths, elapsedMonths, monthlyPayment].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(principal > 0) || !(termMonths > 0) || monthlyRate < 0) return null;
  if (elapsedMonths < 0 || !(monthlyPayment >= 0)) return null;

  if (elapsedMonths === 0) return principal;
  if (elapsedMonths >= termMonths) return 0;

  let balance: number;
  if (monthlyRate === 0) {
    balance = principal * (1 - elapsedMonths / termMonths);
  } else {
    const growth = Math.pow(1 + monthlyRate, elapsedMonths);
    if (!Number.isFinite(growth)) return null;
    balance =
      principal * growth - monthlyPayment * ((growth - 1) / monthlyRate);
  }

  if (!Number.isFinite(balance)) return null;
  // Clamp float noise near zero; never show a negative outstanding principal.
  if (Math.abs(balance) < 1e-9) return 0;
  if (balance < 0) return 0;
  return balance;
}

/**
 * Pure engine: remaining balance in the loan principal's currency (full precision).
 */
export function calculateLoanBalanceInLoanCurrency(input: {
  loanAmount: number;
  interestRatePercent: number;
  termYears: number;
  termMonths: number;
  periodYears: number;
  periodMonths: number;
}): {
  loanRemaining: number;
  monthlyPayment: number;
  termMonthsTotal: number;
  elapsedMonths: number;
} | null {
  const termMonthsTotal = durationToMonths(input.termYears, input.termMonths);
  const elapsedMonths = durationToMonths(input.periodYears, input.periodMonths);
  if (termMonthsTotal === null || elapsedMonths === null) return null;
  if (!(termMonthsTotal > 0)) return null;
  if (elapsedMonths < 0) return null;
  if (elapsedMonths > termMonthsTotal) return null;

  if (!(input.loanAmount > 0)) return null;
  if (!(input.interestRatePercent >= 0)) return null;

  const monthlyRate = input.interestRatePercent / 100 / 12;
  if (!Number.isFinite(monthlyRate)) return null;

  const monthlyPayment = calculateMonthlyPayment(
    input.loanAmount,
    monthlyRate,
    termMonthsTotal
  );
  if (monthlyPayment === null) return null;

  const loanRemaining = calculateRemainingBalance({
    principal: input.loanAmount,
    monthlyRate,
    termMonths: termMonthsTotal,
    elapsedMonths,
    monthlyPayment,
  });
  if (loanRemaining === null) return null;

  return {
    loanRemaining,
    monthlyPayment,
    termMonthsTotal,
    elapsedMonths,
  };
}

export function buildLoanBalanceResult(input: {
  loanRemainingInLoanCurrency: number;
  loanRemainingInResultCurrency: number;
  monthlyPayment: number;
  termMonthsTotal: number;
  elapsedMonths: number;
  loanCurrency: SupportedCurrency;
  resultCurrency: SupportedCurrency;
}): LoanBalanceResult {
  return {
    loanRemaining: input.loanRemainingInResultCurrency,
    loanRemainingInLoanCurrency: input.loanRemainingInLoanCurrency,
    monthlyPayment: input.monthlyPayment,
    termMonthsTotal: input.termMonthsTotal,
    elapsedMonths: input.elapsedMonths,
    currency: input.resultCurrency,
    loanCurrency: input.loanCurrency,
    formattedLoanRemaining: formatLoanBalanceAmount(
      input.loanRemainingInResultCurrency,
      input.resultCurrency
    ),
  };
}
