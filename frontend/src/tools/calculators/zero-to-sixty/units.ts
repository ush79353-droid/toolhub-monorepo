import type { PowerUnit, WeightUnit } from './types';

export const WATTS_PER_HP = 745.699872;
export const WATTS_PER_KW = 1000;
export const KG_PER_LB = 0.45359237;
export const MPS_PER_MPH = 0.44704;
export const FEET_PER_METER = 3.280839895013123;
export const STANDARD_GRAVITY = 9.80665; // m/s²

export const TARGET_60_MPH_MPS = 60 * MPS_PER_MPH; // 26.8224 m/s
export const TARGET_100_KMH_MPS = 100 / 3.6; // 27.77777777777778 m/s

export function powerToWatts(value: number, unit: PowerUnit): number {
  return unit === 'hp' ? value * WATTS_PER_HP : value * WATTS_PER_KW;
}

export function wattsToPower(watts: number, unit: PowerUnit): number {
  return unit === 'hp' ? watts / WATTS_PER_HP : watts / WATTS_PER_KW;
}

export function convertPower(value: number, from: PowerUnit, to: PowerUnit): number {
  if (from === to) return value;
  const watts = powerToWatts(value, from);
  return wattsToPower(watts, to);
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'lb' ? value * KG_PER_LB : value;
}

export function kgToWeight(kg: number, unit: WeightUnit): number {
  return unit === 'lb' ? kg / KG_PER_LB : kg;
}

export function convertWeight(value: number, from: WeightUnit, to: WeightUnit): number {
  if (from === to) return value;
  const kg = weightToKg(value, from);
  return kgToWeight(kg, to);
}

export function mpsToMph(mps: number): number {
  return mps / MPS_PER_MPH;
}

export function mphToMps(mph: number): number {
  return mph * MPS_PER_MPH;
}

export function mpsToKmh(mps: number): number {
  return mps * 3.6;
}

export function kmhToMps(kmh: number): number {
  return kmh / 3.6;
}

export function metersToFeet(m: number): number {
  return m * FEET_PER_METER;
}

export function feetToMeters(ft: number): number {
  return ft / FEET_PER_METER;
}

