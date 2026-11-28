/**
 * Cross-stitch sizing — pure math.
 * D = C/O · W_in = Sw/D · H_in = Sh/D · Fw = W+2A · Fh = H+2A · S = Sw×Sh
 */

import { COMPARE_COUNTS } from './types';
import type {
  CrossStitchResult,
  FabricCompareRow,
  LengthUnit,
  ThreadEstimate,
} from './types';

export const CM_PER_IN = 2.54;
export const CM_PER_MM = 0.1;
export const CM_PER_M = 100;
export const CM_PER_FT = 30.48;

export function convertLengthToCm(value: number, unit: LengthUnit): number {
  if (unit === 'cm') return value;
  if (unit === 'mm') return value * CM_PER_MM;
  if (unit === 'm') return value * CM_PER_M;
  if (unit === 'in') return value * CM_PER_IN;
  return value * CM_PER_FT;
}

export function convertCmToLength(cm: number, unit: LengthUnit): number {
  if (unit === 'cm') return cm;
  if (unit === 'mm') return cm / CM_PER_MM;
  if (unit === 'm') return cm / CM_PER_M;
  if (unit === 'in') return cm / CM_PER_IN;
  return cm / CM_PER_FT;
}

export function convertLength(
  value: number,
  from: LengthUnit,
  to: LengthUnit,
): number {
  return convertCmToLength(convertLengthToCm(value, from), to);
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

export function formatMeasurement(
  cm: number,
  unit: LengthUnit,
  digits = 2,
): string {
  return `${fmt(convertCmToLength(cm, unit), digits)} ${unit}`;
}

export function getEffectiveStitchDensity(
  fabricCount: number,
  stitchOver: number,
): number {
  return fabricCount / stitchOver;
}

export function calculateFinishedWidthInches(
  patternWidth: number,
  density: number,
): number {
  return patternWidth / density;
}

export function calculateFinishedHeightInches(
  patternHeight: number,
  density: number,
): number {
  return patternHeight / density;
}

export function calculateRequiredFabricWidth(
  finishedWidthCm: number,
  extraPerSideCm: number,
): number {
  return finishedWidthCm + 2 * extraPerSideCm;
}

export function calculateRequiredFabricHeight(
  finishedHeightCm: number,
  extraPerSideCm: number,
): number {
  return finishedHeightCm + 2 * extraPerSideCm;
}

export function calculateTotalPatternPositions(
  patternWidth: number,
  patternHeight: number,
): number {
  return patternWidth * patternHeight;
}

export function calculateEstimatedCompletedCrosses(
  totalPositions: number,
  coveragePercentage: number,
): number {
  return totalPositions * (coveragePercentage / 100);
}

/**
 * Strand-equivalent length: N × length-per-cross × working strands.
 * Available length per skein = skeinLength × (strandsPerSkein / workingStrands)
 * when skeinLength is the length of the multi-strand hank before splitting —
 * OR if skeinLength is already strand-meters, strandsPerSkein=1.
 *
 * Here: skeinLengthCm = length of one 6-strand hank (or configured strands).
 * Available working length = skeinLengthCm × (strandsPerSkein / flossStrands).
 */
export function calculateThreadRequirements(args: {
  totalPositions: number;
  coveragePercentage: number;
  flossStrands: number;
  strandLengthPerCrossCm: number;
  wastePercentage: number;
  skeinLengthCm: number;
  strandsPerSkein: number;
}): ThreadEstimate {
  const N = calculateEstimatedCompletedCrosses(
    args.totalPositions,
    args.coveragePercentage,
  );
  const Ltotal = N * args.strandLengthPerCrossCm * args.flossStrands;
  const Ladj = Ltotal * (1 + args.wastePercentage / 100);
  const availablePerSkein =
    args.skeinLengthCm * (args.strandsPerSkein / args.flossStrands);
  const skeins = Math.ceil(Ladj / availablePerSkein);

  return {
    estimatedCompletedCrosses: N,
    estimatedStrandLengthCm: Ladj,
    estimatedSkeins: skeins,
    explanation: `Approx. ${fmt(N, 0)} full crosses × ${fmt(args.strandLengthPerCrossCm, 2)} cm/strand × ${args.flossStrands} working strand(s), +${fmt(args.wastePercentage, 0)}% waste → ${fmt(Ladj, 0)} cm strand-equivalent ÷ ${fmt(availablePerSkein, 0)} cm/skein ≈ ${skeins} skein(s). Planning estimate only — colors vary.`,
  };
}

export function calculateEstimatedSkeins(
  adjustedLengthCm: number,
  availablePerSkeinCm: number,
): number {
  return Math.ceil(adjustedLengthCm / availablePerSkeinCm);
}

export function buildCompareRows(
  patternWidth: number,
  patternHeight: number,
  stitchOver: number,
): FabricCompareRow[] {
  return COMPARE_COUNTS.map((c) => {
    const d = getEffectiveStitchDensity(c, stitchOver);
    const wIn = calculateFinishedWidthInches(patternWidth, d);
    const hIn = calculateFinishedHeightInches(patternHeight, d);
    return {
      fabricCount: c,
      finishedWidthCm: wIn * CM_PER_IN,
      finishedHeightCm: hIn * CM_PER_IN,
    };
  });
}

export function calculateCrossStitchResults(args: {
  patternWidth: number;
  patternHeight: number;
  fabricCount: number;
  stitchOver: number;
  extraFabricCm: number;
  thread?: {
    coveragePercentage: number;
    flossStrands: number;
    strandLengthPerCrossCm: number;
    wastePercentage: number;
    skeinLengthCm: number;
    strandsPerSkein: number;
  } | null;
}): CrossStitchResult {
  const D = getEffectiveStitchDensity(args.fabricCount, args.stitchOver);
  const wIn = calculateFinishedWidthInches(args.patternWidth, D);
  const hIn = calculateFinishedHeightInches(args.patternHeight, D);
  const wCm = wIn * CM_PER_IN;
  const hCm = hIn * CM_PER_IN;
  const fw = calculateRequiredFabricWidth(wCm, args.extraFabricCm);
  const fh = calculateRequiredFabricHeight(hCm, args.extraFabricCm);
  const S = calculateTotalPatternPositions(
    args.patternWidth,
    args.patternHeight,
  );

  const warnings: string[] = [];
  if (args.stitchOver > 1 && args.fabricCount <= 18) {
    warnings.push(
      'Stitching over 2+ on lower counts is uncommon for Aida — confirm your fabric type.',
    );
  }

  const thread = args.thread
    ? calculateThreadRequirements({
        totalPositions: S,
        ...args.thread,
      })
    : null;

  const formulaSteps = [
    `D = C/O = ${fmt(args.fabricCount, 0)}/${fmt(args.stitchOver, 0)} = ${fmt(D, 3)} stitches/in`,
    `W = Sw/D = ${args.patternWidth}/${fmt(D, 3)} = ${fmt(wIn, 4)} in (${fmt(wCm, 2)} cm)`,
    `H = Sh/D = ${args.patternHeight}/${fmt(D, 3)} = ${fmt(hIn, 4)} in (${fmt(hCm, 2)} cm)`,
    `Fw = W+2A = ${fmt(wCm, 2)}+2×${fmt(args.extraFabricCm, 2)} = ${fmt(fw, 2)} cm`,
    `Fh = H+2A = ${fmt(hCm, 2)}+2×${fmt(args.extraFabricCm, 2)} = ${fmt(fh, 2)} cm`,
    `S = Sw×Sh = ${args.patternWidth}×${args.patternHeight} = ${S.toLocaleString('en-US')} positions`,
  ];

  return {
    effectiveStitchesPerInch: D,
    finishedWidthCm: wCm,
    finishedHeightCm: hCm,
    fabricWidthCm: fw,
    fabricHeightCm: fh,
    totalPatternPositions: S,
    extraFabricCm: args.extraFabricCm,
    compareRows: buildCompareRows(
      args.patternWidth,
      args.patternHeight,
      args.stitchOver,
    ),
    thread,
    formulaSteps,
    explanation:
      'Finished size uses fabric count ÷ stitch-over as stitches per inch. Extra fabric is added on all four sides (2A on each axis). Pattern positions are chart cells — not every cell is a full cross.',
    warnings,
  };
}
