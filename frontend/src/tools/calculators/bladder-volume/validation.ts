import {
  calculateBladderVolume,
  coefficientForShape,
  toCm,
} from './calculation';
import type {
  BladderVolumeFieldErrors,
  BladderVolumeInput,
  BladderVolumeResult,
} from './types';

function parsePositive(raw: string): number | null {
  const t = raw.trim();
  if (!t) return null;
  const n = Number(t);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

export function validateBladderVolumeInput(input: BladderVolumeInput): {
  errors: BladderVolumeFieldErrors;
  result: BladderVolumeResult | null;
} {
  const errors: BladderVolumeFieldErrors = {};

  let customCoef: number | null = null;
  if (input.shape === 'custom') {
    const c = Number(input.customCoefficient.trim());
    if (!Number.isFinite(c) || c <= 0 || c > 2) {
      errors.customCoefficient = 'Enter a coefficient between 0 and 2.';
    } else {
      customCoef = c;
    }
  }

  const d1 = parsePositive(input.dim1);
  const d2 = parsePositive(input.dim2);
  const d3 = parsePositive(input.dim3);

  if (input.dim1.trim() && d1 == null) errors.dim1 = 'Enter a positive dimension.';
  if (input.dim2.trim() && d2 == null) errors.dim2 = 'Enter a positive dimension.';
  if (input.dim3.trim() && d3 == null) errors.dim3 = 'Enter a positive dimension.';

  const incomplete =
    !input.dim1.trim() || !input.dim2.trim() || !input.dim3.trim();

  if (incomplete || errors.dim1 || errors.dim2 || errors.dim3 || errors.customCoefficient) {
    return { errors, result: null };
  }

  const coefficient = coefficientForShape(input.shape, customCoef);
  if (coefficient == null) {
    errors.form = 'Coefficient unavailable.';
    return { errors, result: null };
  }

  const dimsCm: [number, number, number] = [
    toCm(d1!, input.dim1Unit),
    toCm(d2!, input.dim2Unit),
    toCm(d3!, input.dim3Unit),
  ];

  return {
    errors,
    result: calculateBladderVolume(input, dimsCm, coefficient),
  };
}
