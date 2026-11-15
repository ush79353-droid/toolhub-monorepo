import {
  ML_PER_CUP,
  ML_PER_FL_OZ,
  ML_PER_IMPERIAL_FL_OZ,
  ML_PER_US_FL_OZ,
  ML_PER_US_GALLON,
  ML_PER_US_PINT,
  ML_PER_US_QUART,
  ML_PER_US_TBSP,
  ML_PER_US_TSP,
  type CupStandard,
  type FluidOunceStandard,
  type OtherUnitRow,
  type OzToCupsInput,
  type OzToCupsResult,
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

export function mlPerFlOz(standard: FluidOunceStandard): number {
  return ML_PER_FL_OZ[standard];
}

export function mlPerCup(standard: CupStandard): number {
  return ML_PER_CUP[standard];
}

export function flOzToMl(flOz: number, standard: FluidOunceStandard): number {
  return flOz * ML_PER_FL_OZ[standard];
}

export function mlToFlOz(ml: number, standard: FluidOunceStandard): number {
  return ml / ML_PER_FL_OZ[standard];
}

export function cupsToMl(cups: number, standard: CupStandard): number {
  return cups * ML_PER_CUP[standard];
}

export function mlToCups(ml: number, standard: CupStandard): number {
  return ml / ML_PER_CUP[standard];
}

function otherUnitsFromMl(ml: number): readonly OtherUnitRow[] {
  return [
    { unit: 'mL', label: 'Milliliters (mL)', value: ml },
    { unit: 'L', label: 'Liters (L)', value: ml / 1000 },
    { unit: 'cL', label: 'Centiliters (cL)', value: ml / 10 },
    { unit: 'US fl oz', label: 'US fluid ounces', value: ml / ML_PER_US_FL_OZ },
    {
      unit: 'Imp. fl oz',
      label: 'Imperial fluid ounces',
      value: ml / ML_PER_IMPERIAL_FL_OZ,
    },
    {
      unit: 'US cup',
      label: 'US customary cups',
      value: ml / ML_PER_CUP.usCustomary,
    },
    { unit: 'metric cup', label: 'Metric cups', value: ml / ML_PER_CUP.metric },
    { unit: 'tbsp', label: 'US tablespoons', value: ml / ML_PER_US_TBSP },
    { unit: 'tsp', label: 'US teaspoons', value: ml / ML_PER_US_TSP },
    { unit: 'pt', label: 'US liquid pints', value: ml / ML_PER_US_PINT },
    { unit: 'qt', label: 'US liquid quarts', value: ml / ML_PER_US_QUART },
    { unit: 'gal', label: 'US liquid gallons', value: ml / ML_PER_US_GALLON },
  ];
}

export function calculateOzToCups(input: OzToCupsInput): OzToCupsResult {
  let volumeMl: number;
  let flOz: number;
  let cups: number;

  if (input.source === 'flOz') {
    flOz = input.flOz!;
    volumeMl = flOzToMl(flOz, input.flOzStandard);
    cups = mlToCups(volumeMl, input.cupStandard);
  } else {
    cups = input.cups!;
    volumeMl = cupsToMl(cups, input.cupStandard);
    flOz = mlToFlOz(volumeMl, input.flOzStandard);
  }

  return {
    source: input.source,
    flOz,
    cups,
    flOzStandard: input.flOzStandard,
    cupStandard: input.cupStandard,
    volumeMl,
    mlPerFlOz: mlPerFlOz(input.flOzStandard),
    mlPerCup: mlPerCup(input.cupStandard),
    otherUnits: otherUnitsFromMl(volumeMl),
  };
}
