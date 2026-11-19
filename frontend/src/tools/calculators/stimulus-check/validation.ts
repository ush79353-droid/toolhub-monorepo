import { calculateStimulusCheck, formatEip1Usd } from './calculation';
import type {
  StimulusCheckFieldErrors,
  StimulusCheckInput,
  StimulusCheckResult,
} from './types';

export interface StimulusCheckValidation {
  isValid: boolean;
  errors: StimulusCheckFieldErrors;
  result: StimulusCheckResult | null;
}

function parseNonNegInt(raw: string): {
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
  if (!Number.isFinite(value) || !Number.isInteger(value)) {
    return { value: null, blank: false, invalid: true };
  }
  return { value, blank: false, invalid: false };
}

function parseMoney(raw: string): {
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

export function validateStimulusCheckInput(
  input: StimulusCheckInput
): StimulusCheckValidation {
  const errors: StimulusCheckFieldErrors = {};

  const kids = parseNonNegInt(input.kids);
  if (kids.blank) {
    errors.kids = 'Enter how many qualifying children (kids under 17).';
  } else if (kids.invalid || kids.value === null) {
    errors.kids = 'Enter a whole number of kids.';
  } else if (kids.value < 0) {
    errors.kids = 'Kids cannot be negative.';
  } else if (kids.value > 99) {
    errors.kids = 'Enter at most 99 kids.';
  }

  const agi = parseMoney(input.agi);
  if (agi.blank) {
    // Empty AGI → no result yet (matches screenshot empty AGI).
  } else if (agi.invalid || agi.value === null) {
    errors.agi = 'Enter a valid 2019 AGI in USD.';
  } else if (agi.value < 0) {
    errors.agi = 'AGI cannot be negative.';
  }

  if (Object.keys(errors).length > 0 || agi.blank) {
    return { isValid: false, errors, result: null };
  }

  const calc = calculateStimulusCheck({
    filed2019Taxes: input.filed2019Taxes === 'yes',
    filingStatus: input.filingStatus,
    kids: kids.value!,
    agi: agi.value!,
  });

  if (!calc) {
    errors.form = 'This combination does not produce a finite estimate.';
    return { isValid: false, errors, result: null };
  }

  const result: StimulusCheckResult = {
    paymentUsd: calc.paymentUsd,
    formattedPayment: formatEip1Usd(calc.paymentUsd),
    baseAmount: calc.baseAmount,
    childAmount: calc.childAmount,
    phaseoutReduction: calc.phaseoutReduction,
    phaseoutThreshold: calc.phaseoutThreshold,
    ineligibleNoFiling: calc.ineligibleNoFiling,
    isHistoricalEstimate: true,
  };

  return { isValid: true, errors: {}, result };
}
