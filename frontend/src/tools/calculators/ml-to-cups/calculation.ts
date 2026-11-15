import {
  ML_PER_CUP,
  ML_PER_US_FL_OZ,
  ML_PER_US_GALLON,
  ML_PER_US_PINT,
  ML_PER_US_QUART,
  ML_PER_US_TBSP,
  ML_PER_US_TSP,
  type CupStandard,
  type MlToCupsInput,
  type MlToCupsResult,
  type OtherUnitRow,
} from './types';

/** Readable volume display without ugly trailing zeros. */
export function formatVolume(value: number): string {
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

export function mlPerCup(standard: CupStandard): number {
  return ML_PER_CUP[standard];
}

export function mlToCups(ml: number, standard: CupStandard): number {
  return ml / ML_PER_CUP[standard];
}

export function cupsToMl(cups: number, standard: CupStandard): number {
  return cups * ML_PER_CUP[standard];
}

function otherUnitsFromMl(ml: number): readonly OtherUnitRow[] {
  return [
    { unit: 'L', label: 'Liters (L)', value: ml / 1000 },
    { unit: 'cL', label: 'Centiliters (cL)', value: ml / 10 },
    { unit: 'US fl oz', label: 'US fluid ounces', value: ml / ML_PER_US_FL_OZ },
    { unit: 'tbsp', label: 'US tablespoons', value: ml / ML_PER_US_TBSP },
    { unit: 'tsp', label: 'US teaspoons', value: ml / ML_PER_US_TSP },
    { unit: 'pt', label: 'US liquid pints', value: ml / ML_PER_US_PINT },
    { unit: 'qt', label: 'US liquid quarts', value: ml / ML_PER_US_QUART },
    { unit: 'gal', label: 'US liquid gallons', value: ml / ML_PER_US_GALLON },
  ];
}

export function calculateMlToCups(input: MlToCupsInput): MlToCupsResult {
  let ml: number;
  let cups: number;

  if (input.source === 'ml') {
    ml = input.ml!;
    cups = mlToCups(ml, input.cupStandard);
  } else {
    cups = input.cups!;
    ml = cupsToMl(cups, input.cupStandard);
  }

  return {
    source: input.source,
    ml,
    cups,
    cupStandard: input.cupStandard,
    mlPerCup: mlPerCup(input.cupStandard),
    otherUnits: otherUnitsFromMl(ml),
  };
}
