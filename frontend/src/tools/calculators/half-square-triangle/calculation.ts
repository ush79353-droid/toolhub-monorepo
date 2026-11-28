/**
 * HST quilting math — inches internally.
 * Unfinished U=F+2a
 * Two-at-a-time geo: R=F+2a+a√2 · traditional: F+7/8 (¼″ seams)
 * Eight-at-a-time geo: R=2F+4a+a√2 · traditional: 2F+1.75
 */

import type {
  HSTConstructionMethod,
  HSTCuttingPreference,
  HSTResult,
  LengthUnit,
} from './types';
import { CUTTING_LABELS, METHOD_LABELS } from './types';

export const SQRT2 = Math.SQRT2;
export const IN_PER_CM = 1 / 2.54;
export const IN_PER_MM = 1 / 25.4;
export const TRADITIONAL_TWO_AT_A_TIME_ADD_IN = 7 / 8;
export const TRADITIONAL_EIGHT_AT_A_TIME_ADD_IN = 1.75;

export function convertLengthToInches(
  value: number,
  unit: LengthUnit,
): number {
  if (unit === 'in') return value;
  if (unit === 'cm') return value * IN_PER_CM;
  return value * IN_PER_MM;
}

export function convertLengthFromInches(
  inches: number,
  unit: LengthUnit,
): number {
  if (unit === 'in') return inches;
  if (unit === 'cm') return inches * 2.54;
  return inches * 25.4;
}

export function convertLength(
  value: number,
  from: LengthUnit,
  to: LengthUnit,
): number {
  return convertLengthFromInches(convertLengthToInches(value, from), to);
}

export function calculateSquareDiagonal(side: number): number {
  return side * SQRT2;
}

export function calculateSideFromDiagonal(diagonal: number): number {
  return diagonal / SQRT2;
}

export function calculateUnfinishedHSTSize(
  finishedIn: number,
  seamAllowanceIn: number,
): number {
  return finishedIn + 2 * seamAllowanceIn;
}

export function calculateTwoAtATimeRawSquare(
  finishedIn: number,
  seamAllowanceIn: number,
): number {
  return finishedIn + 2 * seamAllowanceIn + seamAllowanceIn * SQRT2;
}

export function calculateEightAtATimeRawSquare(
  finishedIn: number,
  seamAllowanceIn: number,
): number {
  return 2 * finishedIn + 4 * seamAllowanceIn + seamAllowanceIn * SQRT2;
}

/** Traditional shortcuts assume ~¼″ seams. */
export function calculateTraditionalHSTCuttingSize(
  finishedIn: number,
  method: HSTConstructionMethod,
): number {
  if (method === 'eight-at-a-time') {
    return 2 * finishedIn + TRADITIONAL_EIGHT_AT_A_TIME_ADD_IN;
  }
  return finishedIn + TRADITIONAL_TWO_AT_A_TIME_ADD_IN;
}

export function calculateOversizedHSTCuttingSize(
  baseRawIn: number,
  extraTrimmingIn: number,
): number {
  return baseRawIn + Math.max(0, extraTrimmingIn);
}

export function blocksPerPair(method: HSTConstructionMethod): number {
  return method === 'eight-at-a-time' ? 8 : 2;
}

export function calculateRequiredSquarePairs(
  requiredBlocks: number,
  method: HSTConstructionMethod,
): number {
  const per = blocksPerPair(method);
  return Math.ceil(requiredBlocks / per);
}

export function calculateTotalFabricSquares(pairs: number): number {
  return pairs * 2;
}

export function calculateHSTSurplus(
  pairs: number,
  method: HSTConstructionMethod,
  requiredBlocks: number,
): number {
  return pairs * blocksPerPair(method) - requiredBlocks;
}

/**
 * Invert geometric raw → finished (when cutting preference is geometric).
 * Two: R = F+2a+a√2 → F = R − 2a − a√2
 * Eight: R = 2F+4a+a√2 → F = (R − 4a − a√2)/2
 */
