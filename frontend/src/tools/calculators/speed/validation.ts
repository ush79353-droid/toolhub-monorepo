import { calculateSpeedFromInput } from './calculation';
import type { SpeedFieldErrors, SpeedInput, SpeedResult } from './types';

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

export interface SpeedValidation {
  isValid: boolean;
  errors: SpeedFieldErrors;
  result: SpeedResult | null;
}

export function collectFieldErrors(input: SpeedInput): SpeedFieldErrors {
  const errors: SpeedFieldErrors = {};
  const mode = input.calculationMode;

  const dist = parseNumber(input.distance);
  const time = parseNumber(input.time);
  const speed = parseNumber(input.speed);

  if (mode === 'speed' || mode === 'time') {
    if (!dist.blank) {
      if (dist.invalid || dist.value == null || dist.value < 0) {
        errors.distance = 'Enter a valid distance.';
      }
    }
  }
  if (mode === 'speed' || mode === 'distance') {
    if (!time.blank) {
      if (time.invalid || time.value == null || time.value < 0) {
        errors.time = 'Enter a valid elapsed time.';
      } else if (mode === 'speed' && time.value === 0) {
        // allow field error only when distance positive — engine also handles
      }
    }
  }
  if (mode === 'distance' || mode === 'time') {
    if (!speed.blank) {
      if (speed.invalid || speed.value == null || speed.value < 0) {
        errors.speed = 'Enter a valid speed.';
      }
    }
  }

  // Validate fields that are inputs for the selected mode even when blank is ok
  if (mode === 'distance' || mode === 'speed') {
    if (!time.blank && (time.invalid || (time.value != null && time.value < 0))) {
      errors.time = 'Enter a valid elapsed time.';
    }
  }

  return errors;
}

export function validateSpeedInputs(input: SpeedInput): SpeedValidation {
  const errors = collectFieldErrors(input);
  const hasFieldErrors = Object.keys(errors).length > 0;

  const dist = parseNumber(input.distance);
  const time = parseNumber(input.time);
  const speed = parseNumber(input.speed);
  const mode = input.calculationMode;

  if (hasFieldErrors) {
    return { isValid: false, errors, result: null };
  }

  const parsed = {
    distance:
      mode !== 'distance' && !dist.blank && dist.value != null && dist.value >= 0
        ? dist.value
        : mode === 'distance'
          ? null
          : !dist.blank && dist.value != null && dist.value >= 0
            ? dist.value
            : null,
    time:
      mode !== 'time' && !time.blank && time.value != null && time.value >= 0
        ? time.value
        : mode === 'time'
          ? null
          : !time.blank && time.value != null && time.value >= 0
            ? time.value
            : null,
    speed:
      mode !== 'speed' && !speed.blank && speed.value != null && speed.value >= 0
        ? speed.value
        : mode === 'speed'
          ? null
          : !speed.blank && speed.value != null && speed.value >= 0
            ? speed.value
            : null,
  };

  // For the calculated field, ignore any leftover string so mode stays authoritative
  if (mode === 'speed') parsed.speed = null;
  if (mode === 'distance') parsed.distance = null;
  if (mode === 'time') parsed.time = null;

  const needA =
    mode === 'speed' || mode === 'time' ? parsed.distance != null : parsed.speed != null;
  const needB =
    mode === 'speed' || mode === 'distance' ? parsed.time != null : parsed.speed != null;

  // Refine needB for time mode
  const ready =
    mode === 'speed'
      ? parsed.distance != null && parsed.time != null
      : mode === 'distance'
        ? parsed.speed != null && parsed.time != null
        : parsed.distance != null && parsed.speed != null;

  const result = calculateSpeedFromInput(input, parsed);

  if (!ready && !input.showAverage) {
    return { isValid: false, errors, result: null };
  }

  if (!ready && input.showAverage) {
    // still return result for average section
    if (!result.averageSpeedDisplay) {
      return { isValid: false, errors, result: null };
    }
    return { isValid: true, errors, result };
  }

  void needA;
  void needB;

  return {
    isValid: result.speedDisplay != null || result.averageSpeedDisplay != null,
    errors,
    result,
  };
}
