/**
 * Boost Horsepower — ideal absolute-pressure-ratio model.
 *
 * HP_boosted = HP × (P_boost + P_atm) / P_atm
 * P_boost = P_atm × (HP_boosted / HP − 1)
 * HP = HP_boosted / (1 + P_boost / P_atm)
 */

import {
  DEFAULT_ATMOSPHERIC_PSI,
  type BoostComparisonPoint,
  type BoostHorsepowerInput,
  type BoostHorsepowerResult,
  type HorsepowerUnit,
  type PressureUnit,
} from './types';

export const HP_TO_W = 745.699872;
export const PS_TO_W = 735.49875;
export const PSI_TO_KPA = 6.894757293;

function fmt(n: number, digits = 2): string {
  return n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function convertHorsepower(
  value: number,
  from: HorsepowerUnit,
  to: HorsepowerUnit,
): number {
  const toW: Record<HorsepowerUnit, number> = {
    hp: HP_TO_W,
    PS: PS_TO_W,
    kW: 1000,
    W: 1,
  };
  return (value * toW[from]) / toW[to];
}

export function toMechanicalHp(value: number, unit: HorsepowerUnit): number {
  return convertHorsepower(value, unit, 'hp');
}

export function fromMechanicalHp(hp: number, unit: HorsepowerUnit): number {
  return convertHorsepower(hp, 'hp', unit);
}

export function convertBoostPressure(
  value: number,
  from: PressureUnit,
  to: PressureUnit,
): number {
  const toKpa: Record<PressureUnit, number> = {
    psi: PSI_TO_KPA,
    kPa: 1,
    bar: 100,
    mbar: 0.1,
    Pa: 0.001,
  };
  return (value * toKpa[from]) / toKpa[to];
}

export function toPsi(value: number, unit: PressureUnit): number {
  return convertBoostPressure(value, unit, 'psi');
}

export function fromPsi(psi: number, unit: PressureUnit): number {
  return convertBoostPressure(psi, 'psi', unit);
}

export function calculatePressureRatio(
  boostPsi: number,
  atmPsi: number,
): number | null {
  if (![boostPsi, atmPsi].every(Number.isFinite) || atmPsi <= 0) return null;
  return (boostPsi + atmPsi) / atmPsi;
}

export function calculateBoostedHorsepower(
  originalHp: number,
  boostPsi: number,
  atmPsi: number = DEFAULT_ATMOSPHERIC_PSI,
): number | null {
  if (
    ![originalHp, boostPsi, atmPsi].every(Number.isFinite) ||
    originalHp < 0 ||
    boostPsi < 0 ||
    atmPsi <= 0
  ) {
    return null;
  }
  return originalHp * ((boostPsi + atmPsi) / atmPsi);
}

export function calculateRequiredBoost(
  originalHp: number,
  boostedHp: number,
  atmPsi: number = DEFAULT_ATMOSPHERIC_PSI,
): number | null {
  if (
    ![originalHp, boostedHp, atmPsi].every(Number.isFinite) ||
    originalHp <= 0 ||
    boostedHp < 0 ||
    atmPsi <= 0
  ) {
    return null;
  }
  return atmPsi * (boostedHp / originalHp - 1);
}

export function calculateOriginalHorsepower(
  boostedHp: number,
  boostPsi: number,
  atmPsi: number = DEFAULT_ATMOSPHERIC_PSI,
): number | null {
  if (
    ![boostedHp, boostPsi, atmPsi].every(Number.isFinite) ||
    boostedHp < 0 ||
    boostPsi < 0 ||
    atmPsi <= 0
  ) {
    return null;
  }
  const denom = 1 + boostPsi / atmPsi;
  if (denom <= 0) return null;
  return boostedHp / denom;
}

export function calculateHorsepowerGain(
  originalHp: number,
  boostedHp: number,
): number {
  return boostedHp - originalHp;
}

export function calculatePercentageIncrease(
  originalHp: number,
  boostedHp: number,
): number | null {
  if (!(originalHp > 0)) return originalHp === 0 ? 0 : null;
  return ((boostedHp - originalHp) / originalHp) * 100;
}

export function calculateAdjustedHorsepower(
  originalHp: number,
  idealBoostedHp: number,
  efficiency: number,
): number | null {
  if (
    ![originalHp, idealBoostedHp, efficiency].every(Number.isFinite) ||
    efficiency < 0 ||
    efficiency > 1
  ) {
    return null;
  }
  return originalHp + (idealBoostedHp - originalHp) * efficiency;
}

export function generateBoostComparisonData(
  originalHp: number,
  atmPsi: number,
  levels: readonly number[] = [0, 3, 6, 9, 12, 15, 18, 21],
): BoostComparisonPoint[] {
  if (!(originalHp >= 0) || !(atmPsi > 0)) return [];
  return levels.map((boostPsi) => ({
    boostPsi,
    boostedHp: originalHp * ((boostPsi + atmPsi) / atmPsi),
  }));
}

function parseNum(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateBoostHorsepowerFromInput(
  input: BoostHorsepowerInput,
): BoostHorsepowerResult | null {
  const atmRaw = parseNum(input.atmosphericPressure);
  if (atmRaw == null || atmRaw <= 0) return null;
  const atmPsi = toPsi(atmRaw, input.atmosphericPressureUnit);
  if (!(atmPsi > 0)) return null;

  let originalHp: number | null = null;
  let boostPsi: number | null = null;
  let boostedHp: number | null = null;
  const steps: string[] = [];
  let primaryLabel = 'Ideal Boosted Engine Power';
  let formattedPrimary = '';

  if (input.mode === 'boostedHorsepower') {
    const n = parseNum(input.originalHorsepower);
    const p = parseNum(input.boostPressure);
    if (n == null || n < 0 || p == null || p < 0) return null;
    originalHp = toMechanicalHp(n, input.horsepowerUnit);
    boostPsi = toPsi(p, input.boostPressureUnit);
    boostedHp = calculateBoostedHorsepower(originalHp, boostPsi, atmPsi);
    if (boostedHp == null) return null;
    steps.push(
      'Boosted HP = Original HP × (Boost + Atmospheric Pressure) / Atmospheric Pressure',
    );
    steps.push(
      `Boosted HP = ${fmt(originalHp)} × (${fmt(boostPsi)} + ${fmt(atmPsi)}) / ${fmt(atmPsi)}`,
    );
    steps.push(
      `Boosted HP = ${fmt(originalHp)} × ${fmt((boostPsi + atmPsi) / atmPsi, 5)}`,
    );
    steps.push(`Boosted HP = ${fmt(boostedHp)} hp`);
    formattedPrimary = `${fmt(fromMechanicalHp(boostedHp, input.horsepowerUnit))} ${input.horsepowerUnit}`;
  } else if (input.mode === 'requiredBoost') {
    const n = parseNum(input.originalHorsepower);
    const t = parseNum(input.targetHorsepower);
    if (n == null || n <= 0 || t == null || t < 0) return null;
    originalHp = toMechanicalHp(n, input.horsepowerUnit);
    boostedHp = toMechanicalHp(t, input.targetHorsepowerUnit);
    if (boostedHp < originalHp) return null;
    boostPsi = calculateRequiredBoost(originalHp, boostedHp, atmPsi);
    if (boostPsi == null || boostPsi < 0) return null;
    steps.push('P_boost = P_atm × (HP_boosted / HP_current − 1)');
    steps.push(
      `P_boost = ${fmt(atmPsi)} × (${fmt(boostedHp)} / ${fmt(originalHp)} − 1)`,
    );
    steps.push(`P_boost = ${fmt(boostPsi)} psi`);
    primaryLabel = 'Required Boost Pressure';
    formattedPrimary = `${fmt(fromPsi(boostPsi, input.boostPressureUnit))} ${input.boostPressureUnit}`;
  } else {
    const t = parseNum(input.targetHorsepower);
    const p = parseNum(input.boostPressure);
    if (t == null || t < 0 || p == null || p < 0) return null;
    boostedHp = toMechanicalHp(t, input.targetHorsepowerUnit);
    boostPsi = toPsi(p, input.boostPressureUnit);
    originalHp = calculateOriginalHorsepower(boostedHp, boostPsi, atmPsi);
    if (originalHp == null) return null;
    steps.push('HP_current = HP_boosted / (1 + P_boost / P_atm)');
    steps.push(
      `HP_current = ${fmt(boostedHp)} / (1 + ${fmt(boostPsi)} / ${fmt(atmPsi)})`,
    );
    steps.push(`HP_current = ${fmt(originalHp)} hp`);
    primaryLabel = 'Original Engine Horsepower';
    formattedPrimary = `${fmt(fromMechanicalHp(originalHp, input.horsepowerUnit))} ${input.horsepowerUnit}`;
  }

  if (originalHp == null || boostPsi == null || boostedHp == null) return null;

  const ratio = calculatePressureRatio(boostPsi, atmPsi);
  if (ratio == null) return null;
  const gain = calculateHorsepowerGain(originalHp, boostedHp);
  const pct = calculatePercentageIncrease(originalHp, boostedHp) ?? 0;

  let adjusted: number | null = null;
  let eff: number | null = null;
  if (input.enableAdvanced) {
    const e = parseNum(input.efficiencyFactor);
    if (e != null && e >= 0 && e <= 1) {
      eff = e;
      adjusted = calculateAdjustedHorsepower(originalHp, boostedHp, e);
    }
  }

  return {
    mode: input.mode,
    originalHorsepowerHp: originalHp,
    boostedHorsepowerHp: boostedHp,
    boostPressurePsi: boostPsi,
    atmosphericPressurePsi: atmPsi,
    absolutePressurePsi: boostPsi + atmPsi,
    pressureRatio: ratio,
    horsepowerGainHp: gain,
    percentageIncrease: pct,
    adjustedHorsepowerHp: adjusted,
    efficiencyFactor: eff,
    formulaSteps: steps,
    comparison: generateBoostComparisonData(originalHp, atmPsi),
    interpretation:
      'Ideal absolute-pressure-ratio estimate. Real gains depend on charge temperature, compressor efficiency, fueling, and tuning — not a measured dyno result.',
    formattedPrimary,
    primaryLabel,
    horsepowerUnit: input.horsepowerUnit,
    boostPressureUnit: input.boostPressureUnit,
  };
}

export { fmt };
