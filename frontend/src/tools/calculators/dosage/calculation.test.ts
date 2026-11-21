/**
 * Run: npx tsx src/tools/calculators/dosage/calculation.test.ts
 */
import {
  calculateDosage,
  computeDoseMasses,
  liquidMlFromDoseMg,
  massToMg,
  mgToMass,
  weightToKg,
} from './calculation';
import { createEmptyInput, createExampleInput } from './types';
import { validateDosageInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(Math.abs(weightToKg(1, 'lb') - 0.45359237) < 1e-12, 'lb');
assert(massToMg(1, 'g') === 1000, 'g→mg');
assert(massToMg(1000, 'mcg') === 1, 'mcg→mg');
assert(mgToMass(1, 'mcg') === 1000, 'mg→mcg');

const once = computeDoseMasses(10, 15, 'per_day', 1);
assert(once.perDay === 150 && once.perAdmin === 150, 'once/day');

const twice = computeDoseMasses(10, 15, 'per_day', 2);
assert(twice.perDay === 150 && twice.perAdmin === 75, 'twice per day split');

const perAdmin = computeDoseMasses(10, 15, 'per_administration', 2);
assert(perAdmin.perAdmin === 150 && perAdmin.perDay === 300, 'per admin ×2');

assert(liquidMlFromDoseMg(150, 25) === 6, '6 mL');

const ex = calculateDosage(createExampleInput());
assert(ex != null, 'example');
assert(ex!.dosePerAdmin === 150, `dose ${ex!.dosePerAdmin}`);
assert(ex!.liquidMl === 6, `ml ${ex!.liquidMl}`);

const empty = validateDosageInput(createEmptyInput());
assert(!empty.isValid, 'empty invalid');

const mcg = calculateDosage({
  ...createExampleInput(),
  dosagePerKg: '15',
  dosageMassUnit: 'mcg',
  concentration: '25',
  concentrationUnit: 'mcg/mL',
});
assert(mcg?.dosePerAdmin === 150, 'mcg dose');
assert(
  mcg?.liquidMl != null && Math.abs(mcg.liquidMl - 6) < 1e-10,
  `mcg liquid ${mcg?.liquidMl}`,
);

console.log('dosage calculation.test.ts: all asserts passed');
