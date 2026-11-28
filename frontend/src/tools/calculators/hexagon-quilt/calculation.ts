/**
 * Flat-top regular hexagon quilt layout (staggered columns).
 *
 * Geometry (side s):
 *   W = 2s (point-to-point)
 *   H = √3 s (flat-to-flat)
 *   dx = 1.5 s (column spacing)
 *   dy = H (row spacing within a column)
 *   Odd columns offset by H/2
 *
 * Piece convention (rectangular quilt top):
 *   - Full hexagons: columns × rows interior positions
 *   - Vertical half hexagons: 2 × rows (left + right straight edges)
 *   - Horizontal half hexagons: 2 × ceil(columns/2) when cols>1
 *     (top/bottom fill for staggered odd columns) — corners shared with
 *     vertical halves are not double-counted as extra trimmed pieces.
 *   trimmedPieces stays 0 under this template (true halves only).
 */

import type {
  HexPreviewCell,
  HexagonMeasurementType,
  HexagonQuiltResult,
  LengthUnit,
} from './types';

export const SQRT3 = Math.sqrt(3);
export const MAX_PREVIEW_CELLS = 350;
export const MAX_COLUMNS = 500;
export const MAX_ROWS = 500;

const TO_CM: Record<LengthUnit, number> = {
  mm: 0.1,
  cm: 1,
  m: 100,
  in: 2.54,
  ft: 30.48,
};

export function convertLengthToCm(value: number, unit: LengthUnit): number {
  return value * TO_CM[unit];
}

export function convertLengthFromCm(cm: number, unit: LengthUnit): number {
  return cm / TO_CM[unit];
}

export function convertLengthUnits(
  value: number,
  from: LengthUnit,
  to: LengthUnit,
): number {
  return convertLengthFromCm(convertLengthToCm(value, from), to);
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  const rounded = Number(n.toFixed(digits));
  if (Object.is(rounded, -0) || rounded === 0) return '0';
  return String(rounded);
}

export function formatLength(cm: number, unit: LengthUnit, digits = 2): string {
  return `${fmt(convertLengthFromCm(cm, unit), digits)} ${unit}`;
}

export function calculateHexagonWidth(sideCm: number): number {
  return 2 * sideCm;
}

export function calculateHexagonHeight(sideCm: number): number {
  return SQRT3 * sideCm;
}

export function calculateHexagonApothem(sideCm: number): number {
  return (SQRT3 / 2) * sideCm;
}

export function calculateHexagonArea(sideCm: number): number {
  return (3 * SQRT3) / 2 * sideCm * sideCm;
}

/** Normalize any measurement mode to finished side length (cm). */
export function convertHexagonMeasurement(
  valueCm: number,
  type: HexagonMeasurementType,
): number {
  if (type === 'side') return valueCm;
  if (type === 'pointToPoint') return valueCm / 2;
  return valueCm / SQRT3;
}

export function sideToMeasurement(
  sideCm: number,
  type: HexagonMeasurementType,
): number {
  if (type === 'side') return sideCm;
  if (type === 'pointToPoint') return calculateHexagonWidth(sideCm);
  return calculateHexagonHeight(sideCm);
}

/**
 * Outward edge offset by seam a: new apothem = old + a
 * → cuttingSide = s + 2a/√3
 */
export function calculateCuttingTemplate(
  finishedSideCm: number,
  seamAllowanceCm: number,
): {
  cuttingSideCm: number;
  cuttingPointToPointCm: number;
  cuttingFlatToFlatCm: number;
} {
  const a = Math.max(0, seamAllowanceCm);
  const cuttingSideCm = finishedSideCm + (2 * a) / SQRT3;
  return {
    cuttingSideCm,
    cuttingPointToPointCm: calculateHexagonWidth(cuttingSideCm),
    cuttingFlatToFlatCm: calculateHexagonHeight(cuttingSideCm),
  };
}

export function calculateHexagonColumns(
  desiredWidthCm: number,
  sideCm: number,
): number {
  const W = calculateHexagonWidth(sideCm);
  const dx = 1.5 * sideCm;
  if (desiredWidthCm <= W) return 1;
  const cols = Math.ceil((desiredWidthCm - W) / dx) + 1;
  return Math.min(MAX_COLUMNS, Math.max(1, cols));
}

export function calculateHexagonRows(
  desiredLengthCm: number,
  sideCm: number,
): number {
  const H = calculateHexagonHeight(sideCm);
  const rows = Math.ceil(desiredLengthCm / H);
  return Math.min(MAX_ROWS, Math.max(1, rows));
}

