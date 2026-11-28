import { calculateBikiniRecommendations } from './calculation';
import type {
  BikiniFieldErrors,
  BikiniInput,
  BikiniResult,
} from './types';
import { convertLengthToCm } from './calculation';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateBodyMeasurements(input: BikiniInput): {
  errors: BikiniFieldErrors;
  result: BikiniResult | null;
} {
  const errors: BikiniFieldErrors = {};

  const bust = parseNumber(input.bust);
  const waist = parseNumber(input.waist);
  const highHip = parseNumber(input.highHip);
  const hip = parseNumber(input.hip);

  if (bust == null) errors.bust = 'Enter bust circumference.';
  else if (bust <= 0) errors.bust = 'Bust must be greater than zero.';

  if (waist == null) errors.waist = 'Enter waist circumference.';
  else if (waist <= 0) errors.waist = 'Waist must be greater than zero.';

  if (highHip == null) errors.highHip = 'Enter high-hip circumference.';
  else if (highHip <= 0) errors.highHip = 'High hip must be greater than zero.';

  if (hip == null) errors.hip = 'Enter hip circumference.';
  else if (hip <= 0) errors.hip = 'Hip must be greater than zero.';

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const unit = input.unit;
  const result = calculateBikiniRecommendations({
    bustCm: convertLengthToCm(bust!, unit),
    waistCm: convertLengthToCm(waist!, unit),
    highHipCm: convertLengthToCm(highHip!, unit),
    hipCm: convertLengthToCm(hip!, unit),
    coverage: input.coverage,
    support: input.support,
    style: input.style,
    activity: input.activity,
  });

  return { errors, result };
}

export const validateBikiniInputs = validateBodyMeasurements;
