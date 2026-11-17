import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { BalloonCompoundingMethod } from './types';
import { COMPOUNDING_METHOD_OPTIONS } from './types';

export function formatBalloonMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function getCompoundingPeriodsPerYear(
  method: BalloonCompoundingMethod
): number {
  const option = COMPOUNDING_METHOD_OPTIONS.find((row) => row.value === method);
  return option?.periodsPerYear ?? 12;
}

/**
 * Effective monthly rate from nominal annual percent and compounding frequency:
 * r = (1 + i/m)^(m/12) − 1  (m = compounding periods/year).
 * Uses expm1/log1p for numerical stability.
 */
export function computeEffectiveMonthlyRate(
  annualInterestRatePercent: number,
  compoundingMethod: BalloonCompoundingMethod
): number {
  if (annualInterestRatePercent <= 0) return 0;
  const nominal = annualInterestRatePercent / 100;
  const m = getCompoundingPeriodsPerYear(compoundingMethod);
  if (m === 12) return nominal / 12;
  return Math.expm1((m / 12) * Math.log1p(nominal / m));
}

/** Total months = years × 12 + months (months 0–11). */
export function durationToMonths(years: number, months: number): number | null {
  if (![years, months].every(Number.isFinite)) return null;
  if (years < 0 || months < 0 || months > 11) return null;
  const total = Math.round(years * 12 + months);
  return Number.isFinite(total) ? total : null;
}

export function balloonAfterToMonths(
  value: number,
  unit: 'yrs' | 'mos'
): number | null {
  if (!Number.isFinite(value) || value < 0) return null;
  if (unit === 'yrs') {
    const months = Math.round(value * 12);
    return Number.isFinite(months) ? months : null;
  }
  const months = Math.round(value);
  return Number.isFinite(months) ? months : null;
}

/**
 * M = P × r / (1 − (1+r)^(-N)) when r > 0; M = P / N when r = 0.
 */
export function calculateMonthlyPayment(
  principal: number,
  monthlyRate: number,
  amortMonths: number
): number | null {
  if (![principal, monthlyRate, amortMonths].every(Number.isFinite)) return null;
  if (!(principal > 0) || !(amortMonths > 0) || monthlyRate < 0) return null;

  if (monthlyRate === 0) {
    const m = principal / amortMonths;
    return Number.isFinite(m) ? m : null;
  }

  const growth = Math.pow(1 + monthlyRate, amortMonths);
  if (!Number.isFinite(growth) || growth === 0) return null;
  const m = (principal * monthlyRate) / (1 - 1 / growth);
  return Number.isFinite(m) ? m : null;
}

/**
 * Balloon remaining after K payments on an N-month amortization:
 * B = P(1+r)^K − M × ((1+r)^K − 1) / r
 * Zero r: B = P − M×K
 * When K = N, balloon ≈ 0.
 */
export function calculateBalloonAmount(input: {
  principal: number;
  monthlyRate: number;
  amortMonths: number;
  balloonMonths: number;
  monthlyPayment: number;
}): number | null {
  const { principal, monthlyRate, amortMonths, balloonMonths, monthlyPayment } =
    input;

  if (
    ![principal, monthlyRate, amortMonths, balloonMonths, monthlyPayment].every(
      Number.isFinite
    )
  ) {
    return null;
  }
  if (!(principal > 0) || !(amortMonths > 0) || monthlyRate < 0) return null;
  if (!(balloonMonths > 0) || balloonMonths > amortMonths) return null;
  if (!(monthlyPayment >= 0)) return null;

  if (balloonMonths === amortMonths) return 0;

  let balloon: number;
  if (monthlyRate === 0) {
    balloon = principal - monthlyPayment * balloonMonths;
  } else {
    const growth = Math.pow(1 + monthlyRate, balloonMonths);
    if (!Number.isFinite(growth)) return null;
    balloon =
      principal * growth - monthlyPayment * ((growth - 1) / monthlyRate);
  }

  if (!Number.isFinite(balloon)) return null;
  if (Math.abs(balloon) < 1e-9) return 0;
  if (balloon < 0) return 0;
  return balloon;
}

/**
 * Pure engine in the loan currency (full precision; round only for display).
 */
export function calculateBalloonPayment(input: {
  loanAmount: number;
  annualInterestRatePercent: number;
  amortYears: number;
  amortMonths: number;
  balloonAfter: number;
  balloonAfterUnit: 'yrs' | 'mos';
  compoundingMethod: BalloonCompoundingMethod;
}): {
  monthlyPayment: number;
  balloonPayment: number;
  totalMonthlyPayments: number;
  totalRepayment: number;
  totalInterest: number;
  balloonAfterMonths: number;
  amortMonthsTotal: number;
} | null {
  const amortMonthsTotal = durationToMonths(
    input.amortYears,
    input.amortMonths
  );
  const balloonAfterMonths = balloonAfterToMonths(
    input.balloonAfter,
    input.balloonAfterUnit
  );
  if (amortMonthsTotal === null || balloonAfterMonths === null) return null;
  if (!(amortMonthsTotal > 0)) return null;
  if (!(balloonAfterMonths > 0) || balloonAfterMonths > amortMonthsTotal) {
    return null;
  }
  if (!(input.loanAmount > 0)) return null;
  if (!(input.annualInterestRatePercent >= 0)) return null;

  const monthlyRate = computeEffectiveMonthlyRate(
    input.annualInterestRatePercent,
    input.compoundingMethod
  );
  if (!Number.isFinite(monthlyRate) || monthlyRate < 0) return null;

  const monthlyPayment = calculateMonthlyPayment(
    input.loanAmount,
    monthlyRate,
    amortMonthsTotal
  );
  if (monthlyPayment === null) return null;

  const balloonPayment = calculateBalloonAmount({
    principal: input.loanAmount,
    monthlyRate,
    amortMonths: amortMonthsTotal,
    balloonMonths: balloonAfterMonths,
    monthlyPayment,
  });
  if (balloonPayment === null) return null;

  const totalMonthlyPayments = monthlyPayment * balloonAfterMonths;
  if (!Number.isFinite(totalMonthlyPayments)) return null;

  const totalRepayment = totalMonthlyPayments + balloonPayment;
  if (!Number.isFinite(totalRepayment)) return null;

  const totalInterest = totalRepayment - input.loanAmount;
  if (!Number.isFinite(totalInterest)) return null;

  return {
    monthlyPayment,
    balloonPayment,
    totalMonthlyPayments,
    totalRepayment,
    totalInterest,
    balloonAfterMonths,
    amortMonthsTotal,
  };
}
