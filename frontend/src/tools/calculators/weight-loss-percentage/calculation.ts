/**
 * Weight loss percentage — educational (ADR-018).
 *
 * loss = past − current (kg)
 * percent = 100 × loss / past
 * Equal weights → 0; gain → negative with clear wording.
 * Derived loss/% are outputs only (no inverse solving).
 */

import type { WeightUnit, WlpInput, WlpResult } from './types';

export const SOURCE_NOTE =
  'Total weight loss = past weight − current weight. Weight loss % = 100 × loss ÷ past weight. Educational tracking aid — not medical advice.';

export const DISCLAIMER =
  'Weight change alone does not describe body composition or health. Interpret results with a qualified clinician when needed.';

const KG_PER_LB = 0.45359237;

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function toKg(value: number, unit: WeightUnit): number {
  switch (unit) {
    case 'kg':
      return value;
    case 'g':
      return value / 1000;
    case 'lb':
      return value * KG_PER_LB;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function fromKg(kg: number, unit: WeightUnit): number {
  switch (unit) {
    case 'kg':
      return kg;
    case 'g':
      return kg * 1000;
    case 'lb':
      return kg / KG_PER_LB;
    default: {
      const _exhaustive: never = unit;
      return _exhaustive;
    }
  }
}

export function formatAmount(value: number): string {
  return String(Number(value.toFixed(2)));
}

export function formatPercent(value: number): string {
  return String(Number(value.toFixed(2)));
}

function emptyResult(partial?: Partial<WlpResult>): WlpResult {
  return {
    pastKg: null,
    currentKg: null,
    lossKg: null,
    percent: null,
    formattedLoss: '',
    formattedPercent: '',
    lossDisplayUnit: 'kg',
    statusHeadline: 'Enter past and current weight.',
    statusDetail: 'Loss and percent update when both values are valid.',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

export function calculateWeightLoss(input: WlpInput): WlpResult {
  const pastRaw = parseNumber(input.pastText);
  const currentRaw = parseNumber(input.currentText);
  if (pastRaw === null || currentRaw === null) {
    return emptyResult({ lossDisplayUnit: input.pastUnit });
  }
  if (!(pastRaw > 0)) {
    return emptyResult({
      lossDisplayUnit: input.pastUnit,
      statusHeadline: 'Past weight must be greater than zero.',
      statusDetail: 'Percent loss divides by past weight; zero baseline is undefined.',
    });
  }
  if (!(currentRaw >= 0)) {
    return emptyResult({
      lossDisplayUnit: input.pastUnit,
      statusHeadline: 'Current weight cannot be negative.',
      statusDetail: 'Enter a non-negative current weight.',
    });
  }

  const pastKg = toKg(pastRaw, input.pastUnit);
  const currentKg = toKg(currentRaw, input.currentUnit);
  if (!(pastKg > 0) || !Number.isFinite(pastKg) || !Number.isFinite(currentKg)) {
    return emptyResult({
      lossDisplayUnit: input.pastUnit,
      statusHeadline: 'Unable to compute weight change.',
      statusDetail: 'Check that weights are finite and past weight is positive.',
    });
  }

  const lossKg = pastKg - currentKg;
  const percent = (100 * lossKg) / pastKg;
  const lossDisplay = fromKg(lossKg, input.pastUnit);

  let statusHeadline = 'Weight loss computed.';
  let statusDetail = 'Positive values mean weight lost relative to past weight.';
  if (lossKg === 0) {
    statusHeadline = 'No weight change.';
    statusDetail = 'Past and current weights are equal (0 kg / 0%).';
  } else if (lossKg < 0) {
    statusHeadline = 'Weight gain detected.';
    statusDetail =
      'Negative loss and percent mean current weight is higher than past weight.';
  }

  return {
    pastKg,
    currentKg,
    lossKg,
    percent,
    formattedLoss: formatAmount(lossDisplay),
    formattedPercent: formatPercent(percent),
    lossDisplayUnit: input.pastUnit,
    statusHeadline,
    statusDetail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}
