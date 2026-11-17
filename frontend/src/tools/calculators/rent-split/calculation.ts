import {
  getCurrencyFractionDigits,
  type SupportedCurrency,
} from '@/tools/shared/currency';

export function formatRentSplitMoney(
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
 * Split total rent equally across all people; each bedroom pays
 * (peopleInBedroom / totalPeople) × totalRent.
 * Returns null when totalPeople = 0 or inputs are non-finite.
 */
export function calculateRentSplit(input: {
  totalRent: number;
  peoplePerBedroom: readonly number[];
}): {
  totalPeople: number;
  perPersonRent: number;
  bedroomShares: number[];
} | null {
  const { totalRent, peoplePerBedroom } = input;
  if (!Number.isFinite(totalRent) || totalRent < 0) return null;
  if (peoplePerBedroom.length < 1) return null;
  if (peoplePerBedroom.some((n) => !Number.isFinite(n) || n < 0 || !Number.isInteger(n))) {
    return null;
  }

  const totalPeople = peoplePerBedroom.reduce((sum, n) => sum + n, 0);
  if (!(totalPeople > 0)) return null;

  const perPersonRent = totalRent / totalPeople;
  const bedroomShares = peoplePerBedroom.map(
    (people) => (people / totalPeople) * totalRent
  );

  if (
    !Number.isFinite(perPersonRent) ||
    bedroomShares.some((share) => !Number.isFinite(share))
  ) {
    return null;
  }

  return { totalPeople, perPersonRent, bedroomShares };
}
