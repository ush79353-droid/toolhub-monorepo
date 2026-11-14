import type {
  SoftwareContractValueInput,
  SoftwareContractValueResult,
} from './types';

export function roundMoney(value: number): number {
  if (!Number.isFinite(value)) return Number.NaN;
  return Math.round(value * 100) / 100;
}

export function contractMonthsFromDuration(years: number, months: number): number {
  return years * 12 + months;
}

/**
 * Retail price is the monthly list price per seat.
 * Discount Amount = Retail × Discount%
 * Discounted Price = Retail − Discount Amount
 * Monthly Cost = Discounted Price × Seats
 * Annual Cost = Monthly Cost × 12
 * Contract Value = Monthly Cost × ((Years × 12) + Months)
 */
export function calculateSoftwareContractValue(
  input: SoftwareContractValueInput,
): SoftwareContractValueResult | null {
  const {
    retailPrice,
    seats,
    discountPercent,
    durationYears,
    durationMonths,
  } = input;

  if (
    retailPrice === null ||
    seats === null ||
    discountPercent === null ||
    durationYears === null ||
    durationMonths === null
  ) {
    return null;
  }

  if (
    !Number.isFinite(retailPrice) ||
    !Number.isFinite(seats) ||
    !Number.isFinite(discountPercent) ||
    !Number.isFinite(durationYears) ||
    !Number.isFinite(durationMonths)
  ) {
    return null;
  }

  const contractMonths = contractMonthsFromDuration(durationYears, durationMonths);
  if (!Number.isFinite(contractMonths) || contractMonths <= 0) return null;

  const discountAmount = retailPrice * (discountPercent / 100);
  const discountedPrice = retailPrice - discountAmount;
  const monthlyCost = discountedPrice * seats;
  const annualCost = monthlyCost * 12;
  const contractValue = monthlyCost * contractMonths;

  if (
    !Number.isFinite(discountAmount) ||
    !Number.isFinite(discountedPrice) ||
    !Number.isFinite(monthlyCost) ||
    !Number.isFinite(annualCost) ||
    !Number.isFinite(contractValue)
  ) {
    return null;
  }

  const rounded = {
    discountAmount: roundMoney(discountAmount),
    discountedPrice: roundMoney(discountedPrice),
    monthlyCost: roundMoney(monthlyCost),
    annualCost: roundMoney(annualCost),
    contractValue: roundMoney(contractValue),
  };

  if (
    !Number.isFinite(rounded.discountAmount) ||
    !Number.isFinite(rounded.discountedPrice) ||
    !Number.isFinite(rounded.monthlyCost) ||
    !Number.isFinite(rounded.annualCost) ||
    !Number.isFinite(rounded.contractValue)
  ) {
    return null;
  }

  return {
    retailPrice,
    seats,
    discountPercent,
    discountAmount: rounded.discountAmount,
    discountedPrice: rounded.discountedPrice,
    monthlyCost: rounded.monthlyCost,
    annualCost: rounded.annualCost,
    contractMonths,
    contractValue: rounded.contractValue,
    durationYears,
    durationMonths,
    currency: input.currency,
  };
}
