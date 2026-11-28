import { computeBagFabric, convertLengthToMm } from './calculation';
import type { BagFieldErrors, BagInput, BagResult } from './types';

function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  return n;
}

export function validateBagInputs(input: BagInput): {
  errors: BagFieldErrors;
  result: BagResult | null;
} {
  const errors: BagFieldErrors = {};

  const h = parseNumber(input.height);
  const w = parseNumber(input.width);
  const d = parseNumber(input.depth);
  const seam = parseNumber(input.sideSeamAllowance);
  const hem = parseNumber(input.topHemAllowance);

  if (h == null) errors.height = 'Enter bag height.';
  else if (h <= 0) errors.height = 'Height must be greater than zero.';

  if (w == null) errors.width = 'Enter bag width.';
  else if (w <= 0) errors.width = 'Width must be greater than zero.';

  if (d == null) errors.depth = 'Enter bag depth (0 allowed).';
  else if (d < 0) errors.depth = 'Depth cannot be negative.';

  // Advanced defaults when collapsed: treat empty as createEmpty defaults
  const seamRaw = input.showAdvanced
    ? input.sideSeamAllowance
    : input.sideSeamAllowance.trim() === ''
      ? '1'
      : input.sideSeamAllowance;
  const hemRaw = input.showAdvanced
    ? input.topHemAllowance
    : input.topHemAllowance.trim() === ''
      ? '2'
      : input.topHemAllowance;

  const seamVal = parseNumber(seamRaw);
  const hemVal = parseNumber(hemRaw);

  if (input.showAdvanced) {
    if (seam == null) errors.sideSeamAllowance = 'Enter side seam allowance.';
    else if (seam < 0)
      errors.sideSeamAllowance = 'Seam allowance cannot be negative.';

    if (hem == null) errors.topHemAllowance = 'Enter top hem allowance.';
    else if (hem < 0)
      errors.topHemAllowance = 'Top hem allowance cannot be negative.';
  } else {
    if (seamVal == null || seamVal < 0)
      errors.sideSeamAllowance = 'Seam allowance cannot be negative.';
    if (hemVal == null || hemVal < 0)
      errors.topHemAllowance = 'Top hem allowance cannot be negative.';
  }

  if (
    errors.height ||
    errors.width ||
    errors.depth ||
    (input.showAdvanced &&
      (errors.sideSeamAllowance || errors.topHemAllowance)) ||
    h == null ||
    w == null ||
    d == null ||
    seamVal == null ||
    hemVal == null ||
    seamVal < 0 ||
    hemVal < 0
  ) {
    return { errors, result: null };
  }

  return {
    errors,
    result: computeBagFabric({
      heightMm: convertLengthToMm(h, input.heightUnit),
      widthMm: convertLengthToMm(w, input.widthUnit),
      depthMm: convertLengthToMm(d, input.depthUnit),
      boxCorners: input.boxCorners,
      seamMm: convertLengthToMm(seamVal, input.allowanceUnit),
      hemMm: convertLengthToMm(hemVal, input.allowanceUnit),
      displayUnit: input.fabricDisplayUnit,
      areaUnit: input.areaUnit,
    }),
  };
}
