/**
 * Tire Size Calculator — pure geometry (unloaded theoretical).
 * MM_PER_IN = 25.4; MI_MM = 1_609_344.
 */

import type {
  DiameterBand,
  LengthUnit,
  SpeedUnit,
  TireComparison,
  TireConstruction,
  TireDimensions,
  TireFields,
  TireSizeResult,
} from './types';

export const MM_PER_IN = 25.4;
export const MM_PER_KM = 1_000_000;
export const MM_PER_MILE = 1_609_344;

export function convertLength(
  value: number,
  from: LengthUnit,
  to: LengthUnit,
): number {
  if (from === to) return value;
  const mm = from === 'mm' ? value : value * MM_PER_IN;
  return to === 'mm' ? mm : mm / MM_PER_IN;
}

export function convertWidthToMillimeters(
  value: number,
  unit: LengthUnit,
): number {
  return convertLength(value, unit, 'mm');
}

export function convertRimDiameterToMillimeters(
  value: number,
  unit: LengthUnit,
): number {
  return convertLength(value, unit, 'mm');
}

export function calculateTireSidewallHeight(
  widthMm: number,
  aspectRatio: number,
): number {
  return (widthMm * aspectRatio) / 100;
}

export function calculateTireDiameter(
  rimMm: number,
  sidewallMm: number,
): number {
  return rimMm + 2 * sidewallMm;
}

export function calculateTireCircumference(diameterMm: number): number {
  return Math.PI * diameterMm;
}

export function calculateRevolutionsPerKm(circumferenceMm: number): number {
  return MM_PER_KM / circumferenceMm;
}

export function calculateRevolutionsPerMile(circumferenceMm: number): number {
  return MM_PER_MILE / circumferenceMm;
}

export function generateTireCode(
  widthMm: number,
  aspectRatio: number,
  construction: TireConstruction,
  rimIn: number,
  loadIndex?: number | null,
  speedRating?: string | null,
): string {
  const w = Math.round(widthMm);
  const a = Number.isInteger(aspectRatio)
    ? String(aspectRatio)
    : String(Number(aspectRatio.toFixed(1)));
  const rim = Number.isInteger(rimIn)
    ? String(rimIn)
    : String(Number(rimIn.toFixed(2)));
  let code = `${w}/${a} ${construction}${rim}`;
  if (loadIndex != null && Number.isFinite(loadIndex)) {
    code += ` ${Math.round(loadIndex)}`;
  }
  if (speedRating) {
    code += loadIndex != null ? speedRating : ` ${speedRating}`;
  }
  return code;
}

/**
 * Parse common markings: 225/65R17, 225/65 R17, 225/65R17 98H
 */
