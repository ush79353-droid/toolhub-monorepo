/**
 * Sodium in Salt Calculator — assert self-check (run: npx tsx calculation.test.ts).
 */

import {
  NA_ATOMIC_MASS,
  NA_FRACTION_PURE_NACL,
  NACL_FORMULA_MASS,
  calculateSodiumInSalt,
  pureNaClGramsFromSodiumMg,
  saltAmountToGrams,
  sodiumMgFromPureNaClGrams,
  sodiumMgFromSaltGrams,
  teaspoonsFromSaltGrams,
} from './calculation';
import { createDefaultInput, getSaltTypeOption } from './types';
import { validateSodiumInSaltInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, tol = 1e-6): boolean {
  return Math.abs(a - b) <= tol;
}

// --- Stoichiometry: 1 g pure NaCl ≈ 393 mg sodium; inverse ---
assert(NA_ATOMIC_MASS === 22.99, 'Na atomic mass');
assert(NACL_FORMULA_MASS === 58.44, 'NaCl formula mass');
assert(
  approx(NA_FRACTION_PURE_NACL, 22.99 / 58.44),
  'fraction is 22.99/58.44',
);

const naFrom1g = sodiumMgFromPureNaClGrams(1);
assert(approx(naFrom1g, 393.395, 0.01), `1 g NaCl → ~393 mg Na, got ${naFrom1g}`);
const back = pureNaClGramsFromSodiumMg(naFrom1g);
assert(approx(back, 1, 1e-9), `inverse pure grams ${back}`);

const pureFrom393 = pureNaClGramsFromSodiumMg(393.395);
assert(approx(pureFrom393, 1, 0.001), `393.395 mg Na → ~1 g NaCl, got ${pureFrom393}`);

// --- Fine vs coarse volumetric density (same 1 tsp) ---
const table = getSaltTypeOption('iodized_table_fine');
const coarse = getSaltTypeOption('sea_coarse');
assert(table.sodiumMgPerTeaspoon === 2300, 'table Na/tsp');
assert(coarse.sodiumMgPerTeaspoon === 1560, 'coarse sea Na/tsp');
assert(
  table.gramsPerTeaspoon > coarse.gramsPerTeaspoon,
  'fine denser than coarse sea',
);

const table1tspG = saltAmountToGrams(1, 'tsp', 'iodized_table_fine');
const coarse1tspG = saltAmountToGrams(1, 'tsp', 'sea_coarse');
assert(table1tspG === 6, `table 1 tsp = 6 g, got ${table1tspG}`);
assert(coarse1tspG === 4, `coarse sea 1 tsp = 4 g, got ${coarse1tspG}`);

const tableNa = sodiumMgFromSaltGrams(table1tspG!, 'iodized_table_fine');
const coarseNa = sodiumMgFromSaltGrams(coarse1tspG!, 'sea_coarse');
assert(approx(tableNa, 2300), `table 1 tsp Na ${tableNa}`);
assert(approx(coarseNa, 1560), `coarse 1 tsp Na ${coarseNa}`);
assert(tableNa > coarseNa, 'fine tsp has more Na than coarse tsp');

// --- Omni-style example: 0.5 tsp table → 1150 mg Na ---
const half = createDefaultInput();
half.source = 'salt';
half.saltAmountText = '0.5';
half.saltUnit = 'tsp';
half.saltType = 'iodized_table_fine';
const halfR = calculateSodiumInSalt(half);
assert(halfR.sodiumMg != null && approx(halfR.sodiumMg, 1150), `0.5 tsp → 1150 mg, got ${halfR.sodiumMg}`);
assert(
  halfR.pureNaClGrams != null &&
    approx(halfR.pureNaClGrams, pureNaClGramsFromSodiumMg(1150), 1e-9),
  'pure matches stoichiometry',
);
assert(
  halfR.saltTeaspoons != null && approx(halfR.saltTeaspoons, 0.5),
  'teaspoons preserved',
);

// --- Inverse: sodium → salt ---
const fromNa = createDefaultInput();
fromNa.source = 'sodium';
fromNa.sodiumAmountText = '2300';
fromNa.sodiumUnit = 'mg';
fromNa.saltType = 'iodized_table_fine';
const fromNaR = calculateSodiumInSalt(fromNa);
assert(fromNaR.saltTeaspoons != null && approx(fromNaR.saltTeaspoons, 1), `2300 mg → 1 tsp, got ${fromNaR.saltTeaspoons}`);
assert(fromNaR.saltGrams != null && approx(fromNaR.saltGrams, 6), `2300 mg → 6 g salt`);

// --- Inverse: pure NaCl 1 g → ~393 mg Na ---
const fromPure = createDefaultInput();
fromPure.source = 'pure';
fromPure.pureSaltText = '1';
fromPure.pureUnit = 'g';
fromPure.saltType = 'iodized_table_fine';
const fromPureR = calculateSodiumInSalt(fromPure);
assert(
  fromPureR.sodiumMg != null && approx(fromPureR.sodiumMg, naFrom1g, 1e-6),
  `1 g pure → ${fromPureR.sodiumMg} mg`,
);

// --- tbsp = 3 tsp ---
const tbsp = createDefaultInput();
tbsp.source = 'salt';
tbsp.saltAmountText = '1';
tbsp.saltUnit = 'tbsp';
tbsp.saltType = 'iodized_table_fine';
const tbspR = calculateSodiumInSalt(tbsp);
assert(tbspR.sodiumMg != null && approx(tbspR.sodiumMg, 6900), `1 tbsp → 6900 mg, got ${tbspR.sodiumMg}`);

// --- Potassium substitute: salt → 0 Na ---
const kSalt = createDefaultInput();
kSalt.source = 'salt';
kSalt.saltType = 'potassium_substitute';
kSalt.saltAmountText = '1';
kSalt.saltUnit = 'tsp';
const kR = calculateSodiumInSalt(kSalt);
assert(kR.sodiumMg === 0, 'K-salt sodium 0');
assert(kR.pureNaClGrams === 0, 'K-salt pure 0');

// --- Validation rejects negatives ---
const bad = createDefaultInput();
bad.source = 'salt';
bad.saltAmountText = '-1';
const badV = validateSodiumInSaltInput(bad);
assert(badV.errors.saltAmountText != null, 'negative salt error');
assert(badV.result === null, 'no result on error');

// --- Blank → empty guidance ---
const blank = calculateSodiumInSalt(createDefaultInput());
assert(blank.sodiumMg === null, 'blank sodium null');
assert(blank.saltGrams === null, 'blank salt null');

// --- teaspoonsFromSaltGrams ---
assert(
  teaspoonsFromSaltGrams(6, 'iodized_table_fine') === 1,
  '6 g table = 1 tsp',
);

console.log('All sodium-in-salt calculation tests passed.');
