import {
  DEFAULT_DROPS_PER_ML,
  ML_PER_US_FL_OZ,
  type DropsToMlInput,
  type DropsToMlResult,
  type OtherUnitRow,
} from './types';

/** Readable measure display without ugly trailing zeros. */
export function formatMeasure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  else digits = 18;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function dropsToMl(drops: number, dropsPerMl: number): number {
  return drops / dropsPerMl;
}

export function mlToDrops(ml: number, dropsPerMl: number): number {
  return ml * dropsPerMl;
}

export function mlPerDrop(dropsPerMl: number): number {
  return 1 / dropsPerMl;
}

export function dropsPerMlFromVolumePerDrop(volumePerDropMl: number): number {
  return 1 / volumePerDropMl;
}

/** Calibrate: observed drops / measured mL. */
export function calibrateDropsPerMl(observedDrops: number, measuredMl: number): number {
  return observedDrops / measuredMl;
}

function otherUnitsFromMl(ml: number): readonly OtherUnitRow[] {
  return [
    { unit: 'µL', label: 'Microliters (µL)', value: ml * 1000 },
    { unit: 'mL', label: 'Milliliters (mL)', value: ml },
    { unit: 'cL', label: 'Centiliters (cL)', value: ml / 10 },
    { unit: 'L', label: 'Liters (L)', value: ml / 1000 },
    { unit: 'cm³', label: 'Cubic centimeters (cm³)', value: ml },
    {
      unit: 'US fl oz',
      label: 'US fluid ounces',
      value: ml / ML_PER_US_FL_OZ,
    },
  ];
}

export function calculateDropsToMl(input: DropsToMlInput): DropsToMlResult {
  const dropsPerMl = input.dropsPerMl!;
  let drops: number;
  let ml: number;

  if (input.source === 'drops') {
    drops = input.drops!;
    ml = dropsToMl(drops, dropsPerMl);
  } else {
    ml = input.ml!;
    drops = mlToDrops(ml, dropsPerMl);
  }

  return {
    source: input.source,
    drops,
    ml,
    dropsPerMl,
    mlPerDrop: mlPerDrop(dropsPerMl),
    factorAssumed: dropsPerMl === DEFAULT_DROPS_PER_ML,
    otherUnits: otherUnitsFromMl(ml),
  };
}
