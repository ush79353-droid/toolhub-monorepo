import {
  CUBIC_FEET_PER_CCF,
  CUBIC_METERS_PER_CCF,
  LITERS_PER_CCF,
  LITERS_PER_IMP_GALLON,
  MILLILITERS_PER_LITER,
  US_GALLONS_PER_CCF,
  type CcfToGallonsInput,
  type CcfToGallonsResult,
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
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function ccfToUsGallons(ccf: number): number {
  return ccf * US_GALLONS_PER_CCF;
}

export function usGallonsToCcf(usGallons: number): number {
  return usGallons / US_GALLONS_PER_CCF;
}

function otherUnitsFromCcf(ccf: number): readonly OtherUnitRow[] {
  const liters = ccf * LITERS_PER_CCF;
  return [
    { unit: 'ft³', label: 'Cubic feet (ft³)', value: ccf * CUBIC_FEET_PER_CCF },
    { unit: 'm³', label: 'Cubic meters (m³)', value: ccf * CUBIC_METERS_PER_CCF },
    { unit: 'L', label: 'Liters (L)', value: liters },
    { unit: 'mL', label: 'Milliliters (mL)', value: liters * MILLILITERS_PER_LITER },
    { unit: 'US gal', label: 'US liquid gallons (US gal)', value: ccfToUsGallons(ccf) },
    { unit: 'imp gal', label: 'Imperial gallons (imp gal)', value: liters / LITERS_PER_IMP_GALLON },
  ];
}

export function calculateCcfToGallons(input: CcfToGallonsInput): CcfToGallonsResult {
  let ccf: number;
  let usGallons: number;

  if (input.source === 'ccf') {
    ccf = input.ccf!;
    usGallons = ccfToUsGallons(ccf);
  } else {
    usGallons = input.usGallons!;
    ccf = usGallonsToCcf(usGallons);
  }

  return {
    source: input.source,
    ccf,
    usGallons,
    cubicFeet: ccf * CUBIC_FEET_PER_CCF,
    otherUnits: otherUnitsFromCcf(ccf),
  };
}
