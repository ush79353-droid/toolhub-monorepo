/**
 * Pulmonary Vascular Resistance (PVR) — educational hemodynamics arithmetic.
 *
 * Wood units (WU) = (mPAP − LAP) / CO
 *   mPAP, LAP in mmHg; CO in L/min.
 * dyn·s·cm⁻⁵ = Wood units × 80
 *
 * LAP may be measured left atrial pressure or a pulmonary capillary wedge
 * pressure (PCWP / PAWP) surrogate when a direct LAP is unavailable — document
 * which value you enter; this tool does not convert or invent a wedge.
 *
 * Sources (teaching physiology):
 * - Wood units ↔ dyn·s·cm⁻⁵ factor of 80 (standard unit conversion).
 * - Resistance = driving pressure / flow framing in pulmonary hemodynamics
 *   (e.g. ESC/ERS pulmonary hypertension teaching summaries).
 *
 * Educational only — not a diagnosis or treatment recommendation.
 */

import type { PressureUnit, PvrResult, ResistanceUnit } from './types';

/** Torr (mmHg) per kPa. */
export const TORR_PER_KPA = 7.50061683;

/** Multiply Wood units by 80 to obtain dyn·s·cm⁻⁵. */
export const WOOD_TO_DYNES = 80;

export const SOURCE_NOTE =
  'PVR (Wood) = (mPAP − LAP) / CO with pressures in mmHg and CO in L/min; dyn·s·cm⁻⁵ = Wood × 80. LAP may be a PCWP/PAWP surrogate — label the measurement context. Educational physiology arithmetic only.';

export const DISCLAIMER =
  'This tool is for information purposes only and PVR should always be calculated separately as well as double-checked by health care provider.';

export function pressureToMmHg(value: number, unit: PressureUnit): number {
  return unit === 'kPa' ? value * TORR_PER_KPA : value;
}

export function mmHgToPressureUnit(mmHg: number, unit: PressureUnit): number {
  return unit === 'kPa' ? mmHg / TORR_PER_KPA : mmHg;
}

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function formatResistance(value: number): string {
  if (!Number.isFinite(value)) return '';
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return String(Number(rounded.toFixed(2)));
}

/**
 * Pure PVR from pressures in mmHg and CO in L/min.
 * Rejects non-positive CO and non-positive (mPAP − LAP) gradients.
 */
export function calculatePvr(args: {
  mpapMmHg: number;
  lapMmHg: number;
  coLPerMin: number;
  resistanceUnit: ResistanceUnit;
}): PvrResult {
  const { mpapMmHg, lapMmHg, coLPerMin, resistanceUnit } = args;
  if (!(coLPerMin > 0)) {
    throw new Error('Cardiac output must be positive.');
  }
  const delta = mpapMmHg - lapMmHg;
  if (!(delta > 0)) {
    throw new Error('mPAP must exceed LAP for a positive driving pressure.');
  }

  const woodUnits = delta / coLPerMin;
  const dynesSecCm5 = woodUnits * WOOD_TO_DYNES;
  const formattedWood = formatResistance(woodUnits);
  const formattedDynes = formatResistance(dynesSecCm5);
  const formattedPrimary =
    resistanceUnit === 'wood' ? formattedWood : formattedDynes;

  return {
    woodUnits,
    dynesSecCm5,
    mpapMmHg,
    lapMmHg,
    coLPerMin,
    formattedPrimary,
    formattedWood,
    formattedDynes,
    explanation: `PVR = (${formatResistance(mpapMmHg)} − ${formatResistance(lapMmHg)}) ÷ ${formatResistance(coLPerMin)} = ${formattedWood} Wood units; × ${WOOD_TO_DYNES} → ${formattedDynes} dyn·s·cm⁻⁵. Document whether LAP is direct left atrial pressure or a PCWP/PAWP surrogate.`,
    disclaimer: DISCLAIMER,
    sourceLabel: SOURCE_NOTE,
  };
}
