import {
  calculateFabricResults,
  convertLengthToMillimeters,
} from './calculation';
import type {
  FabricFieldErrors,
  FabricInput,
  FabricResult,
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
  if (n == null || !Number.isInteger(n)) return null;
  return n;
}

export function validateFabricInputs(input: FabricInput): {
  errors: FabricFieldErrors;
  result: FabricResult | null;
} {
  const errors: FabricFieldErrors = {};
  const unit = input.unit;

  const fw = parseNumber(input.fabricWidth);
  const pw = parseNumber(input.pieceWidth);
  const pl = parseNumber(input.pieceLength);
  const n = parsePositiveInt(input.numberOfPieces);
  const gap = parseNumber(input.cuttingGap);
  const edge = parseNumber(input.edgeAllowance);
  const shrink = parseNumber(input.shrinkagePercent);
  const extra = parseNumber(input.extraFabricPercent);

  if (fw == null) errors.fabricWidth = 'Enter fabric width.';
  else if (fw <= 0) errors.fabricWidth = 'Fabric width must be greater than zero.';
  if (pw == null) errors.pieceWidth = 'Enter piece width.';
  else if (pw <= 0) errors.pieceWidth = 'Piece width must be greater than zero.';
  if (pl == null) errors.pieceLength = 'Enter piece length.';
  else if (pl <= 0) errors.pieceLength = 'Piece length must be greater than zero.';
  if (n == null || n <= 0)
    errors.numberOfPieces =
      'Number of pieces must be a positive whole number.';
  else if (n > 100_000)
    errors.numberOfPieces = 'Piece count is too large for this calculator.';
  if (gap == null || gap < 0)
    errors.cuttingGap = 'Cutting gap must be zero or positive.';
  if (edge == null || edge < 0)
    errors.edgeAllowance = 'Edge allowance must be zero or positive.';
  if (shrink == null || shrink < 0 || shrink >= 100)
    errors.shrinkagePercent = 'Shrinkage must be 0% to under 100%.';
  if (extra == null || extra < 0)
    errors.extraFabricPercent = 'Extra fabric must be zero or greater.';

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const result = calculateFabricResults({
    fabricWidthMm: convertLengthToMillimeters(fw!, unit),
    pieceWidthMm: convertLengthToMillimeters(pw!, unit),
    pieceLengthMm: convertLengthToMillimeters(pl!, unit),
    numberOfPieces: n!,
    allowRotation: input.allowRotation,
    cuttingGapMm: convertLengthToMillimeters(gap!, unit),
    edgeAllowanceMm: convertLengthToMillimeters(edge!, unit),
    shrinkagePercent: shrink!,
    extraFabricPercent: extra!,
  });

  return { errors, result };
}
