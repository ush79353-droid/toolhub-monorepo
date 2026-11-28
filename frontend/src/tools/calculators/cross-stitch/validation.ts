import {
  calculateCrossStitchResults,
  convertLengthToCm,
} from './calculation';
import type {
  CrossStitchFieldErrors,
  CrossStitchInput,
  CrossStitchResult,
} from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

function parsePositiveInt(raw: string): number | null {
  const n = parseNumber(raw);
  if (n == null) return null;
  if (!Number.isInteger(n)) return null;
  return n;
}

export function validateCrossStitchInputs(input: CrossStitchInput): {
  errors: CrossStitchFieldErrors;
  result: CrossStitchResult | null;
} {
  const errors: CrossStitchFieldErrors = {};

  const w = parsePositiveInt(input.patternWidth);
  const h = parsePositiveInt(input.patternHeight);
  const count = parseNumber(input.fabricCount);
  const over = parsePositiveInt(input.stitchOver);
  const extra = parseNumber(input.extraFabric);

  if (w == null)
    errors.patternWidth =
      input.patternWidth.trim() === ''
        ? 'Enter pattern width in stitches.'
        : 'Width must be a positive whole number.';
  else if (w <= 0) errors.patternWidth = 'Width must be greater than zero.';

  if (h == null)
    errors.patternHeight =
      input.patternHeight.trim() === ''
        ? 'Enter pattern height in stitches.'
        : 'Height must be a positive whole number.';
  else if (h <= 0) errors.patternHeight = 'Height must be greater than zero.';

  if (count == null) errors.fabricCount = 'Enter fabric count.';
  else if (count <= 0)
    errors.fabricCount = 'Fabric count must be greater than zero.';

  if (over == null)
    errors.stitchOver = 'Stitch over must be a positive whole number.';
  else if (over <= 0) errors.stitchOver = 'Stitch over must be greater than zero.';

  if (extra == null) errors.extraFabric = 'Enter extra fabric (or 0).';
  else if (extra < 0)
    errors.extraFabric = 'Extra fabric cannot be negative.';

  let threadArgs: {
    coveragePercentage: number;
    flossStrands: number;
    strandLengthPerCrossCm: number;
    wastePercentage: number;
    skeinLengthCm: number;
    strandsPerSkein: number;
  } | null = null;

  if (input.showThread) {
    const cov = parseNumber(input.coveragePercentage);
    const strands = parsePositiveInt(input.flossStrands);
    const perCross = parseNumber(input.strandLengthPerCrossCm);
    const waste = parseNumber(input.wastePercentage);
    const skein = parseNumber(input.skeinLengthCm);
    const sps = parsePositiveInt(input.strandsPerSkein);

    if (cov == null || cov < 0 || cov > 100)
      errors.coveragePercentage = 'Coverage must be 0–100%.';
    if (strands == null || strands <= 0)
      errors.flossStrands = 'Working strands must be a positive integer.';
    if (perCross == null || perCross <= 0)
      errors.strandLengthPerCrossCm =
        'Strand length per cross must be positive.';
    if (waste == null || waste < 0)
      errors.wastePercentage = 'Waste must be zero or greater.';
    if (skein == null || skein <= 0)
      errors.skeinLengthCm = 'Skein length must be positive.';
    if (sps == null || sps <= 0)
      errors.strandsPerSkein = 'Strands per skein must be a positive integer.';

    if (
      cov != null &&
      cov >= 0 &&
      cov <= 100 &&
      strands != null &&
      strands > 0 &&
      perCross != null &&
      perCross > 0 &&
      waste != null &&
      waste >= 0 &&
      skein != null &&
      skein > 0 &&
      sps != null &&
      sps > 0
    ) {
      // Convert per-cross and skein lengths from display unit to cm
      threadArgs = {
        coveragePercentage: cov,
        flossStrands: strands,
        strandLengthPerCrossCm: convertLengthToCm(perCross, input.unit),
        wastePercentage: waste,
        skeinLengthCm: convertLengthToCm(skein, input.unit),
        strandsPerSkein: sps,
      };
    }
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const result = calculateCrossStitchResults({
    patternWidth: w!,
    patternHeight: h!,
    fabricCount: count!,
    stitchOver: over!,
    extraFabricCm: convertLengthToCm(extra!, input.unit),
    thread: threadArgs,
  });

  return { errors, result };
}
