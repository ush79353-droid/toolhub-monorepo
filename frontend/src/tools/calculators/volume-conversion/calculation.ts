import {
  MORE_OPTION_UNITS,
  VOLUME_UNIT_BY_ID,
  type VolumeConversionResult,
  type VolumeFieldId,
  type VolumeUnitId,
} from './types';

/** Readable volume display without ugly trailing zeros. */
export function formatVolume(value: number): string {
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

export function convertVolume(
  value: number,
  from: VolumeUnitId,
  to: VolumeUnitId
): number {
  if (from === to) return value;
  return fromLiters(toLiters(value, from), to);
}

export function valuesFromLiters(
  liters: number,
  units: VolumeConversionResult['units']
): VolumeConversionResult['values'] {
  return [
    fromLiters(liters, units[0]),
    fromLiters(liters, units[1]),
    fromLiters(liters, units[2]),
    fromLiters(liters, units[3]),
    fromLiters(liters, units[4]),
    fromLiters(liters, units[5]),
    fromLiters(liters, units[6]),
    fromLiters(liters, units[7]),
    fromLiters(liters, units[8]),
  ];
}

export function moreOptionsFromLiters(liters: number) {
  return MORE_OPTION_UNITS.map((id) => {
    const def = VOLUME_UNIT_BY_ID[id];
    return {
      unit: id,
      label: def.name,
      symbol: def.symbol,
      value: fromLiters(liters, id),
    };
  });
}

export function buildResult(
  liters: number,
  units: VolumeConversionResult['units']
): VolumeConversionResult {
  return {
    liters,
    values: valuesFromLiters(liters, units),
    units,
    moreOptions: moreOptionsFromLiters(liters),
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
  string,
];

export function draftTextsFromLiters(
  liters: number,
  units: VolumeConversionResult['units'],
  preserveField: VolumeFieldId | null,
  preserveText: string
): VolumeTexts {
  const values = valuesFromLiters(liters, units);
  return values.map((v, i) =>
    preserveField === i ? preserveText : formatVolume(v)
  ) as VolumeTexts;
}
