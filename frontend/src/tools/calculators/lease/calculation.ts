/**
 * Fixed-rate lease with residual buyout.
 *
 * i = APR / 1200
 * n = term in months
 * PMT = [(P − D) − R/(1+i)^n] × i / [1 − (1+i)^(−n)]
 * When i = 0: PMT = (P − D − R) / n
 *
 * Total payments = D + PMT × n
 * Total interest = total payments + R − P
 * Total cost to own = total payments + R
 *
 * Amounts must already share one currency. Round only for display.
 */

import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { TermUnit } from './types';

export function formatLeaseMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/** Normalize lease term into monthly payment count. */
export function termToMonthCount(term: number, unit: TermUnit): number | null {
  if (!Number.isFinite(term) || !(term > 0)) return null;
  const months = unit === 'yrs' ? term * 12 : term;
  if (!Number.isFinite(months) || !(months > 0)) return null;
  return months;
}

export interface LeaseNumericInput {
  productValue: number;
  residualValue: number;
  downPayment: number;
  annualRatePercent: number;
  paymentCount: number;
}

export interface LeaseComputation {
  monthlyPayment: number;
  totalLeaseInstallments: number;
  totalPayments: number;
  totalInterest: number;
  totalCostToOwn: number;
}

/**
 * Solve the present-value lease equation for monthly payment.
 * Rejects non-finite inputs, non-positive product/term, negative money/rate,
 * residual or down payment above product value, and negative payments.
 */
export function calculateLease(input: LeaseNumericInput): LeaseComputation | null {
  const {
    productValue: P,
    residualValue: R,
    downPayment: D,
    annualRatePercent,
    paymentCount: n,
  } = input;

  if (![P, R, D, annualRatePercent, n].every(Number.isFinite)) return null;
  if (!(P > 0) || !(n > 0) || annualRatePercent < 0) return null;
  if (R < 0 || D < 0) return null;
  if (R > P || D > P) return null;

  const i = annualRatePercent / 1200;
  let monthlyPayment: number;

  if (i === 0) {
    monthlyPayment = (P - D - R) / n;
  } else {
    const discount = Math.pow(1 + i, -n);
    if (!Number.isFinite(discount)) return null;
    const denom = 1 - discount;
    if (!(denom > 0)) return null;
    const financed = P - D - R * discount;
    monthlyPayment = (financed * i) / denom;
  }

  if (!Number.isFinite(monthlyPayment) || monthlyPayment < 0) return null;

  const totalLeaseInstallments = monthlyPayment * n;
  if (!Number.isFinite(totalLeaseInstallments)) return null;

  const totalPayments = D + totalLeaseInstallments;
  if (!Number.isFinite(totalPayments)) return null;

  const totalInterest = totalPayments + R - P;
  if (!Number.isFinite(totalInterest)) return null;

  const totalCostToOwn = totalPayments + R;
  if (!Number.isFinite(totalCostToOwn)) return null;

  return {
    monthlyPayment,
    totalLeaseInstallments,
    totalPayments,
    totalInterest,
    totalCostToOwn,
  };
}
