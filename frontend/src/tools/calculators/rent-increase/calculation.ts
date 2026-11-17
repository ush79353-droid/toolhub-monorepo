import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatRentIncreaseMoney(
  amount: number,
  currency: SupportedCurrency
): string {
  const digits = Math.max(2, getCurrencyFractionDigits(currency));
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount);
}

/**
 * Future Annual Rent = Current Annual Rent × (1 + Annual Change / 100)^Years
 *
 * Full IEEE precision; never NaN/Infinity. Zero years → future equals current.
 * Growth may be zero or negative (≥ −100%). Percent and years are never FX-converted.
 */
export function calculateRentIncrease(input: {
  currentAnnualRent: number;
  averageRentChangePercent: number;
  numberOfYears: number;
}): number | null {
  const { currentAnnualRent, averageRentChangePercent, numberOfYears } = input;

  if (
    ![currentAnnualRent, averageRentChangePercent, numberOfYears].every(Number.isFinite)
  ) {
    return null;
  }
  if (currentAnnualRent < 0 || numberOfYears < 0) return null;
  if (!(averageRentChangePercent >= -100)) return null;

  if (numberOfYears === 0) {
    return currentAnnualRent;
  }

  const growthFactor = 1 + averageRentChangePercent / 100;
  if (!(growthFactor >= 0) || !Number.isFinite(growthFactor)) return null;

  const future = currentAnnualRent * growthFactor ** numberOfYears;
  return Number.isFinite(future) ? future : null;
}
