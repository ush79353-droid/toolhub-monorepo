import {
  calculateGorlin,
  flowToMlPerMin,
  periodToSec,
  pressureToMmHg,
} from './calculation';
import type {
  GorlinFieldErrors,
  GorlinInput,
  GorlinResult,
} from './types';

export interface GorlinValidation {
  isValid: boolean;
  errors: GorlinFieldErrors;
  result: GorlinResult | null;
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

export function validateGorlinInput(input: GorlinInput): GorlinValidation {
  const errors: GorlinFieldErrors = {};
  const co = parseNumber(input.cardiacOutput);
  const hr = parseNumber(input.heartRate);
  const aGrad = parseNumber(input.aorticGradient);
  const aPer = parseNumber(input.systolicEjectionPeriod);
  const mGrad = parseNumber(input.mitralGradient);
  const mPer = parseNumber(input.diastolicFillingPeriod);

  const allBlank =
    co.blank &&
    hr.blank &&
    aGrad.blank &&
    aPer.blank &&
    mGrad.blank &&
    mPer.blank;
  if (allBlank) {
    return { isValid: false, errors, result: null };
  }

  let coMl: number | null = null;
  let hrBpm: number | null = null;

  if (!co.blank) {
    if (co.invalid || co.value == null || co.value <= 0) {
      errors.cardiacOutput = 'Enter a positive cardiac output.';
    } else {
      coMl = flowToMlPerMin(co.value, input.cardiacOutputUnit);
      if (coMl == null) errors.cardiacOutput = 'Enter a valid cardiac output.';
    }
  }

  if (!hr.blank) {
    if (hr.invalid || hr.value == null || hr.value <= 0) {
      errors.heartRate = 'Enter a positive heart rate.';
    } else {
      hrBpm = hr.value;
    }
  }

  let aPerSec: number | null = null;
  let aGradMmHg: number | null = null;
  let mPerSec: number | null = null;
  let mGradMmHg: number | null = null;

  const aorticAny = !aGrad.blank || !aPer.blank;
  const mitralAny = !mGrad.blank || !mPer.blank;

  if (aorticAny) {
    if (aGrad.blank) {
      /* wait for pair */
    } else if (aGrad.invalid || aGrad.value == null || aGrad.value <= 0) {
      errors.aorticGradient = 'Enter a positive aortic mean gradient.';
    } else {
      aGradMmHg = pressureToMmHg(aGrad.value, input.aorticGradientUnit);
      if (aGradMmHg == null) {
        errors.aorticGradient = 'Enter a valid aortic mean gradient.';
      }
    }
    if (aPer.blank) {
      /* wait */
    } else if (aPer.invalid || aPer.value == null || aPer.value <= 0) {
      errors.systolicEjectionPeriod =
        'Enter a positive systolic ejection period.';
    } else {
      aPerSec = periodToSec(aPer.value, input.systolicEjectionPeriodUnit);
      if (aPerSec == null) {
        errors.systolicEjectionPeriod =
          'Enter a valid systolic ejection period.';
      }
    }
  }

  if (mitralAny) {
    if (!mGrad.blank) {
      if (mGrad.invalid || mGrad.value == null || mGrad.value <= 0) {
        errors.mitralGradient = 'Enter a positive mitral mean gradient.';
      } else {
        mGradMmHg = pressureToMmHg(mGrad.value, input.mitralGradientUnit);
        if (mGradMmHg == null) {
          errors.mitralGradient = 'Enter a valid mitral mean gradient.';
        }
      }
    }
    if (!mPer.blank) {
      if (mPer.invalid || mPer.value == null || mPer.value <= 0) {
        errors.diastolicFillingPeriod =
          'Enter a positive diastolic filling period.';
      } else {
        mPerSec = periodToSec(mPer.value, input.diastolicFillingPeriodUnit);
        if (mPerSec == null) {
          errors.diastolicFillingPeriod =
            'Enter a valid diastolic filling period.';
        }
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const wantAortic =
    aGradMmHg != null && aPerSec != null && coMl != null && hrBpm != null;
  const wantMitral =
    mGradMmHg != null && mPerSec != null && coMl != null && hrBpm != null;

  if (!wantAortic && !wantMitral) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateGorlin(
    coMl,
    hrBpm,
    wantAortic ? aPerSec : null,
    wantAortic ? aGradMmHg : null,
    input.aorticAreaUnit,
    wantMitral ? mPerSec : null,
    wantMitral ? mGradMmHg : null,
    input.mitralAreaUnit
  );

  const ok = result.aortic != null || result.mitral != null;
  return { isValid: ok, errors, result: ok ? result : null };
}
