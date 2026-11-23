import {
  calculatePvr,
  parseNumber,
  pressureToMmHg,
} from './calculation';
import type {
  PvrFieldErrors,
  PvrInput,
  PvrResult,
} from './types';

export interface PvrValidation {
  isValid: boolean;
  errors: PvrFieldErrors;
  result: PvrResult | null;
}

/** Practical entry bounds — reject non-physical extremes, not clinical gates. */
export const MIN_PRESSURE = -20;
export const MAX_PRESSURE_MMHG = 400;
export const MAX_CO_L_MIN = 50;

function fieldNumber(
  raw: string,
  label: string,
  key: keyof PvrFieldErrors,
  errors: PvrFieldErrors,
  opts?: { requirePositive?: boolean; allowZero?: boolean },
): number | null {
  const cleaned = raw.trim();
  if (cleaned === '') return null;
  const n = parseNumber(cleaned);
  if (n === null) {
    errors[key] = `Enter a valid ${label}.`;
    return null;
  }
  if (opts?.requirePositive && !(n > 0)) {
    errors[key] = `${label} must be positive.`;
    return null;
  }
  if (opts?.allowZero === false && n === 0) {
    errors[key] = `${label} must be positive.`;
    return null;
  }
  return n;
}

/**
 * PVR stays inactive until mPAP, LAP, and CO are all valid.
 * Zero CO and non-positive (mPAP − LAP) leave results blank with field/form errors.
 */
export function validatePvrInput(input: PvrInput): PvrValidation {
  const errors: PvrFieldErrors = {};

  const mpapRaw = fieldNumber(
    input.mpapText,
    'mean pulmonary arterial pressure',
    'mpapText',
    errors,
  );
  const lapRaw = fieldNumber(
    input.lapText,
    'left atrial pressure',
    'lapText',
    errors,
  );
  const coRaw = fieldNumber(
    input.coText,
    'cardiac output',
    'coText',
    errors,
    { requirePositive: true },
  );

  let mpapMmHg: number | null = null;
  let lapMmHg: number | null = null;

  if (mpapRaw !== null && !errors.mpapText) {
    mpapMmHg = pressureToMmHg(mpapRaw, input.mpapUnit);
    if (mpapMmHg < MIN_PRESSURE || mpapMmHg > MAX_PRESSURE_MMHG) {
      errors.mpapText = `mPAP must be between ${MIN_PRESSURE} and ${MAX_PRESSURE_MMHG} mmHg equivalent.`;
      mpapMmHg = null;
    }
  }

  if (lapRaw !== null && !errors.lapText) {
    lapMmHg = pressureToMmHg(lapRaw, input.lapUnit);
    if (lapMmHg < MIN_PRESSURE || lapMmHg > MAX_PRESSURE_MMHG) {
      errors.lapText = `LAP must be between ${MIN_PRESSURE} and ${MAX_PRESSURE_MMHG} mmHg equivalent.`;
      lapMmHg = null;
    }
  }

  if (coRaw !== null && !errors.coText) {
    if (coRaw > MAX_CO_L_MIN) {
      errors.coText = `Cardiac output must be ≤ ${MAX_CO_L_MIN} L/min.`;
    }
  }

  if (
    mpapMmHg != null &&
    lapMmHg != null &&
    coRaw != null &&
    !errors.coText &&
    !(mpapMmHg - lapMmHg > 0)
  ) {
    errors.form =
      'mPAP must be greater than LAP for a positive pulmonary driving pressure.';
  }

  const hasErrors = Boolean(
    errors.form || errors.mpapText || errors.lapText || errors.coText,
  );

  if (
    hasErrors ||
    mpapMmHg == null ||
    lapMmHg == null ||
    coRaw == null ||
    errors.coText
  ) {
    return { isValid: false, errors, result: null };
  }

  try {
    return {
      isValid: true,
      errors,
      result: calculatePvr({
        mpapMmHg,
        lapMmHg,
        coLPerMin: coRaw,
        resistanceUnit: input.resistanceUnit,
      }),
    };
  } catch (e) {
    errors.form = e instanceof Error ? e.message : 'Unable to calculate PVR.';
    return { isValid: false, errors, result: null };
  }
}