export function calculateActualQuiltWidth(
  columns: number,
  sideCm: number,
): number {
  const W = calculateHexagonWidth(sideCm);
  const dx = 1.5 * sideCm;
  return W + (columns - 1) * dx;
}

/**
 * With staggered odd columns, bounding height is rows*H + H/2.
 * Horizontal half hexagons finish the rectangle to that extent.
 */
export function calculateActualQuiltLength(
  rows: number,
  columns: number,
  sideCm: number,
): number {
  const H = calculateHexagonHeight(sideCm);
  if (columns <= 1) return rows * H;
  return rows * H + H / 2;
}

export function calculateFullHexagons(columns: number, rows: number): number {
  return columns * rows;
}

/** Left + right vertical half-hex templates. */
export function calculateVerticalHalfHexagons(rows: number): number {
  return 2 * rows;
}

/**
 * Top + bottom horizontal halves for odd-column stagger fill.
 * One half per odd column at top and bottom.
 */
export function calculateHorizontalHalfHexagons(columns: number): number {
  if (columns <= 1) return 0;
  const oddCols = Math.ceil(columns / 2);
  return 2 * oddCols;
}

export function calculateHalfHexagons(
  columns: number,
  rows: number,
): {
  vertical: number;
  horizontal: number;
  total: number;
} {
  const vertical = calculateVerticalHalfHexagons(rows);
  const horizontal = calculateHorizontalHalfHexagons(columns);
  return { vertical, horizontal, total: vertical + horizontal };
}

export function calculateEquivalentHexagons(
  full: number,
  half: number,
): number {
  return full + half / 2;
}

export function generateHexagonPolygon(
  cx: number,
  cy: number,
  side: number,
): Array<{ x: number; y: number }> {
  // Flat-top: vertices at 0°, 60°, ...
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    pts.push({
      x: cx + side * Math.cos(angle),
      y: cy + side * Math.sin(angle),
    });
  }
  return pts;
}

export function generateHexagonGrid(
  columns: number,
  rows: number,
  sideCm: number,
): HexPreviewCell[] {
  const dx = 1.5 * sideCm;
  const H = calculateHexagonHeight(sideCm);
  const cells: HexPreviewCell[] = [];

  for (let col = 0; col < columns; col++) {
    const cx = sideCm + col * dx;
    const yOffset = col % 2 === 1 ? H / 2 : 0;
    for (let row = 0; row < rows; row++) {
      cells.push({
        col,
        row,
        kind: 'full',
        cx,
        cy: H / 2 + row * H + yOffset,
      });
    }
  }
  return cells;
}

export function generateQuiltPreviewData(
  columns: number,
  rows: number,
  sideCm: number,
): {
  cells: HexPreviewCell[];
  simplified: boolean;
  note: string | null;
} {
  const fullCount = columns * rows;
  if (fullCount <= MAX_PREVIEW_CELLS) {
    return {
      cells: generateHexagonGrid(columns, rows, sideCm),
      simplified: false,
      note: null,
    };
  }
  // Representative scaled preview — counts elsewhere stay exact.
  const scale = Math.sqrt(MAX_PREVIEW_CELLS / fullCount);
  const previewCols = Math.max(1, Math.floor(columns * scale));
  const previewRows = Math.max(1, Math.floor(rows * scale));
  return {
    cells: generateHexagonGrid(previewCols, previewRows, sideCm),
    simplified: true,
    note: `Preview shows a ${previewCols}×${previewRows} sample; piece counts use the full ${columns}×${rows} layout.`,
  };
}

export function estimateFabricArea(
  equivalentHexagons: number,
  cuttingSideCm: number,
  wastePercent: number,
): number {
  const pieceArea = calculateHexagonArea(cuttingSideCm) * equivalentHexagons;
  return pieceArea * (1 + Math.max(0, wastePercent) / 100);
}

export function estimateFabricYardage(
  fabricAreaCm2: number,
  fabricWidthCm: number,
): { lengthCm: number; yards: number } {
  const width = Math.max(fabricWidthCm, 1e-9);
  const lengthCm = fabricAreaCm2 / width;
  const yards = lengthCm / 91.44; // 36 in = 91.44 cm
  return { lengthCm, yards };
}

