import {
  calculateCircleSkirtResults,
  convertLengthToCm,
} from './calculation';
import type {
  CircleSkirtFieldErrors,
  CircleSkirtInput,
  CircleSkirtResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateCircleSkirtInputs(input: CircleSkirtInput): {
  errors: CircleSkirtFieldErrors;
  result: CircleSkirtResult | null;
} {
  const errors: CircleSkirtFieldErrors = {};
  const waist = parseNumber(input.waist);
  const length = parseNumber(input.skirtLength);
  const seam = parseNumber(input.waistSeamAllowance);
  const hem = parseNumber(input.hemAllowance);
  const fabricW = parseNumber(input.fabricWidth);

  if (waist == null) errors.waist = 'Enter waist circumference.';
  else if (waist <= 0) errors.waist = 'Waist must be greater than zero.';

  if (length == null) errors.skirtLength = 'Enter skirt length.';
  else if (length <= 0)
    errors.skirtLength = 'Skirt length must be greater than zero.';

  if (seam == null) errors.waistSeamAllowance = 'Enter seam allowance (or 0).';
  else if (seam < 0)
    errors.waistSeamAllowance = 'Seam allowance cannot be negative.';

  if (hem == null) errors.hemAllowance = 'Enter hem allowance (or 0).';
  else if (hem < 0) errors.hemAllowance = 'Hem allowance cannot be negative.';

  if (input.fabricWidth.trim() !== '') {
    if (fabricW == null) errors.fabricWidth = 'Enter a valid fabric width.';
    else if (fabricW <= 0)
      errors.fabricWidth = 'Fabric width must be greater than zero.';
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const unit = input.unit;
  const result = calculateCircleSkirtResults({
    skirtType: input.skirtType,
    waistCm: convertLengthToCm(waist!, unit),
    skirtLengthCm: convertLengthToCm(length!, unit),
    waistSeamAllowanceCm: convertLengthToCm(seam!, unit),
    hemAllowanceCm: convertLengthToCm(hem!, unit),
    fabricWidthCm:
      fabricW != null ? convertLengthToCm(fabricW, unit) : null,
  });

  return { errors, result };
}
