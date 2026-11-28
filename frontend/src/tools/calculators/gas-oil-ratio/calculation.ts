/**
 * Gas–oil premix — canonical volume: milliliters.
 */

import type {
  FuelVolumeUnit,
  GasOilInput,
  GasOilResult,
} from './types';
import { VOLUME_UNIT_LABELS } from './types';

export const ML_PER_L = 1000;
export const ML_PER_US_FLOZ = 29.5735295625;
export const ML_PER_US_GAL = 3785.411784;
export const ML_PER_IMP_FLOZ = 28.4130625;
export const ML_PER_IMP_GAL = 4546.09;

const TO_ML: Record<FuelVolumeUnit, number> = {
  mL: 1,
  L: ML_PER_L,
  flOzUS: ML_PER_US_FLOZ,
  galUS: ML_PER_US_GAL,
  flOzImp: ML_PER_IMP_FLOZ,
  galImp: ML_PER_IMP_GAL,
};

export function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function toMilliliters(
  value: number,
  unit: FuelVolumeUnit,
): number {
  return value * TO_ML[unit];
}

export function fromMilliliters(
  ml: number,
  unit: FuelVolumeUnit,
): number {
  return ml / TO_ML[unit];
}

export function convertFuelVolume(
  value: number,
  from: FuelVolumeUnit,
  to: FuelVolumeUnit,
): number {
  if (from === to) return value;
  return fromMilliliters(toMilliliters(value, from), to);
}

export function calculateOilRequired(
  gasMl: number,
  ratio: number,
): number | null {
  if (!(gasMl >= 0) || !(ratio > 0)) return null;
  return gasMl / ratio;
}

export function calculateGasRequired(
  oilMl: number,
  ratio: number,
): number | null {
  if (!(oilMl >= 0) || !(ratio > 0)) return null;
  return oilMl * ratio;
}

export function calculateGasOilRatio(
  gasMl: number,
  oilMl: number,
): number | null {
  if (!(gasMl >= 0) || !(oilMl > 0)) return null;
  return gasMl / oilMl;
}

export function calculateTotalMixtureVolume(
  gasMl: number,
  oilMl: number,
): number | null {
  if (!(gasMl >= 0) || !(oilMl >= 0)) return null;
  return gasMl + oilMl;
}

export function calculateOilFromTotalMixture(
  totalMl: number,
  ratio: number,
): number | null {
  if (!(totalMl >= 0) || !(ratio > 0)) return null;
  return totalMl / (ratio + 1);
}

export function calculateGasFromTotalMixture(
  totalMl: number,
  ratio: number,
): number | null {
  if (!(totalMl >= 0) || !(ratio > 0)) return null;
  return (totalMl * ratio) / (ratio + 1);
}

/** Oil as % of total mixture = 100 / (ratio + 1) */
export function calculateOilPercentageOfMixture(
  ratio: number,
): number | null {
  if (!(ratio > 0)) return null;
  return 100 / (ratio + 1);
}

/** Oil as % of gasoline alone = 100 / ratio */
export function calculateOilPercentageOfGasoline(
  ratio: number,
): number | null {
  if (!(ratio > 0)) return null;
  return 100 / ratio;
}

export interface MixingChartRow {
  gasolineLabel: string;
  gasolineMl: number;
  oilsMl: Record<number, number>;
}

