/**
 * Net Carbs Calculator — UI stub (engine commit replaces with formulas).
 * ADR-018: pure module; no React/HTTP/Mongo.
 */

import type { NetCarbsInput, NetCarbsResult } from './types';

export const SOURCE_NOTE =
  'Educational label arithmetic: US/Canada totals include fiber; elsewhere fiber is already excluded. Approved polyols (erythritol, xylitol, mannitol, lactitol) deduct in full; other sugar alcohols deduct by half. Calories ≈ 4 kcal/g net carbs.';

export const DISCLAIMER =
  'Educational nutrition worksheet only — not medical advice, keto coaching, or a regulated “net carbs” claim.';

export const KCAL_PER_G_NET_CARBS = 4;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function formatGrams(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

export function formatKcal(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return '';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

function emptyResult(partial?: Partial<NetCarbsResult>): NetCarbsResult {
  return {
    netCarbsG: null,
    fiberSubtractedG: null,
    sugarAlcoholSubtractedG: null,
    polyolFactor: null,
    servings: null,
    totalNetCarbsG: null,
    caloriesFromNetCarbsKcal: null,
    statusHeadline: 'Enter total carbohydrates',
    statusDetail:
      'Enter total carbohydrates from the label. Fiber and sugar alcohols adjust net carbs by jurisdiction and polyol type.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

/** Stub — real net-carb math lands in the engine commit. */
export function calculateNetCarbs(_input: NetCarbsInput): NetCarbsResult {
  return emptyResult();
}
