import { buildSinkingFundResult } from './calculation';
import type {
  SinkingFundFieldErrors,
  SinkingFundInput,
  SinkingFundResult,
} from './types';

function parseNumber(raw: string): { blank: boolean; value: number | null } {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return { blank: true, value: null };
  if (/infinity|nan/i.test(trimmed)) return { blank: false, value: Number.NaN };
  const n = Number(trimmed);
  return { blank: false, value: Number.isFinite(n) ? n : Number.NaN };
}

export function validateSinkingFund(input: SinkingFundInput): {
  isValid: boolean;
  errors: SinkingFundFieldErrors;
  result: SinkingFundResult | null;
} {
  const errors: SinkingFundFieldErrors = {};
  const fv = parseNumber(input.moneyToAccumulate);
  const rate = parseNumber(input.annualInterestRatePercent);
  const years = parseNumber(input.periodYears);
  const months = parseNumber(input.periodMonths);

  if (!fv.blank) {
    if (fv.value === null || Number.isNaN(fv.value)) {
      errors.moneyToAccumulate = 'Enter a valid amount to accumulate';
    } else if (fv.value < 0) {
      errors.moneyToAccumulate = 'Money to accumulate cannot be negative';
    }
  }

  if (!rate.blank) {
    if (rate.value === null || Number.isNaN(rate.value)) {
      errors.annualInterestRatePercent = 'Enter a valid interest rate';
    } else if (rate.value < 0) {
      errors.annualInterestRatePercent = 'Interest rate cannot be negative';
    } else if (rate.value <= -100) {
      errors.annualInterestRatePercent = 'Interest rate must be greater than −100%';
    }
  }

  let yearsValue = 0;
  let monthsValue = 0;

  if (!years.blank) {
    if (years.value === null || Number.isNaN(years.value) || !Number.isInteger(years.value)) {
      errors.periodYears = 'Enter a whole number of years';
    } else if (years.value < 0) {
      errors.periodYears = 'Years cannot be negative';
    } else {
      yearsValue = years.value;
    }
  } else {
    yearsValue = 0;
  }

  if (!months.blank) {
    if (
      months.value === null ||
      Number.isNaN(months.value) ||
      !Number.isInteger(months.value)
    ) {
      errors.periodMonths = 'Enter a whole number of months';
    } else if (months.value < 0 || months.value > 11) {
      errors.periodMonths = 'Months must be between 0 and 11';
    } else {
      monthsValue = months.value;
    }
  } else {
    monthsValue = 0;
  }

  if (!errors.periodYears && !errors.periodMonths) {
    if (years.blank && months.blank) {
      // wait for input
    } else if (yearsValue === 0 && monthsValue === 0) {
      errors.periodYears = 'Investment duration must be greater than zero';
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  if (
    fv.blank ||
    rate.blank ||
    fv.value === null ||
    rate.value === null ||
    (years.blank && months.blank)
  ) {
    return { isValid: false, errors, result: null };
  }

  const result = buildSinkingFundResult(
    fv.value,
    rate.value,
    input.compounding,
    yearsValue,
    monthsValue,
    input.currency
  );

  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate USSF for these inputs' },
      result: null,
    };
  }

  return { isValid: true, errors, result };
}
