import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateEpsGrowth,
  formatEpsAmount,
  formatGrowthPercent,
  interpretEpsGrowth,
} from './calculation';
import type {
  EpsGrowthFieldErrors,
  EpsGrowthInput,
  EpsGrowthResult,
} from './types';

export interface EpsGrowthValidation {
  isValid: boolean;
  errors: EpsGrowthFieldErrors;
  result: EpsGrowthResult | null;
}

function parseNumber(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  if (/infinity|nan/i.test(cleaned)) {
    return { value: null, blank: false, invalid: true };
  }
  const value = Number(cleaned);
  if (!Number.isFinite(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

export function validateEpsGrowthInput(
  input: EpsGrowthInput
): EpsGrowthValidation {
  const errors: EpsGrowthFieldErrors = {};
  const currency = input.currency;
  let hasFieldError = false;

  const initial = parseNumber(input.initialEps);
  if (initial.blank) {
    errors.initialEps = 'Enter initial EPS.';
    hasFieldError = true;
  } else if (initial.invalid || initial.value === null) {
    errors.initialEps = 'Enter a valid initial EPS.';
    hasFieldError = true;
  }

  const final = parseNumber(input.finalEps);
  if (final.blank) {
    errors.finalEps = 'Enter final EPS.';
    hasFieldError = true;
  } else if (final.invalid || final.value === null) {
    errors.finalEps = 'Enter a valid final EPS.';
    hasFieldError = true;
  }

  const periods = parseNumber(input.numberOfPeriods);
  if (periods.blank) {
    errors.numberOfPeriods = 'Enter the number of periods.';
    hasFieldError = true;
  } else if (periods.invalid || periods.value === null) {
    errors.numberOfPeriods = 'Enter a valid number of periods.';
    hasFieldError = true;
  } else if (periods.value <= 0) {
    errors.numberOfPeriods = 'Number of periods must be greater than zero.';
    hasFieldError = true;
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (
    initial.value === null ||
    final.value === null ||
    periods.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateEpsGrowth({
    initialEps: initial.value,
    finalEps: final.value,
    numberOfPeriods: periods.value,
  });

  if (math === null) {
    errors.form = 'Unable to calculate EPS growth with these inputs.';
    return { isValid: false, errors, result: null };
  }

  const symbol = getCurrencySymbol(currency);
  const notes: string[] = [];
  if (math.warning) notes.push(math.warning);
  notes.push(
    'Compare equivalent EPS measures (basic or diluted) across periods. Amounts share one currency label (no FX).'
  );

  const result: EpsGrowthResult = {
    absoluteEpsChange: math.absoluteEpsChange,
    totalGrowthPercentage: math.totalGrowthPercentage,
    compoundGrowthRate: math.compoundGrowthRate,
    currency,
    formattedAbsoluteChange: `${symbol}${formatEpsAmount(math.absoluteEpsChange, currency)}`,
    formattedTotalGrowth:
      math.totalGrowthPercentage == null
        ? null
        : `${formatGrowthPercent(math.totalGrowthPercentage)}%`,
    formattedCagr:
      math.compoundGrowthRate == null
        ? null
        : `${formatGrowthPercent(math.compoundGrowthRate)}%`,
    interpretation: interpretEpsGrowth(
      math.absoluteEpsChange,
      math.totalGrowthPercentage,
      math.compoundGrowthRate,
      periods.value,
      symbol,
      currency
    ),
    warningMessage: notes.join(' '),
  };

  return { isValid: true, errors, result };
}
