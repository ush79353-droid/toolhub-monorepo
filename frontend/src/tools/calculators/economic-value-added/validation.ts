import { getCurrencySymbol } from '@/tools/shared/currency';
import {
  calculateEva,
  calculateInvestedCapital,
  formatEvaMoney,
  formatWaccPercent,
  interpretEva,
} from './calculation';
import type { EvaFieldErrors, EvaInput, EvaResult } from './types';

export interface EvaValidation {
  isValid: boolean;
  errors: EvaFieldErrors;
  result: EvaResult | null;
  helperInvestedCapital: number | null;
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

export function validateEvaInput(input: EvaInput): EvaValidation {
  const errors: EvaFieldErrors = {};
  const currency = input.currency;
  let hasFieldError = false;

  const nopat = parseNumber(input.nopat);
  if (nopat.blank) {
    errors.nopat = 'Enter NOPAT (use 0 or a negative value if needed).';
    hasFieldError = true;
  } else if (nopat.invalid || nopat.value === null) {
    errors.nopat = 'Enter a valid NOPAT amount.';
    hasFieldError = true;
  }

  const invested = parseNumber(input.investedCapital);
  if (invested.blank) {
    errors.investedCapital = 'Enter invested capital (or calculate it below).';
    hasFieldError = true;
  } else if (invested.invalid || invested.value === null) {
    errors.investedCapital = 'Enter a valid invested capital amount.';
    hasFieldError = true;
  } else if (invested.value < 0) {
    errors.investedCapital = 'Invested capital cannot be negative.';
    hasFieldError = true;
  }

  const wacc = parseNumber(input.waccPercent);
  if (wacc.blank) {
    errors.waccPercent = 'Enter WACC as a percentage.';
    hasFieldError = true;
  } else if (wacc.invalid || wacc.value === null) {
    errors.waccPercent = 'Enter a valid WACC percentage.';
    hasFieldError = true;
  } else if (wacc.value < 0 || wacc.value > 100) {
    errors.waccPercent = 'WACC must be between 0% and 100%.';
    hasFieldError = true;
  }

  // Helper fields are optional; only validate when either is filled.
  let helperInvestedCapital: number | null = null;
  const oa = parseNumber(input.operatingAssets);
  const ol = parseNumber(input.operatingLiabilities);
  const helperStarted = !oa.blank || !ol.blank;

  if (helperStarted) {
    if (oa.blank) {
      errors.operatingAssets = 'Enter operating assets.';
    } else if (oa.invalid || oa.value === null) {
      errors.operatingAssets = 'Enter a valid operating assets amount.';
    } else if (oa.value < 0) {
      errors.operatingAssets = 'Operating assets cannot be negative.';
    }

    if (ol.blank) {
      errors.operatingLiabilities = 'Enter operating liabilities.';
    } else if (ol.invalid || ol.value === null) {
      errors.operatingLiabilities = 'Enter a valid operating liabilities amount.';
    } else if (ol.value < 0) {
      errors.operatingLiabilities =
        'Operating liabilities cannot be negative.';
    }

    if (
      !errors.operatingAssets &&
      !errors.operatingLiabilities &&
      oa.value != null &&
      ol.value != null
    ) {
      helperInvestedCapital = calculateInvestedCapital(oa.value, ol.value);
      if (helperInvestedCapital === null) {
        errors.investedCapitalHelper =
          'Calculated invested capital is negative. Review operating asset and liability classification.';
      }
    }
  }

  if (hasFieldError) {
    return { isValid: false, errors, result: null, helperInvestedCapital };
  }

  if (
    nopat.value === null ||
    invested.value === null ||
    wacc.value === null
  ) {
    return { isValid: false, errors, result: null, helperInvestedCapital };
  }

  const math = calculateEva({
    nopat: nopat.value,
    investedCapital: invested.value,
    waccPercent: wacc.value,
  });

  if (math === null) {
    errors.form = 'Unable to calculate EVA with these inputs.';
    return { isValid: false, errors, result: null, helperInvestedCapital };
  }

  const symbol = getCurrencySymbol(currency);
  const notes: string[] = [
    'EVA uses NOPAT, invested capital, and WACC for the same reporting period. Amounts share one currency label (no FX).',
  ];

  const result: EvaResult = {
    ...math,
    currency,
    formattedEva: `${symbol}${formatEvaMoney(math.eva, currency)}`,
    formattedCapitalCharge: `${symbol}${formatEvaMoney(math.capitalCharge, currency)}`,
    formattedWacc: `${formatWaccPercent(wacc.value)}%`,
    interpretation: interpretEva(
      math.eva,
      math.capitalCharge,
      symbol,
      currency
    ),
    warningMessage: notes.join(' '),
  };

  return { isValid: true, errors, result, helperInvestedCapital };
}
