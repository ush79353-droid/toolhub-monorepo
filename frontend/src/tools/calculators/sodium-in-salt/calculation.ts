/**
 * Sodium in Salt Calculator — pure engine (ADR-018).
 *
 * Culinary volume → sodium via Harvard Nutrition Source mg Na per level teaspoon
 * (and measured bulk grams/tsp for mass↔volume). Pure NaCl ↔ sodium uses only the
 * published atomic-mass ratio 22.99/58.44.
 *
 * Bidirectional: last-edited field (salt | sodium | pure) drives the other two.
 * Potassium salt substitute: sodium and pure NaCl are always 0.
 *
 * Sources: Harvard T.H. Chan School of Public Health — Salt and Sodium table;
 * USDA FDC table-salt teaspoon mass (~6 g); IUPAC-style atomic masses Na 22.99,
 * Cl 35.45 → NaCl 58.44.
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
/** Sodium mass fraction in pure NaCl = 22.99/58.44. */
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

/** mg sodium from grams of pure NaCl via 22.99/58.44. */
export function sodiumMgFromPureNaClGrams(pureGrams: number): number {
  return pureGrams * 1000 * NA_FRACTION_PURE_NACL;
}

/** grams pure NaCl from mg sodium via 22.99/58.44. */
export function pureNaClGramsFromSodiumMg(sodiumMg: number): number {
  return sodiumMg / (1000 * NA_FRACTION_PURE_NACL);
}

/**
 * Culinary product: sodium mg from mass using type Na-density
 * (sodiumMgPerTeaspoon / gramsPerTeaspoon).
 */
export function sodiumMgFromSaltGrams(
  saltGrams: number,
  saltType: SaltTypeId,
): number {
  const opt = getSaltTypeOption(saltType);
  if (!(opt.gramsPerTeaspoon > 0)) return 0;
  return saltGrams * (opt.sodiumMgPerTeaspoon / opt.gramsPerTeaspoon);
}

/** Culinary product mass from sodium using type Na-density. */
export function saltGramsFromSodiumMg(
  sodiumMg: number,
  saltType: SaltTypeId,
): number | null {
  const opt = getSaltTypeOption(saltType);
  if (!(opt.gramsPerTeaspoon > 0)) return null;
  if (opt.sodiumMgPerTeaspoon <= 0) {
    // Potassium substitute: cannot invert sodium→salt (always 0 Na).
    return null;
  }
  return sodiumMg / (opt.sodiumMgPerTeaspoon / opt.gramsPerTeaspoon);
}

export function teaspoonsFromSaltGrams(
  saltGrams: number,
  saltType: SaltTypeId,
): number | null {
  const opt = getSaltTypeOption(saltType);
  if (!(opt.gramsPerTeaspoon > 0)) return null;
  return saltGrams / opt.gramsPerTeaspoon;
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

function buildResult(args: {
  saltType: SaltTypeId;
  source: SodiumInSaltInput['source'];
  saltGrams: number | null;
  sodiumMg: number;
  pureNaClGrams: number;
}): SodiumInSaltResult {
  const opt = getSaltTypeOption(args.saltType);
  const tsp =
    args.saltGrams != null
      ? teaspoonsFromSaltGrams(args.saltGrams, args.saltType)
      : null;
  const detail =
    opt.sodiumMgPerTeaspoon === 0
      ? `${opt.label}: 0 mg sodium per teaspoon (potassium substitute). Pure NaCl uses 22.99/58.44 from the sodium amount; culinary mass is not inferred from sodium.`
      : `${opt.label}: ${formatAmount(opt.sodiumMgPerTeaspoon, 0)} mg Na / tsp · ${formatAmount(opt.gramsPerTeaspoon, 1)} g/tsp → ${formatAmount(args.sodiumMg, 1)} mg Na; pure NaCl ${formatAmount(args.pureNaClGrams)} g (22.99/58.44).`;

  return {
    saltType: args.saltType,
    source: args.source,
    saltGrams: args.saltGrams,
    saltTeaspoons: tsp,
    sodiumMg: args.sodiumMg,
    pureNaClGrams: args.pureNaClGrams,
    statusHeadline: 'Sodium in salt',
    statusDetail: detail,
    sourceNote: SOURCE_NOTE,
    disclaimer: DISCLAIMER,
  };
}

export function calculateSodiumInSalt(input: SodiumInSaltInput): SodiumInSaltResult {
  if (input.source === 'salt') {
    const raw = parseNumber(input.saltAmountText);
    if (raw === null) {
      return emptyResult({ saltType: input.saltType, source: 'salt' });
    }
    const saltGrams = saltAmountToGrams(raw, input.saltUnit, input.saltType);
    if (saltGrams === null) {
      return emptyResult({ saltType: input.saltType, source: 'salt' });
    }
    const sodiumMg = sodiumMgFromSaltGrams(saltGrams, input.saltType);
    const pureNaClGrams = pureNaClGramsFromSodiumMg(sodiumMg);
    return buildResult({
      saltType: input.saltType,
      source: 'salt',
      saltGrams,
      sodiumMg,
      pureNaClGrams,
    });
  }

  if (input.source === 'sodium') {
    const raw = parseNumber(input.sodiumAmountText);
    if (raw === null) {
      return emptyResult({ saltType: input.saltType, source: 'sodium' });
    }
    const sodiumMg = sodiumAmountToMg(raw, input.sodiumUnit);
    if (sodiumMg === null) {
      return emptyResult({ saltType: input.saltType, source: 'sodium' });
    }
    const pureNaClGrams = pureNaClGramsFromSodiumMg(sodiumMg);
    const saltGrams = saltGramsFromSodiumMg(sodiumMg, input.saltType);
    return buildResult({
      saltType: input.saltType,
      source: 'sodium',
      saltGrams,
      sodiumMg,
      pureNaClGrams,
    });
  }

  // source === 'pure'
  const raw = parseNumber(input.pureSaltText);
  if (raw === null) {
    return emptyResult({ saltType: input.saltType, source: 'pure' });
  }
  const pureNaClGrams = pureAmountToGrams(raw, input.pureUnit);
  if (pureNaClGrams === null) {
    return emptyResult({ saltType: input.saltType, source: 'pure' });
  }
  const sodiumMg = sodiumMgFromPureNaClGrams(pureNaClGrams);
  const saltGrams = saltGramsFromSodiumMg(sodiumMg, input.saltType);
  return buildResult({
    saltType: input.saltType,
    source: 'pure',
    saltGrams,
    sodiumMg,
    pureNaClGrams,
  });
}
