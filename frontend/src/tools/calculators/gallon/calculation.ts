import {
  APPROX_WATER_DENSITY_KG_PER_L,
  KILOGRAMS_PER_POUND,
  VOLUME_UNIT_BY_ID,
  type VolumeFieldId,
  type VolumeResult,
  type VolumeUnitId,
  type WaterWeightInput,
  type WaterWeightResult,
} from './types';

/** Readable volume/mass display without ugly trailing zeros. */
export function formatMeasure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e15 || (abs > 0 && abs < 1e-6)) {
    return value.toExponential(6).replace(/\.?0+e/, 'e').replace(/e\+?/, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 6;
  else if (abs >= 1) digits = 12;
  else digits = 14;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function toLiters(value: number, unit: VolumeUnitId): number {
  return value * VOLUME_UNIT_BY_ID[unit].toLiters;
}

export function fromLiters(liters: number, unit: VolumeUnitId): number {
  return liters / VOLUME_UNIT_BY_ID[unit].toLiters;
}

export function valuesFromLiters(
  liters: number,
  units: VolumeResult['units']
): VolumeResult['values'] {
  return [
    fromLiters(liters, units[0]),
    fromLiters(liters, units[1]),
    fromLiters(liters, units[2]),
    fromLiters(liters, units[3]),
    fromLiters(liters, units[4]),
    fromLiters(liters, units[5]),
    fromLiters(liters, units[6]),
    fromLiters(liters, units[7]),
  ];
}

export function buildVolumeResult(
  liters: number,
  units: VolumeResult['units']
): VolumeResult {
  return {
    liters,
    values: valuesFromLiters(liters, units),
    units,
  };
}

export function calculateWaterWeight(input: WaterWeightInput): WaterWeightResult {
  const density = input.densityKgPerL!;
  let volumeLiters: number;
  let massKg: number;

  if (input.source === 'volume') {
    volumeLiters = toLiters(input.volume!, input.volumeUnit);
    massKg = volumeLiters * density;
  } else if (input.source === 'massKg') {
    massKg = input.massKg!;
    volumeLiters = massKg / density;
  } else {
    massKg = input.massLb! * KILOGRAMS_PER_POUND;
    volumeLiters = massKg / density;
  }

  return {
    source: input.source,
    volume: fromLiters(volumeLiters, input.volumeUnit),
    volumeUnit: input.volumeUnit,
    volumeLiters,
    densityKgPerL: density,
    densityApproximate: density === APPROX_WATER_DENSITY_KG_PER_L,
    massKg,
    massLb: massKg / KILOGRAMS_PER_POUND,
  };
}

export type VolumeTexts = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

export function draftTextsFromLiters(
  liters: number,
  units: VolumeResult['units'],
  preserveField: VolumeFieldId | null,
  preserveText: string
): VolumeTexts {
  const values = valuesFromLiters(liters, units);
  return values.map((v, i) =>
    preserveField === i ? preserveText : formatMeasure(v)
  ) as VolumeTexts;
}
