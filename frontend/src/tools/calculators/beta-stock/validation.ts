import { buildBetaStockResult, calculateBeta, dailyReturns, sampleVariance } from './calculation';
import {
  MIN_PAIRS,
  MAX_PAIRS,
  emptyPair,
  type BetaStockFieldErrors,
  type BetaStockInput,
  type BetaStockResult,
  type PricePair,
} from './types';

function parsePrice(raw: string): number | null | typeof Number.NaN {
  const trimmed = raw.trim().replace(/,/g, '');
  if (trimmed === '') return null;
  if (/infinity|nan/i.test(trimmed)) return Number.NaN;
  const n = Number(trimmed);
  return Number.isFinite(n) ? n : Number.NaN;
}

function isBlankPair(pair: { asset: string; benchmark: string }): boolean {
  return pair.asset.trim() === '' && pair.benchmark.trim() === '';
}

function isPairFilled(pair: { asset: string; benchmark: string }): boolean {
  return pair.asset.trim() !== '' && pair.benchmark.trim() !== '';
}

/** Keep at least 4 rows; append a blank when the last pair is filled; trim extra blanks. */
export function ensureTrailingPairs(input: BetaStockInput): BetaStockInput {
  const pairs = [...input.pairs];
  if (pairs.length === 0) {
    return {
      ...input,
      pairs: Array.from({ length: MIN_PAIRS }, () => emptyPair()),
    };
  }

  const last = pairs[pairs.length - 1]!;
  if (isPairFilled(last) && pairs.length < MAX_PAIRS) {
    pairs.push(emptyPair());
  }

  while (
    pairs.length > MIN_PAIRS &&
    isBlankPair(pairs[pairs.length - 1]!) &&
    isBlankPair(pairs[pairs.length - 2]!)
  ) {
    pairs.pop();
  }

  return { ...input, pairs };
}

export function validateBetaStockInput(input: BetaStockInput): {
  isValid: boolean;
  errors: BetaStockFieldErrors;
  result: BetaStockResult | null;
  incomplete: boolean;
  undefinedBeta: boolean;
  chartPairs: PricePair[];
} {
  const errors: BetaStockFieldErrors = {};
  const completePairs: PricePair[] = [];

  input.pairs.forEach((pair, index) => {
    const day = index + 1;
    const assetBlank = pair.asset.trim() === '';
    const benchBlank = pair.benchmark.trim() === '';

    if (assetBlank && benchBlank) return;

    if (assetBlank !== benchBlank) {
      if (assetBlank) errors[`asset${day}`] = 'Enter the asset price for this day.';
      if (benchBlank) errors[`benchmark${day}`] = 'Enter the benchmark price for this day.';
      return;
    }

    const asset = parsePrice(pair.asset);
    const benchmark = parsePrice(pair.benchmark);

    if (asset === null || Number.isNaN(asset)) {
      errors[`asset${day}`] = 'Enter a valid asset price.';
    } else if (!(asset > 0)) {
      errors[`asset${day}`] = 'Asset price must be positive.';
    }

    if (benchmark === null || Number.isNaN(benchmark)) {
      errors[`benchmark${day}`] = 'Enter a valid benchmark price.';
    } else if (!(benchmark > 0)) {
      errors[`benchmark${day}`] = 'Benchmark price must be positive.';
    }

    if (
      typeof asset === 'number' &&
      typeof benchmark === 'number' &&
      !Number.isNaN(asset) &&
      !Number.isNaN(benchmark) &&
      asset > 0 &&
      benchmark > 0 &&
      !errors[`asset${day}`] &&
      !errors[`benchmark${day}`]
    ) {
      completePairs.push({ asset, benchmark });
    }
  });

  if (Object.keys(errors).length > 0) {
    return {
      isValid: false,
      errors,
      result: null,
      incomplete: false,
      undefinedBeta: false,
      chartPairs: completePairs,
    };
  }

  if (completePairs.length < MIN_PAIRS) {
    return {
      isValid: false,
      errors,
      result: null,
      incomplete: true,
      undefinedBeta: false,
      chartPairs: completePairs,
    };
  }

  const benchReturns = dailyReturns(completePairs.map((p) => p.benchmark));
  const variance = benchReturns ? sampleVariance(benchReturns) : null;
  if (variance === 0 || calculateBeta(completePairs) === null) {
    const undefinedBeta = variance === 0;
    return {
      isValid: false,
      errors: undefinedBeta
        ? {
            form: 'Beta is undefined: benchmark returns have zero variance.',
          }
        : errors,
      result: null,
      incomplete: false,
      undefinedBeta,
      chartPairs: completePairs,
    };
  }

  const result = buildBetaStockResult(completePairs, input.currency);
  if (!result) {
    return {
      isValid: false,
      errors: { form: 'Unable to calculate beta for these prices.' },
      result: null,
      incomplete: false,
      undefinedBeta: false,
      chartPairs: completePairs,
    };
  }

  return {
    isValid: true,
    errors,
    result,
    incomplete: false,
    undefinedBeta: false,
    chartPairs: completePairs,
  };
}
