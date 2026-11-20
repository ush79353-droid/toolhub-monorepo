import { getCurrencySymbol } from '@/tools/shared/currency';
import { calculatePivotPoints, formatPivotPrice } from './calculation';
import type {
  PivotPointFieldErrors,
  PivotPointInput,
  PivotPointResult,
} from './types';

export interface PivotPointValidation {
  isValid: boolean;
  errors: PivotPointFieldErrors;
  result: PivotPointResult | null;
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

function formatLevel(
  value: number | null,
  symbol: string,
  currency: PivotPointInput['currency']
): string | null {
  if (value === null) return null;
  return `${symbol}${formatPivotPrice(value, currency)}`;
}

export function validatePivotPointInput(
  input: PivotPointInput
): PivotPointValidation {
  const errors: PivotPointFieldErrors = {};
  const currency = input.currency;
  const symbol = getCurrencySymbol(currency);
  let hasError = false;

  const high = parseNumber(input.high);
  if (high.blank) {
    errors.high = 'Enter the high price.';
    hasError = true;
  } else if (high.invalid || high.value === null) {
    errors.high = 'Enter a valid high price.';
    hasError = true;
  } else if (high.value < 0) {
    errors.high = 'High price cannot be negative.';
    hasError = true;
  }

  const low = parseNumber(input.low);
  if (low.blank) {
    errors.low = 'Enter the low price.';
    hasError = true;
  } else if (low.invalid || low.value === null) {
    errors.low = 'Enter a valid low price.';
    hasError = true;
  } else if (low.value < 0) {
    errors.low = 'Low price cannot be negative.';
    hasError = true;
  }

  const close = parseNumber(input.close);
  if (close.blank) {
    errors.close = 'Enter the close price.';
    hasError = true;
  } else if (close.invalid || close.value === null) {
    errors.close = 'Enter a valid close price.';
    hasError = true;
  } else if (close.value < 0) {
    errors.close = 'Close price cannot be negative.';
    hasError = true;
  }

  let openValue: number | null = null;
  if (input.method === 'demark') {
    const open = parseNumber(input.open);
    if (open.blank) {
      errors.open = 'Enter the open price for DeMark.';
      hasError = true;
    } else if (open.invalid || open.value === null) {
      errors.open = 'Enter a valid open price.';
      hasError = true;
    } else if (open.value < 0) {
      errors.open = 'Open price cannot be negative.';
      hasError = true;
    } else {
      openValue = open.value;
    }
  }

  if (
    high.value !== null &&
    low.value !== null &&
    !high.invalid &&
    !low.invalid &&
    high.value < low.value
  ) {
    errors.high = 'High price must be greater than or equal to Low price.';
    hasError = true;
  }

  if (
    high.value !== null &&
    low.value !== null &&
    close.value !== null &&
    !high.invalid &&
    !low.invalid &&
    !close.invalid &&
    high.value >= low.value &&
    (close.value < low.value || close.value > high.value)
  ) {
    errors.close = 'Close price must lie between Low and High.';
    hasError = true;
  }

  if (
    input.method === 'demark' &&
    openValue !== null &&
    high.value !== null &&
    low.value !== null &&
    high.value >= low.value &&
    (openValue < low.value || openValue > high.value)
  ) {
    errors.open = 'Open price must lie between Low and High.';
    hasError = true;
  }

  if (
    hasError ||
    high.value === null ||
    low.value === null ||
    close.value === null
  ) {
    return { isValid: false, errors, result: null };
  }

  const math = calculatePivotPoints({
    method: input.method,
    high: high.value,
    low: low.value,
    close: close.value,
    open: input.method === 'demark' ? openValue : null,
  });

  if (math === null) {
    errors.form = 'Unable to calculate pivot points with these inputs.';
    return { isValid: false, errors, result: null };
  }

  const result: PivotPointResult = {
    method: input.method,
    pivot: math.pivot,
    r1: math.r1,
    r2: math.r2,
    r3: math.r3,
    r4: math.r4,
    s1: math.s1,
    s2: math.s2,
    s3: math.s3,
    s4: math.s4,
    currency,
    formattedPivot: formatLevel(math.pivot, symbol, currency),
    formattedR1: formatLevel(math.r1, symbol, currency),
    formattedR2: formatLevel(math.r2, symbol, currency),
    formattedR3: formatLevel(math.r3, symbol, currency),
    formattedR4: formatLevel(math.r4, symbol, currency),
    formattedS1: formatLevel(math.s1, symbol, currency),
    formattedS2: formatLevel(math.s2, symbol, currency),
    formattedS3: formatLevel(math.s3, symbol, currency),
    formattedS4: formatLevel(math.s4, symbol, currency),
    warningMessage:
      input.method === 'camarilla'
        ? 'Camarilla levels use 1.1× range multipliers. The central pivot shown is (H+L+C)/3 for reference and is not part of the Camarilla R/S formulas.'
        : 'Pivot levels are technical reference points from the prior period — not guarantees of future support or resistance.',
  };

  return { isValid: true, errors, result };
}