export function parseTireCode(raw: string): {
  widthMm: number;
  aspectRatio: number;
  construction: TireConstruction;
  rimIn: number;
  loadIndex: number | null;
  speedRating: string | null;
} | null {
  const s = raw.trim().toUpperCase().replace(/\s+/g, ' ');
  const m = s.match(
    /^(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*([RBD])\s*(\d+(?:\.\d+)?)(?:\s+(\d{2,3})\s*([A-Z]{1,2}|ZR)?)?$/i,
  );
  if (!m) return null;
  const widthMm = Number(m[1]);
  const aspectRatio = Number(m[2]);
  const construction = m[3]!.toUpperCase() as TireConstruction;
  const rimIn = Number(m[4]);
  const loadIndex = m[5] ? Number(m[5]) : null;
  const speedRating = m[6] ? m[6].toUpperCase() : null;
  if (
    !(widthMm > 0) ||
    !(aspectRatio > 0) ||
    !(rimIn > 0) ||
    !['R', 'B', 'D'].includes(construction)
  ) {
    return null;
  }
  return {
    widthMm,
    aspectRatio,
    construction,
    rimIn,
    loadIndex,
    speedRating,
  };
}

export function calculateTireDimensions(
  width: number,
  widthUnit: LengthUnit,
  aspectRatio: number,
  construction: TireConstruction,
  rimDiameter: number,
  rimUnit: LengthUnit,
  loadIndex: number | null = null,
  speedRating: string | null = null,
): TireDimensions {
  const widthMm = convertWidthToMillimeters(width, widthUnit);
  const rimDiameterMm = convertRimDiameterToMillimeters(rimDiameter, rimUnit);
  const rimDiameterIn = convertLength(rimDiameter, rimUnit, 'in');
  const sidewallHeightMm = calculateTireSidewallHeight(widthMm, aspectRatio);
  const overallDiameterMm = calculateTireDiameter(
    rimDiameterMm,
    sidewallHeightMm,
  );
  const overallDiameterIn = overallDiameterMm / MM_PER_IN;
  const circumferenceMm = calculateTireCircumference(overallDiameterMm);
  const circumferenceIn = circumferenceMm / MM_PER_IN;
  const revolutionsPerKm = calculateRevolutionsPerKm(circumferenceMm);
  const revolutionsPerMile = calculateRevolutionsPerMile(circumferenceMm);
  const tireCode = generateTireCode(
    widthMm,
    aspectRatio,
    construction,
    rimDiameterIn,
    loadIndex,
    speedRating,
  );

  return {
    tireCode,
    widthMm,
    aspectRatio,
    construction,
    sidewallHeightMm,
    rimDiameterMm,
    rimDiameterIn,
    overallDiameterMm,
    overallDiameterIn,
    circumferenceMm,
    circumferenceIn,
    revolutionsPerKm,
    revolutionsPerMile,
    loadIndex,
    speedRating,
  };
}

export function calculateDiameterDifference(
  dNew: number,
  dOriginal: number,
): number {
  return dNew - dOriginal;
}

export function calculateDiameterPercentageDifference(
  dNew: number,
  dOriginal: number,
): number {
  return ((dNew - dOriginal) / dOriginal) * 100;
}

export function calculateGroundClearanceDifference(
  dNew: number,
  dOriginal: number,
): number {
  return (dNew - dOriginal) / 2;
}

export function calculateActualSpeed(
  indicated: number,
  dNew: number,
  dOriginal: number,
): number {
  return indicated * (dNew / dOriginal);
}

export function diameterBand(percentAbs: number): DiameterBand {
  if (percentAbs <= 1) return 'small';
  if (percentAbs <= 3) return 'moderate';
  return 'significant';
}

export function convertSpeed(
  value: number,
  from: SpeedUnit,
  to: SpeedUnit,
): number {
  if (from === to) return value;
  return from === 'mph' ? value * 1.609344 : value / 1.609344;
}

export function fmt(n: number, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  return String(Number(n.toFixed(digits)));
}

export function dimensionsFromFields(
  fields: TireFields,
  loadIndex: number | null,
  speedRating: string | null,
): TireDimensions {
  return calculateTireDimensions(
    Number(fields.width),
    fields.widthUnit,
    Number(fields.aspectRatio),
    fields.construction,
    Number(fields.rimDiameter),
    fields.rimUnit,
    loadIndex,
    speedRating,
  );
}

export function calculateTireSizeComparison(
  original: TireDimensions,
  replacement: TireDimensions,
  indicatedSpeed: number,
  indicatedSpeedUnit: SpeedUnit,
): TireComparison {
  const diameterDifferenceMm = calculateDiameterDifference(
    replacement.overallDiameterMm,
    original.overallDiameterMm,
  );
  const diameterDifferencePercent = calculateDiameterPercentageDifference(
    replacement.overallDiameterMm,
    original.overallDiameterMm,
  );
  const estimatedActualSpeed = calculateActualSpeed(
    indicatedSpeed,
    replacement.overallDiameterMm,
    original.overallDiameterMm,
  );
  const speedDifference = estimatedActualSpeed - indicatedSpeed;

  return {
    original,
    replacement,
    diameterDifferenceMm,
    diameterDifferencePercent,
    sidewallDifferenceMm:
      replacement.sidewallHeightMm - original.sidewallHeightMm,
    circumferenceDifferenceMm:
      replacement.circumferenceMm - original.circumferenceMm,
    widthDifferenceMm: replacement.widthMm - original.widthMm,
    groundClearanceDifferenceMm: calculateGroundClearanceDifference(
      replacement.overallDiameterMm,
      original.overallDiameterMm,
    ),
    indicatedSpeed,
    indicatedSpeedUnit,
    estimatedActualSpeed,
    speedDifference,
    speedErrorPercent: (speedDifference / indicatedSpeed) * 100,
    diameterBand: diameterBand(Math.abs(diameterDifferencePercent)),
  };
}

export function buildTireSizeResult(
  primary: TireDimensions,
  comparison: TireComparison | null,
): TireSizeResult {
  const formulaSteps = [
    `H = W × A / 100 = ${fmt(primary.widthMm, 2)} × ${fmt(primary.aspectRatio, 1)} / 100 = ${fmt(primary.sidewallHeightMm, 2)} mm`,
    `R_mm = ${fmt(primary.rimDiameterIn, 2)} in × 25.4 = ${fmt(primary.rimDiameterMm, 1)} mm`,
    `D = R_mm + 2H = ${fmt(primary.rimDiameterMm, 1)} + 2×${fmt(primary.sidewallHeightMm, 2)} = ${fmt(primary.overallDiameterMm, 1)} mm`,
    `C = πD ≈ ${fmt(primary.circumferenceMm, 1)} mm`,
    `Rev/km = 1,000,000 / C ≈ ${fmt(primary.revolutionsPerKm, 1)}`,
    `Rev/mi = 1,609,344 / C ≈ ${fmt(primary.revolutionsPerMile, 1)}`,
  ];

  let interpretation = `Tire ${primary.tireCode}: sidewall ${fmt(primary.sidewallHeightMm, 2)} mm, overall diameter ${fmt(primary.overallDiameterMm, 1)} mm (${fmt(primary.overallDiameterIn, 2)} in). Theoretical unloaded geometry.`;

  if (comparison) {
    formulaSteps.push(
      `ΔD = ${fmt(comparison.diameterDifferenceMm, 2)} mm (${fmt(comparison.diameterDifferencePercent, 2)}%)`,
      `ΔG ≈ ΔD/2 = ${fmt(comparison.groundClearanceDifferenceMm, 2)} mm`,
      `V_actual = ${fmt(comparison.indicatedSpeed, 1)} × D_new/D_orig ≈ ${fmt(comparison.estimatedActualSpeed, 2)} ${comparison.indicatedSpeedUnit}`,
    );
    interpretation += ` Compared with ${comparison.replacement.tireCode}: diameter change ${fmt(comparison.diameterDifferencePercent, 2)}% (${comparison.diameterBand} band — informational only).`;
  }

  return { primary, comparison, formulaSteps, interpretation };
}