export function calculateHexagonQuiltResults(params: {
  desiredWidthCm: number;
  desiredLengthCm: number;
  sideCm: number;
  seamAllowanceCm: number;
  fabricWidthCm: number | null;
  wastePercent: number;
}): HexagonQuiltResult {
  const {
    desiredWidthCm,
    desiredLengthCm,
    sideCm,
    seamAllowanceCm,
    fabricWidthCm,
    wastePercent,
  } = params;

  const pointToPointCm = calculateHexagonWidth(sideCm);
  const flatToFlatCm = calculateHexagonHeight(sideCm);
  const hexagonAreaCm2 = calculateHexagonArea(sideCm);
  const columns = calculateHexagonColumns(desiredWidthCm, sideCm);
  const rows = calculateHexagonRows(desiredLengthCm, sideCm);
  const fullHexagons = calculateFullHexagons(columns, rows);
  const halves = calculateHalfHexagons(columns, rows);
  const equivalentHexagons = calculateEquivalentHexagons(
    fullHexagons,
    halves.total,
  );
  const actualWidthCm = calculateActualQuiltWidth(columns, sideCm);
  const actualLengthCm = calculateActualQuiltLength(rows, columns, sideCm);
  const cutting = calculateCuttingTemplate(sideCm, seamAllowanceCm);
  const preview = generateQuiltPreviewData(columns, rows, sideCm);

  const warnings: string[] = [];
  if (columns >= MAX_COLUMNS || rows >= MAX_ROWS) {
    warnings.push('Layout hit the safety cap — reduce quilt size or enlarge hexagons.');
  }
  if (fullHexagons > 5000) {
    warnings.push('Very large project — counts are exact but sewing time will be substantial.');
  }
  if (actualWidthCm < desiredWidthCm - 1e-6 || actualLengthCm < desiredLengthCm - 1e-6) {
    warnings.push('Actual top is slightly under desired size due to discrete hex spacing.');
  }

  let estimatedFabricAreaCm2: number | null = null;
  let estimatedFabricLengthCm: number | null = null;
  let estimatedFabricYards: number | null = null;
  if (fabricWidthCm != null && fabricWidthCm > 0) {
    estimatedFabricAreaCm2 = estimateFabricArea(
      equivalentHexagons,
      cutting.cuttingSideCm,
      wastePercent,
    );
    const fab = estimateFabricYardage(estimatedFabricAreaCm2, fabricWidthCm);
    estimatedFabricLengthCm = fab.lengthCm;
    estimatedFabricYards = fab.yards;
  }

  return {
    sideLengthCm: sideCm,
    pointToPointCm,
    flatToFlatCm,
    hexagonAreaCm2,
    columns,
    rows,
    fullHexagons,
    verticalHalfHexagons: halves.vertical,
    horizontalHalfHexagons: halves.horizontal,
    halfHexagons: halves.total,
    trimmedPieces: 0,
    equivalentHexagons,
    desiredWidthCm,
    desiredLengthCm,
    actualWidthCm,
    actualLengthCm,
    cuttingSideCm: cutting.cuttingSideCm,
    cuttingPointToPointCm: cutting.cuttingPointToPointCm,
    cuttingFlatToFlatCm: cutting.cuttingFlatToFlatCm,
    estimatedFabricAreaCm2,
    estimatedFabricLengthCm,
    estimatedFabricYards,
    previewCells: preview.cells,
    previewSimplified: preview.simplified,
    previewNote: preview.note,
    formulaSteps: [
      `s = ${fmt(sideCm, 3)} cm · W=2s=${fmt(pointToPointCm, 3)} · H=√3 s=${fmt(flatToFlatCm, 3)}`,
      `A = (3√3/2)s² = ${fmt(hexagonAreaCm2, 2)} cm²`,
      `Columns = ${columns} · Rows = ${rows}`,
      `Full = ${fullHexagons} · Halves = ${halves.total} (V ${halves.vertical} + H ${halves.horizontal}) · Eq = ${fmt(equivalentHexagons, 1)}`,
      `Actual top ≈ ${fmt(actualWidthCm, 2)} × ${fmt(actualLengthCm, 2)} cm`,
      `Cutting s ≈ ${fmt(cutting.cuttingSideCm, 3)} cm (seam ${fmt(seamAllowanceCm, 3)} cm)`,
    ],
    explanation: `Flat-top staggered layout: ${columns} columns × ${rows} rows → ${fullHexagons} full hexagons and ${halves.total} half hexagons (equivalent ${fmt(equivalentHexagons, 1)}). Actual quilt top ≈ ${fmt(actualWidthCm, 1)} × ${fmt(actualLengthCm, 1)} cm.`,
    warnings,
  };
}
