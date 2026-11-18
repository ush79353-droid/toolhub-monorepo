import type { RentPeriod } from './types';

/** Convert a rental income amount into an annual figure. */
export function toAnnualRentalIncome(
  amount: number,
  period: RentPeriod
): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  switch (period) {
    case 'mo':
      return amount * 12;
    case 'yr':
      return amount;
    default:
      return null;
  }
}

/** Re-express an annual rental amount in another rent period. */
export function fromAnnualRentalIncome(
  annual: number,
  period: RentPeriod
): number | null {
  if (!Number.isFinite(annual) || annual < 0) return null;
  switch (period) {
    case 'mo':
      return annual / 12;
    case 'yr':
      return annual;
    default:
      return null;
  }
}

/**
 * GRM = property price / annual gross rental income.
 * Both money amounts must already share one currency.
 */
export function calculateGrossRentMultiplier(input: {
  propertyPrice: number;
  annualGrossRentalIncome: number;
}): number | null {
  const { propertyPrice, annualGrossRentalIncome } = input;
  if (![propertyPrice, annualGrossRentalIncome].every(Number.isFinite)) return null;
  if (propertyPrice < 0) return null;
  if (!(annualGrossRentalIncome > 0)) return null;

  const grm = propertyPrice / annualGrossRentalIncome;
  return Number.isFinite(grm) ? grm : null;
}

export function formatGrossRentMultiplier(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
