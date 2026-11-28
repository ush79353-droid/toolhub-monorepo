import {
  calculateHalfSquareTriangleResults,
  convertLengthToInches,
} from './calculation';
import type {
  HSTFieldErrors,
  HSTInput,
  HSTResult,
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

export function validateHSTInputs(input: HSTInput): {
  errors: HSTFieldErrors;
  result: HSTResult | null;
} {
  const errors: HSTFieldErrors = {};
  const unit = input.unit;
  const seam = parseNumber(input.seamAllowance);
  const extra = parseNumber(input.extraTrimmingAllowance);
  const required = parsePositiveInt(input.requiredBlocks);

  if (seam == null || seam < 0)
    errors.seamAllowance = 'Seam allowance must be zero or positive.';
  else if (seam >= 2)
    errors.seamAllowance = 'Seam allowance looks unusually large for quilting.';
  if (extra == null || extra < 0)
    errors.extraTrimmingAllowance =
      'Trimming allowance must be zero or positive.';
  if (
    input.requiredBlocks.trim() !== '' &&
    (required == null || required <= 0)
  ) {
    errors.requiredBlocks = 'Required blocks must be a positive whole number.';
  }

  let finishedIn: number | null = null;
  let rawIn: number | null = null;
  let diagIn: number | null = null;

  if (input.calculationMode === 'finished-to-raw') {
    const f = parseNumber(input.finishedSize);
    if (f == null) errors.finishedSize = 'Enter finished HST size.';
    else if (f <= 0)
      errors.finishedSize = 'Finished size must be greater than zero.';
    else finishedIn = convertLengthToInches(f, unit);
  } else if (input.calculationMode === 'raw-to-finished') {
    const r = parseNumber(input.rawSquareSize);
    if (r == null) errors.rawSquareSize = 'Enter raw square size.';
    else if (r <= 0)
      errors.rawSquareSize = 'Raw square must be greater than zero.';
    else rawIn = convertLengthToInches(r, unit);
  } else {
    const d = parseNumber(input.diagonal);
    if (d == null) errors.diagonal = 'Enter diagonal.';
    else if (d <= 0) errors.diagonal = 'Diagonal must be greater than zero.';
    else diagIn = convertLengthToInches(d, unit);
  }

  if (Object.keys(errors).length > 0) {
    return { errors, result: null };
  }

  const result = calculateHalfSquareTriangleResults({
    mode: input.calculationMode,
    constructionMethod: input.constructionMethod,
    cuttingPreference: input.cuttingPreference,
    finishedSizeIn: finishedIn,
    rawSquareSizeIn: rawIn,
    diagonalIn: diagIn,
    seamAllowanceIn: convertLengthToInches(seam!, unit),
    extraTrimmingIn: convertLengthToInches(extra!, unit),
    requiredBlocks: required,
  });

  return { errors, result };
}
