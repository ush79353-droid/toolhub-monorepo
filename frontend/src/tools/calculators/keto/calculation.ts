/**
 * Keto Calculator — pure helpers (UI commit).
 * Engine commit wires Mifflin–St Jeor × PAL energy allocation and 75/5/20 macros.
 */

import type { HeightUnit, KetoInput, KetoResult, WeightUnit } from './types';

export function heightToCm(value: number, unit: HeightUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  switch (unit) {
    case 'cm':
      return value;
    case 'm':
      return value * 100;
    case 'in':
      return value * 2.54;
    case 'ft':
      return value * 30.48;
    default:
      return null;
  }
}

export function weightToKg(value: number, unit: WeightUnit): number | null {
  if (!Number.isFinite(value) || value <= 0) return null;
  switch (unit) {
    case 'kg':
      return value;
    case 'lb':
      return value * 0.45359237;
    case 'st':
      return value * 6.35029318;
    default:
      return null;
  }
}

export function convertHeight(
  value: number,
  from: HeightUnit,
  to: HeightUnit,
): number | null {
  const cm = heightToCm(value, from);
  if (cm == null) return null;
  switch (to) {
    case 'cm':
      return cm;
    case 'm':
      return cm / 100;
    case 'in':
      return cm / 2.54;
    case 'ft':
      return cm / 30.48;
    default:
      return null;
  }
}

export function convertWeight(
  value: number,
  from: WeightUnit,
  to: WeightUnit,
): number | null {
  const kg = weightToKg(value, from);
  if (kg == null) return null;
  switch (to) {
    case 'kg':
      return kg;
    case 'lb':
      return kg / 0.45359237;
    case 'st':
      return kg / 6.35029318;
    default:
      return null;
  }
}

/** UI commit stub — engine commit implements allocation + macros. */
export function calculateKeto(_input: KetoInput): KetoResult | null {
  return null;
}
