import { calculateRealRateOfReturn } from './calculation';
import type {
  RealRateOfReturnFieldErrors,
  RealRateOfReturnInput,
  RealRateOfReturnResult,
} from './types';

export interface RealRateOfReturnValidation {
  isValid: boolean;
  errors: RealRateOfReturnFieldErrors;
  result: RealRateOfReturnResult | null;
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

export function validateRealRateOfReturnInput(
  input: RealRateOfReturnInput
): RealRateOfReturnValidation {
  const errors: RealRateOfReturnFieldErrors = {};

  const nominal = parseNumber(input.nominalRatePercent);
  const inflation = parseNumber(input.inflationRatePercent);

  if (!nominal.blank && (nominal.invalid || nominal.value === null)) {
    errors.nominalRatePercent = 'Enter a valid nominal rate of return.';
  } else if (!nominal.blank && nominal.value !== null && !(nominal.value >= -100)) {
    errors.nominalRatePercent = 'Nominal rate must be at least −100%.';
  }

  if (!inflation.blank && (inflation.invalid || inflation.value === null)) {
    errors.inflationRatePercent = 'Enter a valid inflation rate.';
  } else if (
    !inflation.blank &&
    inflation.value !== null &&
    !(inflation.value > -100)
  ) {
    errors.inflationRatePercent = 'Inflation rate must be greater than −100%.';
  }

  const incomplete =
    nominal.blank || inflation.blank || Object.keys(errors).length > 0;

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateRealRateOfReturn({
    nominalRatePercent: nominal.value!,
    inflationRatePercent: inflation.value!,
  });

  if (!result) {
    errors.form = 'This combination does not produce a finite real rate.';
    return { isValid: false, errors, result: null };
  }

  return { isValid: true, errors: {}, result };
}
