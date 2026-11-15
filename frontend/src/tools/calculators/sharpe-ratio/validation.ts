import { calculateSharpeRatio } from './calculation';
import type {
  SharpeRatioFieldErrors,
  SharpeRatioInput,
  SharpeRatioResult,
} from './types';

export interface SharpeRatioValidation {
  isValid: boolean;
  errors: SharpeRatioFieldErrors;
  result: SharpeRatioResult | null;
  /** Risk premium alone when return + Rf are valid but σ is still blank. */
  partialRiskPremium: { percent: number; formatted: string } | null;
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
  if (!Number.isFinite(value)) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

function formatPercent(value: number): string {
  const rounded = Number(value.toFixed(4));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
  }).format(rounded);
}

export function validateSharpeRatioInput(input: SharpeRatioInput): SharpeRatioValidation {
  const errors: SharpeRatioFieldErrors = {};

  const inv = parseNumber(input.investmentReturn);
  const rf = parseNumber(input.riskFreeReturn);
  const sd = parseNumber(input.standardDeviation);

  if (!inv.blank && (inv.invalid || inv.value === null)) {
    errors.investmentReturn = 'Enter a valid investment return.';
  }
  if (!rf.blank && (rf.invalid || rf.value === null)) {
    errors.riskFreeReturn = 'Enter a valid risk-free return.';
  }
  if (!sd.blank && (sd.invalid || sd.value === null)) {
    errors.standardDeviation = 'Enter a valid standard deviation.';
  } else if (!sd.blank && sd.value !== null && !(sd.value > 0)) {
    errors.standardDeviation = 'Standard deviation must be greater than zero.';
  }

  const allBlank = inv.blank && rf.blank && sd.blank;
  if (allBlank) {
    return { isValid: false, errors, result: null, partialRiskPremium: null };
  }

  let partialRiskPremium: SharpeRatioValidation['partialRiskPremium'] = null;
  if (
    !inv.blank &&
    !rf.blank &&
    inv.value !== null &&
    rf.value !== null &&
    !errors.investmentReturn &&
    !errors.riskFreeReturn
  ) {
    const premium = inv.value - rf.value;
    if (Number.isFinite(premium)) {
      partialRiskPremium = { percent: premium, formatted: formatPercent(premium) };
    }
  }

  if (
    inv.blank ||
    rf.blank ||
    sd.blank ||
    Object.keys(errors).length > 0 ||
    inv.value === null ||
    rf.value === null ||
    sd.value === null
  ) {
    return { isValid: false, errors, result: null, partialRiskPremium };
  }

  const result = calculateSharpeRatio({
    investmentReturnPercent: inv.value,
    riskFreeReturnPercent: rf.value,
    standardDeviationPercent: sd.value,
  });

  if (!result) {
    errors.form = 'Unable to calculate a finite Sharpe ratio.';
    return { isValid: false, errors, result: null, partialRiskPremium };
  }

  return { isValid: true, errors: {}, result, partialRiskPremium };
}
