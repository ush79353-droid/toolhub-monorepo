/**
 * UK Coin Weight Calculator — pure engine (ADR-018).
 *
 * totalGrams = Σ count_i × RoyalMintMass_i
 * Display kg = totalGrams / 1000 (unit switch preserves grams).
 */

import {
  MAX_COIN_COUNT,
  UK_COIN_IDS,
  UK_COIN_LABELS,
  UK_COIN_MASS_GRAMS,
  UK_COIN_VALUE_PENCE,
  type UkCoinId,
} from './constants';
import type {
  UkCoinWeightBreakdownRow,
  UkCoinWeightInput,
  UkCoinWeightResult,
  WeightUnit,
} from './types';

function parseCount(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  if (!/^\d+$/.test(t)) return null;
  const n = Number(t);
  return Number.isSafeInteger(n) ? n : null;
}

export function formatMass(n: number, unit: WeightUnit, digits = 2): string {
  if (!Number.isFinite(n)) return '—';
  const formatted = n.toLocaleString('en-GB', {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
  return `${formatted} ${unit}`;
}

export function gramsToDisplay(totalGrams: number, unit: WeightUnit): number {
  return unit === 'kg' ? totalGrams / 1000 : totalGrams;
}

export function formatFaceValuePence(pence: number): string {
  if (!Number.isFinite(pence) || pence < 0) return '—';
  const pounds = pence / 100;
  return pounds.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });
}

export function calculateUkCoinWeightFromInput(
  input: UkCoinWeightInput,
): UkCoinWeightResult | null {
  const breakdown: UkCoinWeightBreakdownRow[] = [];
  let totalGrams = 0;
  let totalCoins = 0;
  let totalValuePence = 0;

  for (const id of UK_COIN_IDS) {
    const count = parseCount(input[id]);
    if (count === null) return null;
    if (count < 0 || count > MAX_COIN_COUNT) return null;
    const mass = UK_COIN_MASS_GRAMS[id];
    const subtotal = count * mass;
    if (!Number.isFinite(subtotal)) return null;
    totalGrams += subtotal;
    totalCoins += count;
    totalValuePence += count * UK_COIN_VALUE_PENCE[id];
    breakdown.push({
      id,
      label: UK_COIN_LABELS[id],
      count,
      massPerCoinGrams: mass,
      subtotalGrams: subtotal,
      formattedSubtotalGrams: formatMass(subtotal, 'g', 4),
    });
  }

  if (!Number.isFinite(totalGrams)) return null;

  const unit = input.weightUnit;
  const totalKilograms = totalGrams / 1000;
  const displayWeight = gramsToDisplay(totalGrams, unit);

  const steps = breakdown
    .filter((row) => row.count > 0)
    .map(
      (row) =>
        `${row.count.toLocaleString('en-GB')} × ${row.massPerCoinGrams} g (${row.label}) = ${row.formattedSubtotalGrams}`,
    );

  if (steps.length === 0) {
    steps.push('All counts are zero → total weight 0 g.');
  } else {
    steps.push(
      `Sum = ${formatMass(totalGrams, 'g', 4)} = ${formatMass(totalKilograms, 'kg', 6)}.`,
    );
  }

  return {
    weightUnit: unit,
    totalGrams,
    totalKilograms,
    displayWeight,
    formattedDisplayWeight: formatMass(displayWeight, unit, unit === 'kg' ? 6 : 4),
    totalCoins,
    totalValuePence,
    formattedFaceValue: formatFaceValuePence(totalValuePence),
    breakdown,
    formulaBreakdown:
      'totalGrams = Σ (count × Royal Mint standard mass)\nDisplay kg = totalGrams / 1000',
    steps,
    interpretation:
      totalCoins === 0
        ? 'Enter coin counts to estimate total mass from Royal Mint standard weights.'
        : `Estimated mass of ${totalCoins.toLocaleString('en-GB')} coin(s) is ${formatMass(totalGrams, 'g', 4)} (${formatMass(totalKilograms, 'kg', 6)}). Face value of those counts is ${formatFaceValuePence(totalValuePence)}.`,
    explanation:
      'Uses published Royal Mint standard masses for currently circulating 1p–£2 pieces. Real coins vary slightly within manufacturing tolerance; commemorative or withdrawn designs may differ. Unit switching changes display only (grams preserved).',
  };
}

export function parseCoinCountField(raw: string): {
  value: number | null;
  blank: boolean;
  invalid: boolean;
} {
  const cleaned = raw.trim().replace(/,/g, '');
  if (cleaned === '') return { value: null, blank: true, invalid: false };
  const value = parseCount(cleaned);
  if (value === null) return { value: null, blank: false, invalid: true };
  return { value, blank: false, invalid: false };
}

export type { UkCoinId };
