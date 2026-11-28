/**
 * Fabric cutting layout — pure math (mm internally).
 * P = floor((F+G)/(W+G)) · R = ceil(N/P) · M = R*L + (R-1)*G_row
 * Yardage = inches/36 · U = NWL/(FM)*100
 */

import type { FabricResult, LengthUnit } from './types';

export const MM_PER_CM = 10;
export const MM_PER_M = 1000;
export const MM_PER_IN = 25.4;
export const MM_PER_FT = 304.8;
export const MM_PER_YD = 914.4;

export function convertLengthToMillimeters(
  value: number,
  unit: LengthUnit,
): number {
  if (unit === 'mm') return value;
  if (unit === 'cm') return value * MM_PER_CM;
  if (unit === 'm') return value * MM_PER_M;
  if (unit === 'in') return value * MM_PER_IN;
  if (unit === 'ft') return value * MM_PER_FT;
  return value * MM_PER_YD;
}

export function convertMillimetersToUnit(
  mm: number,
  unit: LengthUnit,
): number {
  if (unit === 'mm') return mm;
  if (unit === 'cm') return mm / MM_PER_CM;
  if (unit === 'm') return mm / MM_PER_M;
  if (unit === 'in') return mm / MM_PER_IN;
  if (unit === 'ft') return mm / MM_PER_FT;
  return mm / MM_PER_YD;
}

