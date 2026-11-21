import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateAverageEquity,
  calculateROE,
  explainReturnPerEquity,
  formatRoeMoney,
  formatRoePercent,
  interpretROE,
} from './calculation';
import type {
  ReturnOnEquityFieldErrors,
  ReturnOnEquityInput,
  ReturnOnEquityResult,
} from './types';

export interface ReturnOnEquityValidation {
  isValid: boolean;
  errors: ReturnOnEquityFieldErrors;
  result: ReturnOnEquityResult | null;
}

function parseFinite(raw: string): {
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

export function validateReturnOnEquityInput(
  input: ReturnOnEquityInput
): ReturnOnEquityValidation {
  const errors: ReturnOnEquityFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasError = false;

  const np = parseFinite(input.netProfit);
  if (np.blank) {
    errors.netProfit = 'Enter net profit.';
    hasError = true;
  } else if (np.invalid || np.value === null) {
    errors.netProfit = 'Enter a valid net profit.';
    hasError = true;
  }

  let equityBase: number | null = null;

  if (input.useAverageEquity) {
    const begin = parseFinite(input.beginningEquity);
    if (begin.blank) {
      errors.beginningEquity = 'Enter beginning shareholders\' equity.';
      hasError = true;
    } else if (begin.invalid || begin.value === null) {
      errors.beginningEquity = 'Enter a valid beginning equity amount.';
      hasError = true;
    }

    const end = parseFinite(input.endingEquity);
    if (end.blank) {
      errors.endingEquity = 'Enter ending shareholders\' equity.';
      hasError = true;
    } else if (end.invalid || end.value === null) {
      errors.endingEquity = 'Enter a valid ending equity amount.';
      hasError = true;
    }

    if (
      begin.value !== null &&
      !begin.invalid &&
      end.value !== null &&
      !end.invalid
    ) {
      equityBase = calculateAverageEquity(begin.value, end.value);
      if (equityBase === null) {
        errors.form =
          'Average shareholders\' equity must not be zero. Check beginning and ending equity.';
        hasError = true;
      }
    }
  } else {
    const eq = parseFinite(input.shareholdersEquity);
    if (eq.blank) {
      errors.shareholdersEquity = 'Enter shareholders\' equity.';
      hasError = true;
    } else if (eq.invalid || eq.value === null) {
      errors.shareholdersEquity = 'Enter a valid shareholders\' equity.';
      hasError = true;
    } else if (eq.value === 0) {
      errors.shareholdersEquity =
        'Shareholders\' equity must not be zero to calculate ROE.';
      hasError = true;
    } else {
      equityBase = eq.value;
    }
  }

  if (hasError || np.value === null || equityBase === null) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateROE(np.value, equityBase);
  if (!math) {
    errors.form = 'Unable to calculate return on equity.';
    return { isValid: false, errors, result: null };
  }

  const result: ReturnOnEquityResult = {
    roePercentage: math.roePercentage,
    returnPerEquityUnit: math.returnPerEquityUnit,
    equityBase,
    usedAverageEquity: input.useAverageEquity,
    hasNegativeEquity: math.hasNegativeEquity,
    currency,
    formattedRoe: formatRoePercent(math.roePercentage),
    formattedEquityBase: `${symbol}${formatRoeMoney(equityBase, currency)}`,
    interpretation: interpretROE(
      math.roePercentage,
      math.hasNegativeEquity
    ),
    explanation: explainReturnPerEquity(math.returnPerEquityUnit, currency),
    warningMessage: math.hasNegativeEquity
      ? "Shareholders' equity is negative. Conventional ROE interpretation may be misleading, so this result should not be compared directly with standard positive-equity ROE ratios."
      : input.useAverageEquity
        ? "ROE uses average shareholders' equity = (beginning + ending) ÷ 2 as the denominator. Industry and leverage context still matter."
        : "ROE uses the shareholders' equity amount entered as the denominator. Average equity may better match period income when the balance sheet changed.",
  };

  return { isValid: true, errors, result };
}
