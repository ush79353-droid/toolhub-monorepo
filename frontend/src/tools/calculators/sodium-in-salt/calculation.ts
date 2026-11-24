/**
 * Sodium in Salt Calculator — UI stub (engine commit replaces with formulas).
 * ADR-018: pure module; no React/HTTP/Mongo.
 *
 * Pure NaCl sodium mass fraction uses published atomic masses 22.99/58.44 only.
 */

import type {
  PureSaltUnit,
  SaltAmountUnit,
  SaltTypeId,
  SodiumInSaltInput,
  SodiumInSaltResult,
  SodiumUnit,
} from './types';
import { getSaltTypeOption } from './types';

/** Atomic mass of sodium (published). */
export const NA_ATOMIC_MASS = 22.99;
/** Formula mass of NaCl (published). */
export const NACL_FORMULA_MASS = 58.44;
/** Sodium mass fraction in pure NaCl. */
export const NA_FRACTION_PURE_NACL = NA_ATOMIC_MASS / NACL_FORMULA_MASS;

/** Avoirdupois ounce → grams. */
export const GRAMS_PER_OUNCE = 28.349523125;
/** Level tablespoons per teaspoon. */
export const TSP_PER_TBSP = 3;

export const SOURCE_NOTE =
  'Educational worksheet: culinary Na per level teaspoon from Harvard Nutrition Source salt table; bulk grams/tsp for volume↔mass. Pure NaCl uses Na mass fraction 22.99/58.44 only (≈393 mg Na per 1 g NaCl). Not medical advice.';

export const DISCLAIMER =
  'Educational nutrition conversion only — not a diet prescription, medical advice, or brand-specific assay.';

export function parseNumber(raw: string): number | null {
  const t = raw.trim().replace(/,/g, '');
  if (t === '') return null;
  if (/infinity|nan/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function formatAmount(value: number | null, maxFractionDigits = 4): string {
  if (value == null || !Number.isFinite(value)) return '';
  if (Object.is(value, -0) || value === 0) return '0';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: 0,
    useGrouping: false,
  }).format(value);
}

/** Culinary salt display amount → grams (needs type density for volume units). */
export function saltAmountToGrams(
  amount: number,
  unit: SaltAmountUnit,
  saltType: SaltTypeId,
): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  const { gramsPerTeaspoon } = getSaltTypeOption(saltType);
  if (!(gramsPerTeaspoon > 0)) return null;
  switch (unit) {
    case 'g':
      return amount;
    case 'mg':
      return amount / 1000;
    case 'oz':
      return amount * GRAMS_PER_OUNCE;
    case 'tsp':
      return amount * gramsPerTeaspoon;
    case 'tbsp':
      return amount * TSP_PER_TBSP * gramsPerTeaspoon;
    default:
      return null;
  }
}

export function gramsToSaltAmount(
  grams: number,
  unit: SaltAmountUnit,
  saltType: SaltTypeId,
): number | null {
  if (!Number.isFinite(grams) || grams < 0) return null;
  const { gramsPerTeaspoon } = getSaltTypeOption(saltType);
  if (!(gramsPerTeaspoon > 0)) return null;
  switch (unit) {
    case 'g':
      return grams;
    case 'mg':
      return grams * 1000;
    case 'oz':
      return grams / GRAMS_PER_OUNCE;
    case 'tsp':
      return grams / gramsPerTeaspoon;
    case 'tbsp':
      return grams / (TSP_PER_TBSP * gramsPerTeaspoon);
    default:
      return null;
  }
}

export function sodiumAmountToMg(amount: number, unit: SodiumUnit): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  return unit === 'g' ? amount * 1000 : amount;
}

export function mgToSodiumAmount(mg: number, unit: SodiumUnit): number | null {
  if (!Number.isFinite(mg) || mg < 0) return null;
  return unit === 'g' ? mg / 1000 : mg;
}

export function pureAmountToGrams(amount: number, unit: PureSaltUnit): number | null {
  if (!Number.isFinite(amount) || amount < 0) return null;
  return unit === 'mg' ? amount / 1000 : amount;
}

export function gramsToPureAmount(grams: number, unit: PureSaltUnit): number | null {
  if (!Number.isFinite(grams) || grams < 0) return null;
  return unit === 'mg' ? grams * 1000 : grams;
}

function emptyResult(partial?: Partial<SodiumInSaltResult>): SodiumInSaltResult {
  return {
    saltType: 'iodized_table_fine',
    source: 'salt',
    saltGrams: null,
    saltTeaspoons: null,
    sodiumMg: null,
    pureNaClGrams: null,
    statusHeadline: 'Enter salt, sodium, or pure NaCl',
    statusDetail:
      'Choose a salt type, then enter any one amount. The other fields update from teaspoon sodium density and NaCl stoichiometry (22.99/58.44).',
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
    ...partial,
  };
}

/** Stub — real sodium/salt math lands in the engine commit. */
export function calculateSodiumInSalt(input: SodiumInSaltInput): SodiumInSaltResult {
  return emptyResult({ saltType: input.saltType, source: input.source });
}
