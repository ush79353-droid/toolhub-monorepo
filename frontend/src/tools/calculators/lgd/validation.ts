import { calculateLgdFromInput } from './calculation';
import type { LgdFieldErrors, LgdInput, LgdResult } from './types';

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

function rateError(
  parsed: ReturnType<typeof parseNumber>,
  blankMsg: string,
): string | undefined {
  if (parsed.blank) return blankMsg;
  if (parsed.invalid || parsed.value == null) return 'Enter a valid percentage.';
  if (parsed.value < 0 || parsed.value > 100) {
    return 'Rate must be between 0% and 100%.';
  }
  return undefined;
}

export interface LgdValidation {
  isValid: boolean;
  errors: LgdFieldErrors;
  result: LgdResult | null;
}

export function collectFieldErrors(input: LgdInput): LgdFieldErrors {
  const errors: LgdFieldErrors = {};

  if (input.rateSource === 'recoveryRate') {
    const e = rateError(
      parseNumber(input.recoveryRatePercent),
      'Enter a recovery rate (0%–100%).',
    );
    if (e) errors.recoveryRatePercent = e;
  } else {
    const e = rateError(
      parseNumber(input.lossSeverityPercent),
      'Enter a loss severity (0%–100%).',
    );
    if (e) errors.lossSeverityPercent = e;
  }

  if (input.mode === 'advanced' && input.advancedSolve === 'eadFromLgd') {
    const lgd = parseNumber(input.lossGivenDefaultAmount);
    if (lgd.blank)
      errors.lossGivenDefaultAmount = 'Enter the loss given default amount.';
    else if (lgd.invalid || lgd.value == null)
      errors.lossGivenDefaultAmount = 'Enter a valid LGD amount.';
    else if (lgd.value < 0)
      errors.lossGivenDefaultAmount = 'LGD amount cannot be negative.';

    const ls = parseNumber(
      input.rateSource === 'lossSeverity'
        ? input.lossSeverityPercent
        : input.recoveryRatePercent,
    );
    // Need loss severity > 0 for reverse EAD
    let severityPct: number | null = null;
    if (input.rateSource === 'lossSeverity' && ls.value != null) {
      severityPct = ls.value;
    } else if (
      input.rateSource === 'recoveryRate' &&
      ls.value != null
    ) {
      severityPct = 100 - ls.value;
    }
    if (severityPct != null && severityPct <= 0) {
      errors.lossSeverityPercent =
        'Loss severity must be greater than zero to solve for exposure.';
    }
  } else if (
    input.mode === 'advanced' &&
    input.advancedSolve === 'ratesFromAmounts'
  ) {
    const ead = parseNumber(input.expectedExposure);
    const rec = parseNumber(input.recoveryAmount);
    if (ead.blank)
      errors.expectedExposure = 'Enter exposure at default.';
    else if (ead.invalid || ead.value == null)
      errors.expectedExposure = 'Enter a valid exposure.';
    else if (ead.value < 0)
      errors.expectedExposure = 'Exposure cannot be negative.';

    if (rec.blank)
      errors.recoveryAmount = 'Enter the recovery amount.';
    else if (rec.invalid || rec.value == null)
      errors.recoveryAmount = 'Enter a valid recovery amount.';
    else if (rec.value < 0)
      errors.recoveryAmount = 'Recovery amount cannot be negative.';
    else if (
      ead.value != null &&
      !ead.blank &&
      ead.value > 0 &&
      rec.value > ead.value
    ) {
      errors.recoveryAmount =
        'In the basic recovery model, recovery amount cannot exceed exposure.';
    }
  } else {
    const ead = parseNumber(input.expectedExposure);
    if (ead.blank)
      errors.expectedExposure = 'Enter expected exposure (EAD).';
    else if (ead.invalid || ead.value == null)
      errors.expectedExposure = 'Enter a valid exposure amount.';
    else if (ead.value < 0)
      errors.expectedExposure = 'Exposure cannot be negative.';
  }

  if (input.mode === 'advanced' && input.probabilityOfDefaultPercent.trim()) {
    const pd = parseNumber(input.probabilityOfDefaultPercent);
    if (pd.invalid || pd.value == null)
      errors.probabilityOfDefaultPercent = 'Enter a valid PD (%).';
    else if (pd.value < 0 || pd.value > 100)
      errors.probabilityOfDefaultPercent = 'PD must be between 0% and 100%.';
  }

  return errors;
}

export function hasFieldErrors(errors: LgdFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}

export function validateLgdInput(input: LgdInput): LgdValidation {
  const errors = collectFieldErrors(input);
  if (hasFieldErrors(errors)) {
    return { isValid: false, errors, result: null };
  }
  const result = calculateLgdFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }
  return { isValid: true, errors: {}, result };
}
