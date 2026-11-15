import { calculateSortinoRatio } from './calculation';
import type {
  SortinoAssetDraft,
  SortinoAssetResult,
  SortinoRatioFieldErrors,
  SortinoRatioInput,
  SortinoRatioResult,
} from './types';

function parseField(raw: string): number | null {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  if (/infinity|nan/i.test(trimmed)) return Number.NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

function assetBlank(asset: SortinoAssetDraft): boolean {
  return asset.averageReturn.trim() === '' && asset.downsideDeviation.trim() === '';
}

function validateAsset(
  asset: SortinoAssetDraft,
  riskFreeRate: number,
  prefix: 'asset1' | 'asset2',
  errors: SortinoRatioFieldErrors
): SortinoAssetResult | null {
  if (assetBlank(asset)) return null;

  const averageReturn = parseField(asset.averageReturn);
  const downsideDeviation = parseField(asset.downsideDeviation);
  const avgKey = prefix === 'asset1' ? 'asset1AverageReturn' : 'asset2AverageReturn';
  const ddKey = prefix === 'asset1' ? 'asset1DownsideDeviation' : 'asset2DownsideDeviation';

  let invalid = false;

  if (averageReturn === null) {
    // partial: downside filled but return blank — wait until both present
    if (downsideDeviation !== null) return null;
    return null;
  }
  if (downsideDeviation === null) {
    return null;
  }

  if (Number.isNaN(averageReturn)) {
    errors[avgKey] = 'Enter a valid average return.';
    invalid = true;
  }
  if (Number.isNaN(downsideDeviation) || downsideDeviation < 0) {
    errors[ddKey] = 'Enter a valid downside deviation (≥ 0).';
    invalid = true;
  } else if (downsideDeviation === 0) {
    errors[ddKey] = 'Downside deviation must be greater than zero.';
    invalid = true;
  }

  if (invalid) return null;

  return calculateSortinoRatio(averageReturn, riskFreeRate, downsideDeviation);
}

export function validateSortinoRatioInput(input: SortinoRatioInput): {
  isValid: boolean;
  errors: SortinoRatioFieldErrors;
  result: SortinoRatioResult | null;
} {
  const errors: SortinoRatioFieldErrors = {};
  const riskFreeRate = parseField(input.riskFreeRate);

  const asset1Partial =
    input.asset1.averageReturn.trim() !== '' || input.asset1.downsideDeviation.trim() !== '';
  const asset2Partial =
    input.asset2.averageReturn.trim() !== '' || input.asset2.downsideDeviation.trim() !== '';

  // Cascading blank until Rf + at least one asset started
  if (riskFreeRate === null && !asset1Partial && !asset2Partial) {
    return { isValid: false, errors, result: null };
  }

  if (riskFreeRate === null) {
    // Assets started but Rf blank — no results yet
    return { isValid: false, errors, result: null };
  }

  if (Number.isNaN(riskFreeRate)) {
    errors.riskFreeRate = 'Enter a valid risk-free rate.';
    return { isValid: false, errors, result: null };
  }

  const asset1 = validateAsset(input.asset1, riskFreeRate, 'asset1', errors);
  const asset2 = validateAsset(input.asset2, riskFreeRate, 'asset2', errors);

  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      errors,
      result: { asset1: null, asset2: null },
    };
  }

  if (!asset1 && !asset2) {
    return { isValid: false, errors, result: null };
  }

  return {
    isValid: Boolean(asset1 || asset2),
    errors,
    result: { asset1, asset2 },
  };
}
