import {
  calculateInsulinDosage,
  carbCoverageUnits,
  correctionUnits,
  convertGlucoseValue,
  suggestedIcrFromTdd,
  suggestedIsfMgDlFromTdd,
} from './calculation';
import { createDefaultInput } from './types';
import { validateInsulinDosageInput } from './validation';

function assert(cond: unknown, msg: string): void {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, tol = 1e-9): boolean {
  return Math.abs(a - b) <= tol;
}

assert(approx(carbCoverageUnits(45, 15), 3), 'carb 45/15');
assert(approx(correctionUnits(200, 100, 50), 2), 'corr 100/50');
assert(correctionUnits(90, 100, 50) === 0, 'below target → 0');
assert(correctionUnits(100, 100, 50) === 0, 'at target → 0');

assert(approx(suggestedIcrFromTdd(50)!, 10), 'rule 500');
assert(approx(suggestedIsfMgDlFromTdd(50)!, 36), 'rule 1800');

assert(
  approx(convertGlucoseValue(180, 'mg/dL', 'mmol/L'), 180 / 18.0182, 1e-6),
  'mgdl→mmol',
);

{
  const input = {
    ...createDefaultInput(),
    carbsGrams: '60',
    currentGlucose: '200',
  };
  const r = calculateInsulinDosage(input)!;
  assert(approx(r.carbCoverageUnits!, 4), 'cov');
  assert(approx(r.correctionUnits!, 2), 'cor');
  assert(approx(r.totalUnits!, 6), 'tot');
}

{
  const input = {
    ...createDefaultInput(),
    knowTotalDailyDose: true,
    totalDailyDose: '40',
    carbsGrams: '',
    currentGlucose: '',
  };
  const r = calculateInsulinDosage(input)!;
  assert(r.suggestedCarbRatio != null, 'suggested icr');
  assert(r.carbCoverageUnits == null, 'no cov');
  assert(r.notes.some((n) => n.includes('not applied automatically')), 'note');
}

{
  let threw = false;
  try {
    carbCoverageUnits(10, 0);
  } catch {
    threw = true;
  }
  assert(threw, 'zero ratio');
}

{
  const v = validateInsulinDosageInput({
    ...createDefaultInput(),
    carbRatio: '0',
    carbsGrams: '10',
  });
  assert(!v.isValid && v.errors.carbRatio, 'nonpositive ratio blocked');
}

{
  const v = validateInsulinDosageInput(createDefaultInput());
  assert(!v.isValid && v.result == null, 'blank meal → no result');
}

console.log('insulin-dosage calculation.test.ts: ok');
