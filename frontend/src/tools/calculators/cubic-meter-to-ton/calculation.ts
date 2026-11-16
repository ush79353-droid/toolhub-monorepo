import { CUSTOM_MATERIAL_ID, findMaterial } from './materials';
import {
  DENSITY_UNIT_OPTIONS,
  KG_PER_M3_PER_DENSITY_UNIT,
  KG_PER_TON,
  TON_UNIT_LABEL,
  type CubicMeterToTonInput,
  type CubicMeterToTonResult,
  type DensityUnit,
  type TonUnit,
} from './types';

/** Readable measure display without ugly trailing zeros. */
export function formatMeasure(value: number): string {
  if (!Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e12)) {
    return value
      .toExponential(10)
      .replace(/(\.\d*?[1-9])0+e/i, '$1e')
      .replace(/\.0+e/i, 'e');
  }
  let digits = 12;
  if (abs >= 1_000_000) digits = 4;
  else if (abs >= 1) digits = 12;
  else if (abs >= 1e-6) digits = 14;
  const rounded = Number(value.toFixed(digits));
  return String(rounded);
}

export function densityToKgPerM3(value: number, unit: DensityUnit): number {
  return value * KG_PER_M3_PER_DENSITY_UNIT[unit];
}

export function kgPerM3ToDensity(kgPerM3: number, unit: DensityUnit): number {
  return kgPerM3 / KG_PER_M3_PER_DENSITY_UNIT[unit];
}

export function cubicMetersToTons(
  volumeM3: number,
  densityKgM3: number,
  unit: TonUnit = 'metricTonne',
): number {
  if (
    !Number.isFinite(volumeM3) ||
    !Number.isFinite(densityKgM3) ||
    volumeM3 < 0 ||
    densityKgM3 <= 0
  ) {
    throw new Error('Invalid volume or density');
  }
  const result = (volumeM3 * densityKgM3) / KG_PER_TON[unit];
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function tonsToCubicMeters(
  massTons: number,
  densityKgM3: number,
  unit: TonUnit = 'metricTonne',
): number {
  if (
    !Number.isFinite(massTons) ||
    !Number.isFinite(densityKgM3) ||
    massTons < 0 ||
    densityKgM3 <= 0
  ) {
    throw new Error('Invalid mass or density');
  }
  const result = (massTons * KG_PER_TON[unit]) / densityKgM3;
  if (!Number.isFinite(result)) {
    throw new Error('Conversion result is out of range');
  }
  return result;
}

export function resolveDensityKgPerM3(input: CubicMeterToTonInput): number | null {
  if (input.densityValue === null || !Number.isFinite(input.densityValue)) return null;
  if (input.densityValue <= 0) return null;
  return densityToKgPerM3(input.densityValue, input.densityUnit);
}

export function calculateCubicMeterToTon(input: CubicMeterToTonInput): CubicMeterToTonResult {
  const densityKgPerM3 = resolveDensityKgPerM3(input)!;
  let volumeM3: number;
  let massKg: number;

  if (input.source === 'volume') {
    volumeM3 = input.volumeM3!;
    massKg = volumeM3 * densityKgPerM3;
  } else {
    massKg = input.massTons! * KG_PER_TON[input.tonUnit];
    volumeM3 = massKg / densityKgPerM3;
  }

  const massTons = massKg / KG_PER_TON[input.tonUnit];
  const material =
    input.materialId === CUSTOM_MATERIAL_ID ? undefined : findMaterial(input.materialId);
  const tonLabel = TON_UNIT_LABEL[input.tonUnit];

  const explanation =
    input.source === 'volume'
      ? `${formatMeasure(volumeM3)} m³ × ${formatMeasure(densityKgPerM3)} kg/m³ ÷ ${KG_PER_TON[input.tonUnit]} = ${formatMeasure(massTons)} ${tonLabel}`
      : `${formatMeasure(massTons)} ${tonLabel} × ${KG_PER_TON[input.tonUnit]} ÷ ${formatMeasure(densityKgPerM3)} kg/m³ = ${formatMeasure(volumeM3)} m³`;

  return {
    source: input.source,
    materialId: input.materialId,
    materialName: material?.name ?? 'Custom density',
    densityKgPerM3,
    densityApproximate: material?.approximate ?? true,
    densityValue: input.densityValue!,
    densityUnit: input.densityUnit,
    volumeM3,
    massTons,
    massKg,
    tonUnit: input.tonUnit,
    explanation,
  };
}

export function shareResultText(result: CubicMeterToTonResult): string {
  const densityUnitLabel =
    DENSITY_UNIT_OPTIONS.find((o) => o.value === result.densityUnit)?.label ?? result.densityUnit;
  const tonLabel = TON_UNIT_LABEL[result.tonUnit];

  return [
    'Cubic Meter to Ton Converter',
    'Omega Calculators',
    '',
    `Material: ${result.materialName}`,
    `Density: ${formatMeasure(result.densityValue)} ${densityUnitLabel}${
      result.densityApproximate ? ' (approximate)' : ''
    }`,
    `Volume: ${formatMeasure(result.volumeM3)} m³`,
    `Mass: ${formatMeasure(result.massTons)} ${tonLabel}`,
  ].join('\n');
}
