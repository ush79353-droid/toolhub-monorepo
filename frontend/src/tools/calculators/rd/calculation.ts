/**
 * RD Calculator — Recurring Deposit pure engine (ADR-018).
 *
 * Bank-style Indian/Pakistani RD convention (documented):
 *   monthly deposits, quarterly compounding
 *   i = r / 400          (quarterly rate from annual % r)
 *   n = months / 3       (number of quarters; months must be a multiple of 3
 *                         when using the closed form — we accept fractional
 *                         years via months = round(years×12) and require months ≥ 1)
 *   M = R × [(1+i)^n − 1] / [1 − (1+i)^(−1/3)]   when i ≠ 0
 *   M = R × months                               when i = 0
 *
 * Total deposits = R × months
 * Total interest = M − total deposits
 *
 * Deposit timing: end-of-month contributions; interest compounds quarterly.
 * This is not simple interest and not SIP monthly compounding.
 */

import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';
import type { RdTermUnit } from './types';

export const RD_COMPOUNDING_NOTE =
  'Bank-style RD: monthly deposits with quarterly compounding (i = r/400). Interest is not simple interest.';

export function termToMonths(term: number, unit: RdTermUnit): number | null {
  if (!Number.isFinite(term) || !(term > 0)) return null;
  const months = unit === 'years' ? term * 12 : term;
  if (!Number.isFinite(months) || !(months > 0)) return null;
  // Allow fractional months from fractional years; closed-form uses n = months/3.
  return months;
}

export function calculateRecurringDeposit(input: {
  monthlyDeposit: number;
  term: number;
  termUnit: RdTermUnit;
  annualRatePercent: number;
}): {
  months: number;
  quarters: number;
  totalDeposits: number;
  maturityAmount: number;
  totalInterest: number;
} | null {
  const { monthlyDeposit, term, termUnit, annualRatePercent } = input;
  if (
    ![monthlyDeposit, term, annualRatePercent].every(Number.isFinite) ||
    monthlyDeposit < 0 ||
    annualRatePercent < 0
  ) {
    return null;
  }

  const months = termToMonths(term, termUnit);
  if (months == null) return null;

  const totalDeposits = monthlyDeposit * months;
  if (!Number.isFinite(totalDeposits)) return null;

  const quarters = months / 3;
  if (!Number.isFinite(quarters) || !(quarters > 0)) return null;

  let maturityAmount: number;
  if (annualRatePercent === 0) {
    maturityAmount = totalDeposits;
  } else {
    const i = annualRatePercent / 400;
    if (!(i > 0) || !Number.isFinite(i)) return null;
    const growth = Math.pow(1 + i, quarters);
    const cubeRootFactor = Math.pow(1 + i, -1 / 3);
    if (!Number.isFinite(growth) || !Number.isFinite(cubeRootFactor)) return null;
    const denom = 1 - cubeRootFactor;
    if (!(Math.abs(denom) > 0)) return null;
    maturityAmount = monthlyDeposit * ((growth - 1) / denom);
  }

  if (!Number.isFinite(maturityAmount) || maturityAmount < 0) return null;
  const totalInterest = maturityAmount - totalDeposits;
  if (!Number.isFinite(totalInterest)) return null;

  return {
    months,
    quarters,
    totalDeposits,
    maturityAmount,
    totalInterest,
  };
}

export function formatRdMoney(
  amount: number,
  currency: SupportedCurrency,
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

export function buildRdFormulaBreakdown(input: {
  monthlyDeposit: number;
  months: number;
  quarters: number;
  annualRatePercent: number;
  maturityAmount: number;
  totalDeposits: number;
  totalInterest: number;
}): string {
  const { monthlyDeposit, months, quarters, annualRatePercent, maturityAmount, totalDeposits, totalInterest } =
    input;
  if (annualRatePercent === 0) {
    return [
      'r = 0% → maturity = total deposits',
      `Total deposits = ${monthlyDeposit} × ${months} = ${totalDeposits}`,
      `Maturity = ${maturityAmount}`,
      `Interest = ${totalInterest}`,
    ].join('\n');
  }
  return [
    'Quarterly rate i = r / 400',
    `i = ${annualRatePercent} / 400 = ${annualRatePercent / 400}`,
    `Quarters n = months / 3 = ${months} / 3 = ${quarters}`,
    'M = R × [(1+i)^n − 1] / [1 − (1+i)^(−1/3)]',
    `M ≈ ${maturityAmount}`,
    `Total deposits = R × months = ${totalDeposits}`,
    `Interest = M − deposits ≈ ${totalInterest}`,
  ].join('\n');
}
