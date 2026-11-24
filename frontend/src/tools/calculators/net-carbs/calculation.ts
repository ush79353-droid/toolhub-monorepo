/**
 * Net Carbs Calculator — pure engine (ADR-018).
 *
 * US/Canada (fiber included in Total Carbohydrate):
 *   net = totalCarbs − fiber − (sugarAlcohol × factor)
 *
 * Elsewhere (carbohydrate already excludes fiber):
 *   net = totalCarbs − (sugarAlcohol × factor)
 *   (fiber is not subtracted again — avoids double subtraction)
 *
 * Polyol factor:
 *   1   when product sugar alcohols are only erythritol, xylitol, mannitol, or lactitol
 *   ½   otherwise (partially absorbed polyols)
 *
 * Meal: totalNet = max(0, net) × servings
 * Calories ≈ totalNet × 4 kcal/g
 *
 * “Net carbs” is an educational convention, not an FDA-regulated claim.
 * Sources: FDA/CFIA label conventions (fiber inclusion); common keto polyol
 * deduction practice as documented by Omni Calculator net-carbs methodology.
 */

import type { NetCarbsInput, NetCarbsResult } from './types';

export const SOURCE_NOTE =
  'Educational label arithmetic: US/Canada totals include fiber; elsewhere fiber is already excluded. Approved polyols (erythritol, xylitol, mannitol, lactitol) deduct in full; other sugar alcohols deduct by half. Calories ≈ 4 kcal/g net carbs.';

export const DISCLAIMER =
  'Educational nutrition worksheet only — not medical advice, keto coaching, or a regulated “net carbs” claim.';

export const KCAL_PER_G_NET_CARBS = 4;

/** Full deduction for erythritol / xylitol / mannitol / lactitol-only products. */
export const POLYOL_FACTOR_APPROVED = 1;
/** Half deduction for other / mixed sugar alcohols. */
export const POLYOL_FACTOR_OTHER = 0.5;

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

export function polyolFactor(approvedPolyolsOnly: NetCarbsInput['approvedPolyolsOnly']): number {
  return approvedPolyolsOnly === 'yes'
    ? POLYOL_FACTOR_APPROVED
    : POLYOL_FACTOR_OTHER;
}

/**
 * Core net-carb arithmetic. Fiber subtracts only when usaCanada is yes.
 * Result is floored at 0 (over-subtraction → 0 net carbs).
 */
export function computeNetCarbsG(args: {
  totalCarbsG: number;
  fiberG: number;
  sugarAlcoholG: number;
  usaCanada: NetCarbsInput['usaCanada'];
  approvedPolyolsOnly: NetCarbsInput['approvedPolyolsOnly'];
}): {
  netCarbsG: number;
  fiberSubtractedG: number;
  sugarAlcoholSubtractedG: number;
  factor: number;
} {
  const factor = polyolFactor(args.approvedPolyolsOnly);
  const fiberSubtractedG =
    args.usaCanada === 'yes' ? Math.max(0, args.fiberG) : 0;
  const sugarAlcoholSubtractedG = Math.max(0, args.sugarAlcoholG) * factor;
  const raw =
    args.totalCarbsG - fiberSubtractedG - sugarAlcoholSubtractedG;
  return {
    netCarbsG: Math.max(0, raw),
    fiberSubtractedG,
    sugarAlcoholSubtractedG,
    factor,
  };
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

export function calculateNetCarbs(input: NetCarbsInput): NetCarbsResult {
  const total = parseNumber(input.totalCarbsText);
  const fiberRaw = parseNumber(input.fiberText);
  const sugarRaw = parseNumber(input.sugarAlcoholText);
  const servingsRaw = parseNumber(input.servingsText);

  if (total === null) {
    return emptyResult();
  }

  const fiberG = fiberRaw ?? 0;
  const sugarAlcoholG = sugarRaw ?? 0;

  const computed = computeNetCarbsG({
    totalCarbsG: total,
    fiberG,
    sugarAlcoholG,
    usaCanada: input.usaCanada,
    approvedPolyolsOnly: input.approvedPolyolsOnly,
  });

  const servings =
    servingsRaw !== null && servingsRaw > 0 ? servingsRaw : null;
  const totalNetCarbsG =
    servings != null ? computed.netCarbsG * servings : null;
  const caloriesFromNetCarbsKcal =
    totalNetCarbsG != null
      ? totalNetCarbsG * KCAL_PER_G_NET_CARBS
      : null;

  const fiberNote =
    input.usaCanada === 'yes'
      ? `− ${formatGrams(computed.fiberSubtractedG)} g fiber`
      : 'fiber not subtracted (non-US/Canada label)';
  const polyolNote =
    computed.factor === POLYOL_FACTOR_APPROVED
      ? `− ${formatGrams(computed.sugarAlcoholSubtractedG)} g sugar alcohol (full)`
      : `− ${formatGrams(computed.sugarAlcoholSubtractedG)} g sugar alcohol (½ of ${formatGrams(sugarAlcoholG)} g)`;

  return {
    netCarbsG: computed.netCarbsG,
    fiberSubtractedG: computed.fiberSubtractedG,
    sugarAlcoholSubtractedG: computed.sugarAlcoholSubtractedG,
    polyolFactor: computed.factor,
    servings,
    totalNetCarbsG,
    caloriesFromNetCarbsKcal,
    statusHeadline: 'Net carbohydrates',
    statusDetail: `${formatGrams(total)} g total ${fiberNote}; ${polyolNote} → ${formatGrams(computed.netCarbsG)} g net.`,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
