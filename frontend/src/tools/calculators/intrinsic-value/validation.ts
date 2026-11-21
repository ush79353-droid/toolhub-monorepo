import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateIntrinsicValue,
  formatIvMoney,
  formatIvPercent,
  interpretIntrinsicValue,
  valuationLabel,
} from './calculation';
import type {
  IntrinsicValueFieldErrors,
  IntrinsicValueInput,
  IntrinsicValueResult,
} from './types';

export interface IntrinsicValueValidation {
  isValid: boolean;
  errors: IntrinsicValueFieldErrors;
  result: IntrinsicValueResult | null;
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

export function validateIntrinsicValueInput(
  input: IntrinsicValueInput
): IntrinsicValueValidation {
  const errors: IntrinsicValueFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasFieldError = false;

  const eps = parseNumber(input.earningsPerShare);
  if (eps.blank) {
    errors.earningsPerShare = 'Enter earnings per share.';
    hasFieldError = true;
  } else if (eps.invalid || eps.value === null) {
    errors.earningsPerShare = 'Enter a valid earnings per share.';
    hasFieldError = true;
  } else if (eps.value <= 0) {
    errors.earningsPerShare =
      'Earnings per share must be greater than zero for this Graham model.';
    hasFieldError = true;
  }

  const growth = parseNumber(input.expectedGrowthRate);
  if (growth.blank) {
    errors.expectedGrowthRate = 'Enter the expected annual growth rate.';
    hasFieldError = true;
  } else if (growth.invalid || growth.value === null) {
    errors.expectedGrowthRate = 'Enter a valid growth rate (percentage points).';
    hasFieldError = true;
  } else if (8.5 + 2 * growth.value < 0) {
    errors.expectedGrowthRate =
      'Growth is too low for this formula (8.5 + 2g must be nonnegative).';
    hasFieldError = true;
  }

  const yieldPct = parseNumber(input.corporateBondYield);
  if (yieldPct.blank) {
    errors.corporateBondYield = 'Enter the corporate bond yield.';
    hasFieldError = true;
  } else if (yieldPct.invalid || yieldPct.value === null) {
    errors.corporateBondYield = 'Enter a valid corporate bond yield.';
    hasFieldError = true;
  } else if (yieldPct.value <= 0) {
    errors.corporateBondYield =
      'Corporate bond yield must be greater than zero.';
    hasFieldError = true;
  }

  const cmp = parseNumber(input.currentMarketPrice);
  let currentMarketPrice: number | undefined;
  if (!cmp.blank) {
    if (cmp.invalid || cmp.value === null) {
      errors.currentMarketPrice = 'Enter a valid current market price.';
      hasFieldError = true;
    } else if (cmp.value <= 0) {
      errors.currentMarketPrice =
        'Current market price must be greater than zero.';
      hasFieldError = true;
    } else {
      currentMarketPrice = cmp.value;
    }
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null };
  }

  if (eps.value === null || growth.value === null || yieldPct.value === null) {
    return { isValid: false, errors, result: null };
  }

  const math = calculateIntrinsicValue({
    earningsPerShare: eps.value,
    expectedGrowthRate: growth.value,
    corporateBondYield: yieldPct.value,
    currentMarketPrice,
  });

  if (math === null) {
    errors.form = 'Unable to calculate intrinsic value with these inputs.';
    return { isValid: false, errors, result: null };
  }

  const status = math.valuationStatus ?? null;
  const result: IntrinsicValueResult = {
    intrinsicValue: math.intrinsicValue,
    currency,
    formattedIntrinsicValue: `${symbol}${formatIvMoney(math.intrinsicValue, currency)}`,
    marginOfSafety: math.marginOfSafety ?? null,
    formattedMarginOfSafety:
      math.marginOfSafety != null
        ? `${formatIvPercent(math.marginOfSafety)}%`
        : null,
    valuationStatus: status,
    valuationLabel: status ? valuationLabel(status) : null,
    interpretation: interpretIntrinsicValue(
      math.intrinsicValue,
      symbol,
      currency,
      status,
      math.marginOfSafety ?? null
    ),
    warningMessage:
      'This uses a simplified historical Graham valuation heuristic. It is not a definitive appraisal and does not replace DCF or full financial analysis. Bond yield is a user input, not a live market feed.',
  };

  return { isValid: true, errors, result };
}