export function calculateFinishedHSTFromRawSquare(
  rawIn: number,
  seamAllowanceIn: number,
  method: HSTConstructionMethod,
  cutting: HSTCuttingPreference,
  extraTrimmingIn: number,
): number {
  let effectiveRaw = rawIn;
  if (cutting === 'oversized') {
    effectiveRaw = rawIn - Math.max(0, extraTrimmingIn);
  }
  if (cutting === 'traditional') {
    // Invert traditional shortcuts (¼″ convention)
    if (method === 'eight-at-a-time') {
      return (effectiveRaw - TRADITIONAL_EIGHT_AT_A_TIME_ADD_IN) / 2;
    }
    return effectiveRaw - TRADITIONAL_TWO_AT_A_TIME_ADD_IN;
  }
  // geometric (and oversized base after removing extra)
  if (method === 'eight-at-a-time') {
    return (
      (effectiveRaw -
        4 * seamAllowanceIn -
        seamAllowanceIn * SQRT2) /
      2
    );
  }
  return (
    effectiveRaw - 2 * seamAllowanceIn - seamAllowanceIn * SQRT2
  );
}

export function rawSquareFromFinished(
  finishedIn: number,
  seamAllowanceIn: number,
  method: HSTConstructionMethod,
  cutting: HSTCuttingPreference,
  extraTrimmingIn: number,
): number {
  let raw: number;
  if (cutting === 'traditional') {
    raw = calculateTraditionalHSTCuttingSize(finishedIn, method);
  } else {
    raw =
      method === 'eight-at-a-time'
        ? calculateEightAtATimeRawSquare(finishedIn, seamAllowanceIn)
        : calculateTwoAtATimeRawSquare(finishedIn, seamAllowanceIn);
  }
  if (cutting === 'oversized') {
    // Oversized: geometric minimum + trimming allowance
    const geo =
      method === 'eight-at-a-time'
        ? calculateEightAtATimeRawSquare(finishedIn, seamAllowanceIn)
        : calculateTwoAtATimeRawSquare(finishedIn, seamAllowanceIn);
    raw = calculateOversizedHSTCuttingSize(geo, extraTrimmingIn);
  }
  return raw;
}

