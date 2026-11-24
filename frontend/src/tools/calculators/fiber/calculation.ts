/**
 * Fiber Calculator — UI stub (ADR-019 commit 1).
 * Real IOM AI + 14 g/1,000 kcal engine lands in the engine commit.
 */

import type { FiberInput, FiberResult } from './types';

export const FIBER_G_PER_1000_KCAL = 14;
export const KCAL_PER_KJ = 1 / 4.184;

export const SOURCE_NOTE =
  'IOM Dietary Reference Intakes: Adequate Intake for total fiber by life-stage/sex; energy-density basis 14 g per 1,000 kcal. Optional Mifflin–St Jeor × PAL for maintenance energy.';

export const DISCLAIMER =
  'Educational nutrition arithmetic — not medical nutrition therapy or an individualized prescription.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function calculateFiber(_input: FiberInput): FiberResult {
  return {
    totalKcalPerDay: null,
    tdeeFromProfile: null,
    tdeeSource: null,
    energyScaledFiberG: null,
    aiFiberG: null,
    aiLabel: null,
    statusHeadline: 'Enter profile or daily calories',
    statusDetail:
      'Select sex and enter height, weight, age, and activity to estimate maintenance kcal, or enter recommended daily calorie intake directly. Fiber optimum uses 14 g per 1,000 kcal.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