/** Chart for common ratios at fixed gasoline volumes. */
export function generateGasOilMixingChart(
  system: 'metric' | 'us',
  ratios: readonly number[] = [25, 32, 40, 50],
): MixingChartRow[] {
  const gasAmounts =
    system === 'metric'
      ? [
          { label: '1 L', ml: 1000 },
          { label: '2 L', ml: 2000 },
          { label: '3 L', ml: 3000 },
          { label: '4 L', ml: 4000 },
          { label: '5 L', ml: 5000 },
          { label: '10 L', ml: 10000 },
        ]
      : [
          { label: '1 US gal', ml: ML_PER_US_GAL },
          { label: '2 US gal', ml: ML_PER_US_GAL * 2 },
          { label: '5 US gal', ml: ML_PER_US_GAL * 5 },
        ];

  return gasAmounts.map((g) => {
    const oilsMl: Record<number, number> = {};
    for (const r of ratios) {
      oilsMl[r] = g.ml / r;
    }
    return {
      gasolineLabel: g.label,
      gasolineMl: g.ml,
      oilsMl,
    };
  });
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function formatVolume(ml: number, unit: FuelVolumeUnit): string {
  return `${fmt(fromMilliliters(ml, unit))} ${VOLUME_UNIT_LABELS[unit]}`;
}

export function calculateGasOilFromInput(
  input: GasOilInput,
): GasOilResult | null {
  const ratioRaw = parseNum(input.ratio);
  const steps: string[] = [];

  let ratio: number | null = null;
  let gasMl: number | null = null;
  let oilMl: number | null = null;
  let totalMl: number | null = null;

  if (input.mode === 'calculateOil') {
    if (ratioRaw == null || !(ratioRaw > 0)) return null;
    ratio = ratioRaw;
    const gasRaw = parseNum(input.gasVolume);
    if (gasRaw == null || gasRaw < 0) return null;
    gasMl = toMilliliters(gasRaw, input.gasUnit);
    oilMl = calculateOilRequired(gasMl, ratio);
    if (oilMl == null) return null;
    totalMl = calculateTotalMixtureVolume(gasMl, oilMl);
    steps.push(`Ratio = ${fmt(ratio, 0)}:1`);
    steps.push(`Gas = ${formatVolume(gasMl, input.gasUnit)} = ${fmt(gasMl)} mL`);
    steps.push(`Oil = ${fmt(gasMl)} / ${fmt(ratio, 0)} = ${fmt(oilMl)} mL`);
  } else if (input.mode === 'calculateGas') {
    if (ratioRaw == null || !(ratioRaw > 0)) return null;
    ratio = ratioRaw;
    const oilRaw = parseNum(input.oilVolume);
    if (oilRaw == null || oilRaw < 0) return null;
    oilMl = toMilliliters(oilRaw, input.oilUnit);
    gasMl = calculateGasRequired(oilMl, ratio);
    if (gasMl == null) return null;
    totalMl = calculateTotalMixtureVolume(gasMl, oilMl);
    steps.push(`Ratio = ${fmt(ratio, 0)}:1`);
    steps.push(`Oil = ${formatVolume(oilMl, input.oilUnit)} = ${fmt(oilMl)} mL`);
    steps.push(`Gas = ${fmt(oilMl)} × ${fmt(ratio, 0)} = ${fmt(gasMl)} mL`);
  } else if (input.mode === 'calculateRatio') {
    const gasRaw = parseNum(input.gasVolume);
    const oilRaw = parseNum(input.oilVolume);
    if (gasRaw == null || gasRaw < 0) return null;
    if (oilRaw == null || !(oilRaw > 0)) return null;
    gasMl = toMilliliters(gasRaw, input.gasUnit);
    oilMl = toMilliliters(oilRaw, input.oilUnit);
    ratio = calculateGasOilRatio(gasMl, oilMl);
    if (ratio == null) return null;
    totalMl = calculateTotalMixtureVolume(gasMl, oilMl);
    steps.push(`Gas = ${fmt(gasMl)} mL`);
    steps.push(`Oil = ${fmt(oilMl)} mL`);
    steps.push(`Ratio = ${fmt(gasMl)} / ${fmt(oilMl)} = ${fmt(ratio)}:1`);
  } else {
    // calculateTotalMixture
    if (ratioRaw == null || !(ratioRaw > 0)) return null;
    ratio = ratioRaw;
    const totalRaw = parseNum(input.totalMixtureVolume);
    if (totalRaw == null || totalRaw < 0) return null;
    totalMl = toMilliliters(totalRaw, input.totalMixtureUnit);
    oilMl = calculateOilFromTotalMixture(totalMl, ratio);
    gasMl = calculateGasFromTotalMixture(totalMl, ratio);
    if (oilMl == null || gasMl == null) return null;
    steps.push(`Desired total = ${fmt(totalMl)} mL · ratio ${fmt(ratio, 0)}:1`);
    steps.push(
      `Oil = ${fmt(totalMl)} / (${fmt(ratio, 0)} + 1) = ${fmt(oilMl)} mL`,
    );
    steps.push(
      `Gas = ${fmt(totalMl)} × ${fmt(ratio, 0)} / (${fmt(ratio, 0)} + 1) = ${fmt(gasMl)} mL`,
    );
  }

  const oilPctMix =
    ratio != null ? calculateOilPercentageOfMixture(ratio) : null;
  const oilPctGas =
    ratio != null ? calculateOilPercentageOfGasoline(ratio) : null;

  if (oilPctMix != null) {
    steps.push(`Oil % of mixture = 100 / (${fmt(ratio!, 0)} + 1) = ${fmt(oilPctMix, 4)}%`);
  }
  if (oilPctGas != null) {
    steps.push(`Oil % of gasoline = 100 / ${fmt(ratio!, 0)} = ${fmt(oilPctGas, 4)}%`);
  }
  if (totalMl != null) {
    steps.push(`Total mixture ≈ ${fmt(totalMl)} mL (${fmt(totalMl / 1000)} L)`);
  }

  return {
    mode: input.mode,
    ratio,
    gasVolumeMl: gasMl,
    oilVolumeMl: oilMl,
    totalMixtureMl: totalMl,
    oilPercentageOfMixture: oilPctMix,
    oilPercentageOfGasoline: oilPctGas,
    formattedGas:
      gasMl != null ? formatVolume(gasMl, input.gasUnit) : null,
    formattedOil:
      oilMl != null ? formatVolume(oilMl, input.oilUnit) : null,
    formattedTotal:
      totalMl != null
        ? formatVolume(totalMl, input.totalMixtureUnit)
        : null,
    formattedRatio: ratio != null ? `${fmt(ratio)}:1` : null,
    formulaSteps: steps,
    interpretation:
      'Volume-to-volume premix estimate. Always use the engine manufacturer’s recommended ratio and approved two-stroke oil. This tool does not replace product instructions.',
  };
}
