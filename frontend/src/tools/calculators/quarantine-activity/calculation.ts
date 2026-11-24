/**
 * Quarantine Activity Calculator — UI stub (engine commit fills Mifflin × PAL + MET math).
 */

import type {
  HeightUnit,
  QuarantineActivityInput,
  QuarantineActivityResult,
  WeightUnit,
} from './types';

export const SOURCE_NOTE =
  'Omni-style work+home+exercise → PAL; Mifflin–St Jeor × PAL maintenance; Compendium MET activity deltas. Educational estimate only.';

export const DISCLAIMER =
  'Educational energy estimate for lifestyle planning — not medical nutrition therapy or clinical isolation guidance.';

export const EQUATION_LABEL = 'Mifflin–St Jeor × PAL (+ MET deltas)';

const LB_TO_KG = 0.45359237;
const IN_TO_CM = 2.54;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function heightToCm(value: number, unit: HeightUnit): number {
  return unit === 'cm' ? value : value * IN_TO_CM;
}

export function weightToKg(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? value : value * LB_TO_KG;
}

/** Omni getActivity_factor(work, household, exercise) — sum of 0–3 levels. */
export function palFromLevels(
  work: number,
  home: number,
  exercise: number,
): number | null {
  const sum = work + home + exercise;
  const map: Record<number, number> = {
    0: 1.2,
    1: 1.3,
    2: 1.4,
    3: 1.5,
    4: 1.6,
    5: 1.7,
    6: 1.8,
    7: 1.9,
    8: 2.0,
    9: 2.4,
  };
  return map[sum] ?? null;
}

export function formatPal(pal: number): string {
  return Number.isInteger(pal) ? String(pal) : pal.toFixed(1);
}

export function calculateQuarantineActivity(
  input: QuarantineActivityInput,
): QuarantineActivityResult {
  const pal = palFromLevels(input.work, input.home, input.exercise);
  return {
    pal,
    palDisplay: pal != null ? formatPal(pal) : '',
    maintenanceKcalPerDay: null,
    maintenanceDisplay: '',
    removedKcal: null,
    addedKcal: null,
    deltaKcal: null,
    deltaDisplay: '',
    statusHeadline: 'Enter age, height, and weight',
    statusDetail:
      'Complete anthropometrics to estimate maintenance calories (kcal/day). Activity swaps need weight + times.',
    equationLabel: EQUATION_LABEL,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
