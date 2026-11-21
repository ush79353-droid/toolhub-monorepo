/**
 * Self-check for Breastfeeding Calorie Calculator (IOM/DRI EER).
 * Run: npx tsx src/tools/calculators/breastfeeding-calorie/calculation.test.ts
 */

import {
  calculateBreastfeedingCalorie,
  formatKcal,
  nonPregnantEerKcal,
  parseNumber,
  heightToMeters,
  weightToKg,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateBreastfeedingCalorieInput } from './validation';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function nearly(a: number, b: number, tol = 0.5): boolean {
  return Math.abs(a - b) <= tol;
}

// --- Units ---
assert(nearly(heightToMeters(165, 'cm'), 1.65, 1e-9), '165 cm → 1.65 m');
assert(nearly(weightToKg(65, 'kg'), 65, 1e-9), '65 kg');
assert(nearly(weightToKg(143.3, 'lb'), 65, 0.05), '~143.3 lb → ~65 kg');

// --- Adult sedentary non-pregnant EER ---
// 30 y, 65 kg, 1.65 m, PA=1.0
// 354 − 6.91×30 + 1×(9.36×65 + 726×1.65)
// = 354 − 207.3 + (608.4 + 1197.9) = 146.7 + 1806.3 = 1953
const eerAdult = nonPregnantEerKcal({
  ageYears: 30,
  weightKg: 65,
  heightMeters: 1.65,
  pa: 1.0,
  ageBand: 'adult',
});
assert(nearly(eerAdult, 1953, 0.6), `adult EER ≈ 1953, got ${eerAdult}`);

// Lactation 0–6 → +330
const example = createExampleInput();
const r0 = calculateBreastfeedingCalorie(example);
assert(r0, 'example result');
assert(
  nearly(r0.dailyEnergyNeedsKcal, eerAdult + 330, 0.6),
  `lactation 0–6 daily ≈ ${eerAdult + 330}, got ${r0.dailyEnergyNeedsKcal}`,
);
assert(r0.energyAdditionKcal === 330, 'addition 330');
assert(formatKcal(r0.dailyEnergyNeedsKcal) === r0.formattedDailyEnergyNeeds, 'format');

// Lactation >6 → +400
const r1 = calculateBreastfeedingCalorie({
  ...example,
  state: 'lactation_gt_6',
});
assert(r1 && nearly(r1.dailyEnergyNeedsKcal, eerAdult + 400, 0.6), 'lactation >6 +400');

// Pregnancy trimesters
const t1 = calculateBreastfeedingCalorie({ ...example, state: 'pregnancy_t1' });
const t2 = calculateBreastfeedingCalorie({ ...example, state: 'pregnancy_t2' });
const t3 = calculateBreastfeedingCalorie({ ...example, state: 'pregnancy_t3' });
assert(t1 && nearly(t1.dailyEnergyNeedsKcal, eerAdult + 0, 0.6), 'T1 +0');
assert(t2 && nearly(t2.dailyEnergyNeedsKcal, eerAdult + 340, 0.6), 'T2 +340');
assert(t3 && nearly(t3.dailyEnergyNeedsKcal, eerAdult + 452, 0.6), 'T3 +452');

// Low-active PA 1.12 increases EER
const low = calculateBreastfeedingCalorie({
  ...example,
  activity: 'low_active',
  state: 'pregnancy_t1',
});
assert(low && low.dailyEnergyNeedsKcal > eerAdult, 'low active > sedentary');

// Adolescent 16 y PA=1.0
// EER = 135.3 − 30.8×16 + 1×(10×65 + 934×1.65) + 25
// = 135.3 − 492.8 + (650 + 1541.1) + 25 = −357.5 + 2191.1 + 25 = 1858.6
const teenEer = nonPregnantEerKcal({
  ageYears: 16,
  weightKg: 65,
  heightMeters: 1.65,
  pa: 1.0,
  ageBand: 'adolescent',
});
assert(nearly(teenEer, 1858.6, 0.6), `teen EER ≈ 1858.6, got ${teenEer}`);
const teen = calculateBreastfeedingCalorie({
  ...example,
  age: '16',
  state: 'lactation_0_6',
});
assert(
  teen && nearly(teen.dailyEnergyNeedsKcal, teenEer + 330, 0.6),
  'teen lactation',
);

// Empty defaults → no result, valid
const empty = validateBreastfeedingCalorieInput(createDefaultInput());
assert(empty.isValid && empty.result === null, 'empty valid');

// Age too young
const young = validateBreastfeedingCalorieInput({
  ...example,
  age: '12',
});
assert(!young.isValid && young.errors.age, 'age 12 rejected');

// Partial fill
const partial = validateBreastfeedingCalorieInput({
  ...createDefaultInput(),
  age: '30',
});
assert(!partial.isValid && partial.errors.height && partial.errors.weight, 'partial');

// parseNumber
assert(parseNumber('1,953') === 1953, 'comma parse');
assert(parseNumber('') === null, 'blank parse');

console.log('breastfeeding-calorie calculation.test.ts: ok');
