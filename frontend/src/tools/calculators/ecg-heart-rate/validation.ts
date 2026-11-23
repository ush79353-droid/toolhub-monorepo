import {
  boxesToDistanceMm,
  calculateEcgHeartRate,
  distanceMmToBoxes,
  distanceMmToIntervalValue,
  intervalToDistanceMm,
} from './calculation';
import type {
  EcgHeartRateFieldErrors,
  EcgHeartRateInput,
  EcgHeartRateResult,
} from './types';

export interface EcgHeartRateValidation {
  isValid: boolean;
  errors: EcgHeartRateFieldErrors;
  result: EcgHeartRateResult | null;
  /** Synced display strings when the alternate field can be derived. */
  synced: {
    intervalValue?: string;
    boxesValue?: string;
  };
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

function formatSynced(value: number): string {
  const rounded = Math.round(value * 10000) / 10000;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(Number(rounded.toFixed(4)));
}

/**
 * Resolve canonical distance from the last-edited field, sync the other,
 * then compute BPM. Zero / blank intervals stay inactive.
 */
export function validateEcgHeartRateInput(
  input: EcgHeartRateInput
): EcgHeartRateValidation {
  const errors: EcgHeartRateFieldErrors = {};
  const synced: EcgHeartRateValidation['synced'] = {};

  let distanceMm: number | null = null;

  if (input.lastEdited === 'boxes') {
    const boxes = parseNumber(input.boxesValue);
    if (boxes.blank) {
      return { isValid: false, errors, result: null, synced };
    }
    if (boxes.invalid || boxes.value === null || boxes.value <= 0) {
      errors.boxesValue = 'Enter a positive number of boxes.';
      return { isValid: false, errors, result: null, synced };
    }
    distanceMm = boxesToDistanceMm(boxes.value, input.boxType);
    if (distanceMm == null) {
      errors.boxesValue = 'Unable to convert boxes to distance.';
      return { isValid: false, errors, result: null, synced };
    }
    const interval = distanceMmToIntervalValue(
      distanceMm,
      input.intervalUnit,
      input.paperSpeed
    );
    if (interval != null) synced.intervalValue = formatSynced(interval);
  } else {
    const interval = parseNumber(input.intervalValue);
    if (interval.blank) {
      // Prefer boxes if interval blank but boxes filled
      const boxes = parseNumber(input.boxesValue);
      if (!boxes.blank) {
        return validateEcgHeartRateInput({
          ...input,
          lastEdited: 'boxes',
        });
      }
      return { isValid: false, errors, result: null, synced };
    }
    if (interval.invalid || interval.value === null || interval.value <= 0) {
      errors.intervalValue =
        input.intervalUnit === 'mm'
          ? 'Enter a positive R–R distance in mm.'
          : 'Enter a positive R–R duration.';
      return { isValid: false, errors, result: null, synced };
    }
    distanceMm = intervalToDistanceMm(
      interval.value,
      input.intervalUnit,
      input.paperSpeed
    );
    if (distanceMm == null) {
      errors.intervalValue = 'Unable to convert the R–R interval.';
      return { isValid: false, errors, result: null, synced };
    }
    const boxes = distanceMmToBoxes(distanceMm, input.boxType);
    if (boxes != null) synced.boxesValue = formatSynced(boxes);
  }

  const result = calculateEcgHeartRate({
    distanceMm: distanceMm!,
    paperSpeed: input.paperSpeed,
  });
  if (result == null) {
    errors.form = 'Unable to calculate heart rate from this interval.';
    return { isValid: false, errors, result: null, synced };
  }

  return { isValid: true, errors, result, synced };
}
