import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export const TIME_AND_HALF_MULTIPLIER = 1.5;
export const DOUBLE_TIME_MULTIPLIER = 2;
export const TRIPLE_TIME_MULTIPLIER = 3;

/**
 * Category overtime pay from a standard hourly rate and user-entered hours.
 *
 * Rates: 1.5× / 2× / 3× standard. Hours are never auto-classified.
 * Full precision; no display rounding inside the formulas.
 */
export function calculateTimeAndAHalf(input: {
  standardRate: number;
  standardHours: number;
  timeAndHalfHours: number;
  doubleTimeHours: number;
  tripleTimeHours: number;
}): {
  timeAndHalfRate: number;
  doubleTimeRate: number;
  tripleTimeRate: number;
  standardPay: number;
  timeAndHalfPay: number;
  doubleTimePay: number;
  tripleTimePay: number;
  totalPay: number;
} | null {
  const {
    standardRate,
    standardHours,
    timeAndHalfHours,
    doubleTimeHours,
    tripleTimeHours,
  } = input;

  const values = [
    standardRate,
    standardHours,
    timeAndHalfHours,
    doubleTimeHours,
    tripleTimeHours,
  ];
  if (!values.every(Number.isFinite)) return null;
  if (values.some((v) => v < 0)) return null;

  const timeAndHalfRate = standardRate * TIME_AND_HALF_MULTIPLIER;
  const doubleTimeRate = standardRate * DOUBLE_TIME_MULTIPLIER;
  const tripleTimeRate = standardRate * TRIPLE_TIME_MULTIPLIER;

  const standardPay = standardRate * standardHours;
  const timeAndHalfPay = timeAndHalfRate * timeAndHalfHours;
  const doubleTimePay = doubleTimeRate * doubleTimeHours;
  const tripleTimePay = tripleTimeRate * tripleTimeHours;
  const totalPay =
    standardPay + timeAndHalfPay + doubleTimePay + tripleTimePay;

  const out = [
    timeAndHalfRate,
    doubleTimeRate,
    tripleTimeRate,
    standardPay,
    timeAndHalfPay,
    doubleTimePay,
    tripleTimePay,
    totalPay,
  ];
  if (!out.every(Number.isFinite)) return null;
  if (out.some((v) => v < 0)) return null;

  return {
    timeAndHalfRate,
    doubleTimeRate,
    tripleTimeRate,
    standardPay,
    timeAndHalfPay,
    doubleTimePay,
    tripleTimePay,
    totalPay,
  };
}

/** Display rounding only — never used inside the formulas. */
export function formatTimeAndAHalfMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}
