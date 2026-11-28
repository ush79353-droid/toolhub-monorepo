import {
  computeWinchSize,
  convertSlopeToDegrees,
  convertWeightToKg,
} from './calculation';
import type {
  WinchSizeFieldErrors,
  WinchSizeInput,
  WinchSizeResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateWinchSizeInputs(input: WinchSizeInput): {
  errors: WinchSizeFieldErrors;
  result: WinchSizeResult | null;
} {
  const errors: WinchSizeFieldErrors = {};

  const weight = parseNumber(input.weight);
  const coeff = parseNumber(input.resistanceCoefficient);
  const slope = parseNumber(input.slope);
  const sf = parseNumber(input.safetyFactor);
  const linePct = parseNumber(input.linePullPercent);

  if (weight == null) errors.weight = 'Enter vehicle or load weight.';
  else if (weight <= 0) errors.weight = 'Weight must be greater than zero.';

  if (coeff == null)
    errors.resistanceCoefficient = 'Enter resistance coefficient.';
  else if (coeff < 0)
    errors.resistanceCoefficient = 'Resistance coefficient cannot be negative.';

  if (slope == null) errors.slope = 'Enter slope angle or grade.';
  else {
    const deg = convertSlopeToDegrees(slope, input.slopeUnit);
    if (deg < 0) errors.slope = 'Slope cannot be negative in this model.';
    else if (deg >= 90)
      errors.slope = 'Slope must be less than 90° for this uphill model.';
  }

  if (sf == null) errors.safetyFactor = 'Enter a safety factor.';
  else if (sf < 1) errors.safetyFactor = 'Safety factor must be at least 1.';

  if (input.showAdvanced) {
    if (linePct == null)
      errors.linePullPercent = 'Enter line-pull derating percent.';
    else if (linePct <= 0 || linePct > 100)
      errors.linePullPercent =
        'Line-pull factor must be greater than 0% and at most 100%.';
  }

  // Soft note — does not block calculation.
  if (
    coeff != null &&
    coeff >= 0 &&
    coeff > 1 &&
    !errors.resistanceCoefficient
  ) {
    errors.form =
      'Resistance coefficient is unusually high — confirm ground or drag conditions.';
  }

  const hardError =
    errors.weight ||
    errors.resistanceCoefficient ||
    errors.slope ||
    errors.safetyFactor ||
    errors.linePullPercent;

  if (
    hardError ||
    weight == null ||
    coeff == null ||
    slope == null ||
    sf == null
  ) {
    return { errors, result: null };
  }

  const slopeDegrees = convertSlopeToDegrees(slope, input.slopeUnit);
  const linePullPercent = input.showAdvanced ? (linePct as number) : 100;
  const lineMultiplier =
    input.showAdvanced && input.lineConfig === 'double' ? 2 : 1;

  return {
    errors,
    result: computeWinchSize({
      calculationMode: input.calculationMode,
      massKg: convertWeightToKg(weight, input.weightUnit),
      resistanceCoefficient: coeff,
      slopeDegrees,
      safetyFactor: sf,
      resultUnit: input.resultUnit,
      linePullPercent,
      lineMultiplier,
    }),
  };
}
