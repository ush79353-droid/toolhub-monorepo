import {
  formatPaybackPeriod,
  irregularDiscountedPaybackYears,
  irregularPaybackYears,
  steadyDiscountedPaybackYears,
  steadyPaybackYears,
} from './calculation';
import {
  BASE_YEAR_COUNT,
  EXTENDED_YEAR_COUNT,
  type PaybackPeriodFieldErrors,
  type PaybackPeriodInput,
  type PaybackPeriodResult,
} from './types';

function parseOptional(raw: string): number | null | typeof Number.NaN {
  const cleaned = raw.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const num = Number(cleaned);
  if (!Number.isFinite(num)) return Number.NaN;
  return num;
}

export function validatePaybackPeriodInput(input: PaybackPeriodInput): {
  isValid: boolean;
  errors: PaybackPeriodFieldErrors;
  result: PaybackPeriodResult | null;
} {
  const errors: PaybackPeriodFieldErrors = {};

  const discountPct = parseOptional(input.discountRate);
  const investment = parseOptional(input.initialInvestment);
  const annualCf = parseOptional(input.annualCashFlow);

  if (discountPct !== null) {
    if (Number.isNaN(discountPct)) errors.discountRate = 'Enter a valid discount rate';
    else if (discountPct < 0) errors.discountRate = 'Discount rate cannot be negative';
  }

  if (investment !== null) {
    if (Number.isNaN(investment)) errors.initialInvestment = 'Enter a valid investment';
    else if (investment < 0) errors.initialInvestment = 'Investment cannot be negative';
  }

  if (annualCf !== null) {
    if (Number.isNaN(annualCf)) errors.annualCashFlow = 'Enter a valid cash flow';
  }

  const yearCount = input.includeMoreYears ? EXTENDED_YEAR_COUNT : BASE_YEAR_COUNT;
  const yearValues: number[] = [];
  for (let i = 0; i < yearCount; i += 1) {
    const parsed = parseOptional(input.yearCashFlows[i] ?? '');
    if (parsed === null) {
      yearValues.push(0);
      continue;
    }
    if (Number.isNaN(parsed)) {
      errors.years = `Year ${i + 1}: enter a valid number`;
      break;
    }
    yearValues.push(parsed);
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  // Need a positive investment to compute payback; blank discount = 0%.
  if (investment === null || !(investment > 0)) {
    return { isValid: false, errors, result: null };
  }

  const rateDecimal = discountPct === null ? 0 : discountPct / 100;

  const steadyPaybackYearsValue =
    annualCf !== null ? steadyPaybackYears(investment, annualCf) : null;
  const steadyDiscountedYearsValue =
    annualCf !== null
      ? steadyDiscountedPaybackYears(investment, annualCf, rateDecimal)
      : null;

  const irregularPaybackYearsValue = irregularPaybackYears(investment, yearValues);
  const irregularDiscountedYearsValue = irregularDiscountedPaybackYears(
    investment,
    yearValues,
    rateDecimal
  );

  const result: PaybackPeriodResult = {
    currency: input.currency,
    steadyPaybackYears: steadyPaybackYearsValue,
    steadyDiscountedYears: steadyDiscountedYearsValue,
    steadyPaybackDisplay: formatPaybackPeriod(steadyPaybackYearsValue, input.steadyPaybackUnit),
    steadyDiscountedDisplay: formatPaybackPeriod(
      steadyDiscountedYearsValue,
      input.steadyDiscountedUnit
    ),
    irregularPaybackYears: irregularPaybackYearsValue,
    irregularDiscountedYears: irregularDiscountedYearsValue,
    irregularPaybackDisplay: formatPaybackPeriod(
      irregularPaybackYearsValue,
      input.irregularPaybackUnit
    ),
    irregularDiscountedDisplay: formatPaybackPeriod(
      irregularDiscountedYearsValue,
      input.irregularDiscountedUnit
    ),
  };

  return { isValid: true, errors, result };
}
