import { calculateNauticalMileFromInput } from './calculation';
import type {
  NauticalMileFieldErrors,
  NauticalMileInput,
  NauticalMileResult,
} from './types';

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

export interface NauticalMileValidation {
  isValid: boolean;
  errors: NauticalMileFieldErrors;
  result: NauticalMileResult | null;
}

function checkNonNeg(
  raw: string,
  label: string,
): string | undefined {
  const p = parseNumber(raw);
  if (p.blank) return undefined;
  if (p.invalid || p.value == null) return `Please enter a valid ${label}.`;
  if (p.value < 0) return `${label} cannot be negative.`;
  return undefined;
}

export function collectFieldErrors(
  input: NauticalMileInput,
): NauticalMileFieldErrors {
  const errors: NauticalMileFieldErrors = {};

  if (input.convertSource === 'nmi') {
    const e = checkNonNeg(input.nmiValue, 'nautical miles');
    if (e) errors.nmiValue = e;
  } else if (input.convertSource === 'imperial') {
    const e = checkNonNeg(input.imperialValue, 'distance');
    if (e) errors.imperialValue = e;
  } else {
    const e = checkNonNeg(input.metricValue, 'distance');
    if (e) errors.metricValue = e;
  }

  const mode = input.calculationMode;
  if (mode === 'distance' || mode === 'time') {
    const e = checkNonNeg(input.speed, 'speed');
    if (e) errors.speed = e;
    else if (
      mode === 'time' &&
      !parseNumber(input.speed).blank &&
      parseNumber(input.speed).value === 0 &&
      !parseNumber(input.distance).blank &&
      (parseNumber(input.distance).value ?? 0) > 0
    ) {
      errors.speed = 'Speed must be greater than zero for a positive distance.';
    }
  }
  if (mode === 'distance' || mode === 'speed') {
    const e = checkNonNeg(input.time, 'time');
    if (e) errors.time = e;
    else if (
      mode === 'speed' &&
      !parseNumber(input.time).blank &&
      parseNumber(input.time).value === 0 &&
      !parseNumber(input.distance).blank &&
      (parseNumber(input.distance).value ?? 0) > 0
    ) {
      errors.time = 'Time must be greater than zero for a positive distance.';
    }
  }
  if (mode === 'speed' || mode === 'time') {
    const e = checkNonNeg(input.distance, 'distance');
    if (e) errors.distance = e;
  }

  if (input.showSpeedConvert) {
    const e = checkNonNeg(input.convertSpeedValue, 'speed');
    if (e) errors.convertSpeedValue = e;
  }

  if (input.showCoords) {
    for (const [key, label, max] of [
      ['lat1', 'latitude', 90],
      ['lat2', 'latitude', 90],
      ['lon1', 'longitude', 180],
      ['lon2', 'longitude', 180],
    ] as const) {
      const p = parseNumber(input[key]);
      if (!p.blank) {
        if (p.invalid || p.value == null) {
          errors[key] = `Please enter a valid ${label}.`;
        } else if (Math.abs(p.value) > max) {
          errors[key] = `${label} must be between −${max} and ${max}.`;
        }
      }
    }
  }

  return errors;
}

export function validateNauticalMileInputs(
  input: NauticalMileInput,
): NauticalMileValidation {
  const errors = collectFieldErrors(input);

  const convertBlank =
    input.convertSource === 'nmi'
      ? parseNumber(input.nmiValue).blank
      : input.convertSource === 'imperial'
        ? parseNumber(input.imperialValue).blank
        : parseNumber(input.metricValue).blank;

  const mode = input.calculationMode;
  let travelBlank = false;
  if (mode === 'distance') {
    travelBlank =
      parseNumber(input.speed).blank || parseNumber(input.time).blank;
  } else if (mode === 'speed') {
    travelBlank =
      parseNumber(input.distance).blank || parseNumber(input.time).blank;
  } else {
    travelBlank =
      parseNumber(input.distance).blank || parseNumber(input.speed).blank;
  }

  const speedConvertBlank =
    input.showSpeedConvert && parseNumber(input.convertSpeedValue).blank;
  const coordsBlank =
    input.showCoords &&
    (parseNumber(input.lat1).blank ||
      parseNumber(input.lon1).blank ||
      parseNumber(input.lat2).blank ||
      parseNumber(input.lon2).blank);

  if (
    convertBlank &&
    travelBlank &&
    (!input.showSpeedConvert || speedConvertBlank) &&
    (!input.showCoords || coordsBlank)
  ) {
    return { isValid: false, errors, result: null };
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  // If travel has blocking blanks but convert is filled, still compute convert
  const result = calculateNauticalMileFromInput(input);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate with these inputs.' },
      result: null,
    };
  }

  return { isValid: true, errors: {}, result };
}