export function convertLength(
  value: number,
  from: LengthUnit,
  to: LengthUnit,
): number {
  return convertMillimetersToUnit(
    convertLengthToMillimeters(value, from),
    to,
  );
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

export function formatLength(mm: number, unit: LengthUnit, digits = 2): string {
  return `${fmt(convertMillimetersToUnit(mm, unit), digits)} ${unit}`;
}

export function calculateUsableFabricWidth(
  fabricWidthMm: number,
  edgeAllowancePerSideMm: number,
): number {
  return fabricWidthMm - 2 * edgeAllowancePerSideMm;
}

/**
 * Max pieces across with gap between pieces (no trailing gap).
 * P = floor((F+G)/(W+G)) when W+G > 0
 */
export function calculatePiecesAcross(
  usableWidthMm: number,
  pieceWidthMm: number,
  cuttingGapMm: number,
): number {
  if (pieceWidthMm <= 0 || usableWidthMm <= 0) return 0;
  if (cuttingGapMm < 0) return 0;
  if (pieceWidthMm > usableWidthMm) return 0;
  return Math.floor((usableWidthMm + cuttingGapMm) / (pieceWidthMm + cuttingGapMm));
}

export function calculateRowsRequired(
  numberOfPieces: number,
  piecesAcross: number,
): number {
  if (piecesAcross <= 0 || numberOfPieces <= 0) return 0;
  return Math.ceil(numberOfPieces / piecesAcross);
}

export function calculateBaseFabricLength(
  rows: number,
  pieceLengthMm: number,
  rowGapMm = 0,
): number {
  if (rows <= 0) return 0;
  return rows * pieceLengthMm + Math.max(0, rows - 1) * rowGapMm;
}

export function calculateFabricYardage(lengthMm: number): number {
  return lengthMm / MM_PER_YD;
}

export function calculateFabricArea(
  widthMm: number,
  lengthMm: number,
): number {
  return widthMm * lengthMm;
}

export function calculateFabricUtilization(
  piecesAreaMm2: number,
  fabricAreaMm2: number,
): number {
  if (fabricAreaMm2 <= 0) return 0;
  return (piecesAreaMm2 / fabricAreaMm2) * 100;
}

export function calculateShrinkageAllowance(
  lengthMm: number,
  shrinkagePercent: number,
): number {
  if (shrinkagePercent <= 0) return lengthMm;
  if (shrinkagePercent >= 100) return Number.POSITIVE_INFINITY;
  return lengthMm / (1 - shrinkagePercent / 100);
}

export function calculateExtraFabricAllowance(
  lengthMm: number,
  extraPercent: number,
): number {
  return lengthMm * (1 + Math.max(0, extraPercent) / 100);
}

interface LayoutCandidate {
  pieceWidthMm: number;
  pieceLengthMm: number;
  isRotated: boolean;
  piecesAcross: number;
  rowsRequired: number;
  baseFabricLengthMm: number;
}

function layoutForOrientation(args: {
  usableWidthMm: number;
  pieceWidthMm: number;
  pieceLengthMm: number;
  numberOfPieces: number;
  cuttingGapMm: number;
  isRotated: boolean;
}): LayoutCandidate | null {
  const piecesAcross = calculatePiecesAcross(
    args.usableWidthMm,
    args.pieceWidthMm,
    args.cuttingGapMm,
  );
  if (piecesAcross <= 0) return null;
  const rows = calculateRowsRequired(args.numberOfPieces, piecesAcross);
  const length = calculateBaseFabricLength(
    rows,
    args.pieceLengthMm,
    args.cuttingGapMm,
  );
  return {
    pieceWidthMm: args.pieceWidthMm,
    pieceLengthMm: args.pieceLengthMm,
    isRotated: args.isRotated,
    piecesAcross,
    rowsRequired: rows,
    baseFabricLengthMm: length,
  };
}

/** Prefer valid uniform orientation with shorter fabric length. */
export function comparePieceOrientations(args: {
  usableWidthMm: number;
  pieceWidthMm: number;
  pieceLengthMm: number;
  numberOfPieces: number;
  cuttingGapMm: number;
  allowRotation: boolean;
}): LayoutCandidate | null {
  const a = layoutForOrientation({
    ...args,
    isRotated: false,
  });
  if (!args.allowRotation) return a;
  const b = layoutForOrientation({
    usableWidthMm: args.usableWidthMm,
    pieceWidthMm: args.pieceLengthMm,
    pieceLengthMm: args.pieceWidthMm,
    numberOfPieces: args.numberOfPieces,
    cuttingGapMm: args.cuttingGapMm,
    isRotated: true,
  });
  if (!a) return b;
  if (!b) return a;
  if (b.baseFabricLengthMm < a.baseFabricLengthMm - 1e-9) return b;
  return a;
}

export function calculateFabricResults(args: {
  fabricWidthMm: number;
  pieceWidthMm: number;
  pieceLengthMm: number;
  numberOfPieces: number;
  allowRotation: boolean;
  cuttingGapMm: number;
  edgeAllowanceMm: number;
  shrinkagePercent: number;
  extraFabricPercent: number;
}): FabricResult {
  const warnings: string[] = [];
  const usable = calculateUsableFabricWidth(
    args.fabricWidthMm,
    args.edgeAllowanceMm,
  );

  if (usable <= 0) {
    warnings.push(
      'Edge allowance leaves no usable fabric width — reduce allowance or widen fabric.',
    );
  }

  const layout = comparePieceOrientations({
    usableWidthMm: usable,
    pieceWidthMm: args.pieceWidthMm,
    pieceLengthMm: args.pieceLengthMm,
    numberOfPieces: args.numberOfPieces,
    cuttingGapMm: args.cuttingGapMm,
    allowRotation: args.allowRotation,
  });

  if (!layout) {
    warnings.push(
      'The piece is wider than the available fabric. Increase fabric width, reduce edge allowance, or enable rotation if appropriate.',
    );
    return {
      usableFabricWidthMm: usable,
      piecesAcross: 0,
      rowsRequired: 0,
      piecesInLastRow: 0,
      baseFabricLengthMm: 0,
      adjustedFabricLengthMm: 0,
      fabricMeters: 0,
      fabricYards: 0,
      fabricAreaMm2: 0,
      piecesAreaMm2: 0,
      unusedAreaMm2: 0,
      utilizationPercent: 0,
      isRotated: false,
      pieceWidthMm: args.pieceWidthMm,
      pieceLengthMm: args.pieceLengthMm,
      formulaSteps: ['No valid cutting layout for these dimensions.'],
      explanation:
        'Cannot fit pieces across the usable fabric width with the current orientation.',
      warnings,
    };
  }

  if (layout.isRotated) {
    warnings.push(
      '90° rotation selected for shorter length — check grain, nap, and pattern direction before cutting.',
    );
  }

  let adjusted = layout.baseFabricLengthMm;
  adjusted = calculateShrinkageAllowance(adjusted, args.shrinkagePercent);
  adjusted = calculateExtraFabricAllowance(adjusted, args.extraFabricPercent);

  const piecesArea =
    args.numberOfPieces * layout.pieceWidthMm * layout.pieceLengthMm;
  // Utilization uses base rectangle (usable width × base length before purchase pads)
  const fabricArea = calculateFabricArea(usable, layout.baseFabricLengthMm);
  const unused = Math.max(0, fabricArea - piecesArea);
  const util = calculateFabricUtilization(piecesArea, fabricArea);

  const piecesInLastRow =
    args.numberOfPieces -
    (layout.rowsRequired - 1) * layout.piecesAcross;

  const formulaSteps = [
    `F_usable = ${fmt(usable, 1)} mm`,
    `P = floor((F+G)/(W+G)) = ${layout.piecesAcross} across`,
    `R = ceil(N/P) = ${layout.rowsRequired} rows`,
    `M_base = ${fmt(layout.baseFabricLengthMm, 1)} mm`,
    `M_buy = ${fmt(adjusted, 1)} mm = ${fmt(adjusted / MM_PER_M, 4)} m = ${fmt(adjusted / MM_PER_YD, 4)} yd`,
    `Utilization ≈ ${fmt(util, 1)}% (pieces vs usable×base length)`,
  ];

  return {
    usableFabricWidthMm: usable,
    piecesAcross: layout.piecesAcross,
    rowsRequired: layout.rowsRequired,
    piecesInLastRow,
    baseFabricLengthMm: layout.baseFabricLengthMm,
    adjustedFabricLengthMm: adjusted,
    fabricMeters: adjusted / MM_PER_M,
    fabricYards: calculateFabricYardage(adjusted),
    fabricAreaMm2: fabricArea,
    piecesAreaMm2: piecesArea,
    unusedAreaMm2: unused,
    utilizationPercent: util,
    isRotated: layout.isRotated,
    pieceWidthMm: layout.pieceWidthMm,
    pieceLengthMm: layout.pieceLengthMm,
    formulaSteps,
    explanation: `Your fabric fits ${layout.piecesAcross} piece(s) across. To cut ${args.numberOfPieces}, you need ${layout.rowsRequired} row(s). Base length ${fmt(layout.baseFabricLengthMm / MM_PER_IN, 2)} in (${fmt(layout.baseFabricLengthMm / MM_PER_YD, 2)} yd) before shrinkage/extra. Uniform-orientation layout only — not a guaranteed minimum waste pack.`,
    warnings,
  };
}