export function fmt(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

export function formatLength(inches: number, unit: LengthUnit, digits = 3): string {
  return `${fmt(convertLengthFromInches(inches, unit), digits)} ${unit}`;
}

/** Nearest eighth-inch display (does not round cutting down). */
export function formatFractionalInches(inches: number): string {
  if (!Number.isFinite(inches)) return '—';
  const eighths = Math.round(inches * 8);
  const whole = Math.floor(eighths / 8);
  const rem = eighths % 8;
  const frac =
    rem === 0
      ? ''
      : rem === 1
        ? '⅛'
        : rem === 2
          ? '¼'
          : rem === 3
            ? '⅜'
            : rem === 4
              ? '½'
              : rem === 5
                ? '⅝'
                : rem === 6
                  ? '¾'
                  : '⅞';
  if (whole === 0) return frac || '0';
  return frac ? `${whole}${frac}` : String(whole);
}

export function generateHSTSizeChart(args: {
  finishedSizesIn: readonly number[];
  seamAllowanceIn: number;
  cutting: HSTCuttingPreference;
  extraTrimmingIn: number;
}): {
  finished: number;
  unfinished: number;
  twoAtATime: number;
  eightAtATime: number;
}[] {
  return args.finishedSizesIn.map((f) => ({
    finished: f,
    unfinished: calculateUnfinishedHSTSize(f, args.seamAllowanceIn),
    twoAtATime: rawSquareFromFinished(
      f,
      args.seamAllowanceIn,
      'two-at-a-time',
      args.cutting,
      args.extraTrimmingIn,
    ),
    eightAtATime: rawSquareFromFinished(
      f,
      args.seamAllowanceIn,
      'eight-at-a-time',
      args.cutting,
      args.extraTrimmingIn,
    ),
  }));
}

export const CHART_FINISHED_SIZES_IN = [
  1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 8, 9, 10, 12,
] as const;

export function calculateHalfSquareTriangleResults(args: {
  mode: 'finished-to-raw' | 'raw-to-finished' | 'diagonal-to-side';
  constructionMethod: HSTConstructionMethod;
  cuttingPreference: HSTCuttingPreference;
  finishedSizeIn: number | null;
  rawSquareSizeIn: number | null;
  diagonalIn: number | null;
  seamAllowanceIn: number;
  extraTrimmingIn: number;
  requiredBlocks: number | null;
}): HSTResult | null {
  const warnings: string[] = [];
  let finished = args.finishedSizeIn;
  let raw = args.rawSquareSizeIn;
  let diagonal = args.diagonalIn;

  if (args.mode === 'finished-to-raw') {
    if (finished == null || finished <= 0) return null;
    raw = rawSquareFromFinished(
      finished,
      args.seamAllowanceIn,
      args.constructionMethod,
      args.cuttingPreference,
      args.extraTrimmingIn,
    );
    diagonal = calculateSquareDiagonal(finished);
  } else if (args.mode === 'raw-to-finished') {
    if (raw == null || raw <= 0) return null;
    finished = calculateFinishedHSTFromRawSquare(
      raw,
      args.seamAllowanceIn,
      args.constructionMethod,
      args.cuttingPreference,
      args.extraTrimmingIn,
    );
    if (finished <= 0) {
      warnings.push(
        'Raw square is too small for the selected method and seam allowance.',
      );
      return null;
    }
    diagonal = calculateSquareDiagonal(finished);
  } else {
    if (diagonal == null || diagonal <= 0) return null;
    finished = calculateSideFromDiagonal(diagonal);
    raw = rawSquareFromFinished(
      finished,
      args.seamAllowanceIn,
      args.constructionMethod,
      args.cuttingPreference,
      args.extraTrimmingIn,
    );
  }

  if (finished == null || raw == null || diagonal == null) return null;

  if (
    args.cuttingPreference === 'traditional' &&
    Math.abs(args.seamAllowanceIn - 0.25) > 1e-6
  ) {
    warnings.push(
      'Traditional ⅞″ / 1¾″ shortcuts assume ≈¼″ seams — geometric sizes use your entered seam allowance.',
    );
  }

  const unfinished = calculateUnfinishedHSTSize(
    finished,
    args.seamAllowanceIn,
  );
  const per = blocksPerPair(args.constructionMethod);
  let requiredPairs: number | null = null;
  let totalFabricSquares: number | null = null;
  let surplusBlocks: number | null = null;
  if (args.requiredBlocks != null && args.requiredBlocks > 0) {
    requiredPairs = calculateRequiredSquarePairs(
      args.requiredBlocks,
      args.constructionMethod,
    );
    totalFabricSquares = calculateTotalFabricSquares(requiredPairs);
    surplusBlocks = calculateHSTSurplus(
      requiredPairs,
      args.constructionMethod,
      args.requiredBlocks,
    );
  }

  const formulaSteps = [
    `Method: ${METHOD_LABELS[args.constructionMethod]} · ${CUTTING_LABELS[args.cuttingPreference]}`,
    `F = ${fmt(finished, 4)} in · U = F+2a = ${fmt(unfinished, 4)} in`,
    `R = ${fmt(raw, 4)} in (${formatFractionalInches(raw)}″ nearest ⅛ display)`,
    `d_finished = F√2 = ${fmt(diagonal, 4)} in`,
    `d_raw = R√2 = ${fmt(calculateSquareDiagonal(raw), 4)} in`,
    `Blocks per fabric-square pair: ${per}`,
  ];

  return {
    finishedSizeIn: finished,
    unfinishedSizeIn: unfinished,
    rawSquareSizeIn: raw,
    finishedDiagonalIn: diagonal,
    rawSquareDiagonalIn: calculateSquareDiagonal(raw),
    seamAllowanceIn: args.seamAllowanceIn,
    blocksPerPair: per,
    requiredPairs,
    totalFabricSquares,
    surplusBlocks,
    constructionMethod: args.constructionMethod,
    cuttingPreference: args.cuttingPreference,
    formulaSteps,
    explanation:
      args.constructionMethod === 'eight-at-a-time'
        ? 'Cut two fabric squares to the raw size. Mark both diagonals, sew ¼″ on both sides of each diagonal, cut into eight triangles, and press. Trim oversized blocks to unfinished size if needed.'
        : 'Cut two fabric squares to the raw size. Place right sides together, sew on both sides of the marked diagonal, cut apart, and press. Trim oversized blocks to unfinished size if needed.',
    warnings,
  };
}
