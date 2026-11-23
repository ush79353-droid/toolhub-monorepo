import { calculateIchVolume } from './calculation';
import type {
  IchVolumeFieldErrors,
  IchVolumeInput,
  IchVolumeResult,
} from './types';

export interface IchVolumeValidation {
  isValid: boolean;
  errors: IchVolumeFieldErrors;
  result: IchVolumeResult | null;
}

function parsePositive(raw: string, label: string): { value?: number; error?: string } {
  const t = raw.trim();
  if (t === '') return {};
  if (!/^\d+(\.\d+)?$/.test(t)) {
    return { error: `${label} must be a non-negative number.` };
  }
  const n = Number(t);
  if (!Number.isFinite(n) || n < 0) {
    return { error: `${label} must be a finite non-negative number.` };
  }
  return { value: n };
}

function parseNonNegInt(raw: string, label: string): { value?: number; error?: string } {
  const t = raw.trim();
  if (t === '') return {};
  if (!/^\d+$/.test(t)) {
    return { error: `${label} must be a whole number ≥ 0.` };
  }
  const n = Number(t);
  if (!Number.isInteger(n) || n < 0) {
    return { error: `${label} must be a whole number ≥ 0.` };
  }
  return { value: n };
}

function anyWeightedFilled(input: IchVolumeInput): boolean {
  return (
    input.slicesGe75.trim() !== '' ||
    input.slices25to75.trim() !== '' ||
    input.slicesLt25.trim() !== ''
  );
}

export function validateIchVolumeInput(input: IchVolumeInput): IchVolumeValidation {
  const errors: IchVolumeFieldErrors = {};

  const length = parsePositive(input.lengthCm, 'Length');
  if (length.error) errors.lengthCm = length.error;
  else if (length.value === undefined) {
    /* blank ok until calculate */
  } else if (length.value === 0) {
    errors.lengthCm = 'Length must be greater than 0.';
  }

  const width = parsePositive(input.widthCm, 'Width');
  if (width.error) errors.widthCm = width.error;
  else if (width.value !== undefined && width.value === 0) {
    errors.widthCm = 'Width must be greater than 0.';
  }

  const thick = parsePositive(input.sliceThicknessMm, 'Slice thickness');
  if (thick.error) errors.sliceThicknessMm = thick.error;
  else if (thick.value !== undefined && thick.value === 0) {
    errors.sliceThicknessMm = 'Slice thickness must be greater than 0.';
  }

  const slices = parseNonNegInt(input.numberOfSlices, 'Number of slices');
  if (slices.error) errors.numberOfSlices = slices.error;

  const ge = parseNonNegInt(input.slicesGe75, '≥75% slices');
  if (ge.error) errors.slicesGe75 = ge.error;
  const mid = parseNonNegInt(input.slices25to75, '25–75% slices');
  if (mid.error) errors.slices25to75 = mid.error;
  const lt = parseNonNegInt(input.slicesLt25, '<25% slices');
  if (lt.error) errors.slicesLt25 = lt.error;

  const usedWeighted = anyWeightedFilled(input);

  if (usedWeighted) {
    // Treat blank stratified fields as 0 once any band is used.
    const geV = ge.value ?? (input.slicesGe75.trim() === '' ? 0 : undefined);
    const midV = mid.value ?? (input.slices25to75.trim() === '' ? 0 : undefined);
    const ltV = lt.value ?? (input.slicesLt25.trim() === '' ? 0 : undefined);
    if (ge.error || mid.error || lt.error) {
      return { isValid: false, errors, result: null };
    }
    if (geV === undefined || midV === undefined || ltV === undefined) {
      return { isValid: false, errors, result: null };
    }
    if (geV + midV + ltV === 0) {
      errors.form = 'Enter at least one hemorrhage-area slice count, or clear those fields and use Number of slices.';
    }
    // Avoid double-counting: if total slice count also entered, it must match raw sum.
    if (slices.value !== undefined) {
      const rawSum = geV + midV + ltV;
      if (slices.value !== rawSum) {
        errors.numberOfSlices =
          'Number of slices must equal ≥75% + 25–75% + <25% when hemorrhage-area counts are used (or clear Number of slices).';
      }
    }
  } else if (slices.value === undefined && input.numberOfSlices.trim() === '') {
    // wait for input
  } else if (slices.value === 0) {
    errors.numberOfSlices = 'Number of slices must be greater than 0.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors, result: null };
  }

  const incomplete =
    length.value === undefined ||
    width.value === undefined ||
    thick.value === undefined ||
    (!usedWeighted && slices.value === undefined);

  if (incomplete) {
    return { isValid: false, errors, result: null };
  }

  const result = calculateIchVolume({
    lengthCm: length.value!,
    widthCm: width.value!,
    sliceThicknessMm: thick.value!,
    shape: input.shape,
    numberOfSlices: usedWeighted ? null : slices.value!,
    slicesGe75: usedWeighted ? ge.value ?? 0 : null,
    slices25to75: usedWeighted ? mid.value ?? 0 : null,
    slicesLt25: usedWeighted ? lt.value ?? 0 : null,
    usedWeightedSlices: usedWeighted,
  });

  return { isValid: true, errors, result };
}
