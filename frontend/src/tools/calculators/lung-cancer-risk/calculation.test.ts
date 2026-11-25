/**
 * Run: npx tsx src/tools/calculators/lung-cancer-risk/calculation.test.ts
 */

import {
  calculateLungCancerRisk,
  packYears,
  prognosticIndex16,
  risk16FromXb,
  risk6FromXb,
  S0_16,
  computeBmiKgM2,
} from './calculation';
import { createDefaultInput, createExampleInput } from './types';
import { validateLungCancerRiskInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(packYears(20, 40) === 40, 'pack-years 20×40/20');
assert(Math.abs(computeBmiKgM2(80, 1.75) - 26.122) < 0.01, 'BMI 80/1.75²');

const example = calculateLungCancerRisk(createExampleInput());
assert(example.packYears === 40, 'example pack-years');
assert(example.risk6Percent > 0 && example.risk6Percent < 50, `6y ${example.risk6Percent}`);
assert(example.risk16Percent > example.risk6Percent, '16y > 6y for heavy history');
assert(example.risk16Percent < 80, `16y bounded ${example.risk16Percent}`);

// Cox transform sanity: Xb=0 → 1 − 0.06^1 = 0.94
assert(Math.abs(risk16FromXb(0) - (1 - S0_16)) < 1e-9, 'Xb0 risk');
assert(risk6FromXb(0) === 0.5, 'logistic Xb0');

const xb = prognosticIndex16({
  male: 1,
  ageYears: 65,
  packYears: 40,
  cigarettesPerDay: 20,
  quitYears: 0,
  bmi: computeBmiKgM2(80, 1.75),
  smokeHours: 0,
  cough: 0,
});
assert(Number.isFinite(xb), 'xb finite');
assert(
  Math.abs(risk16FromXb(xb) - example.risk16Percent / 100) < 1e-9,
  '16y matches index',
);

const blank = validateLungCancerRiskInput(createDefaultInput());
assert(blank.result === null, 'blank → no result');
assert(blank.isValid === false, 'blank invalid');

const neverSmoker = validateLungCancerRiskInput({
  ...createExampleInput(),
  smokingYears: 0,
});
assert(neverSmoker.result === null, 'reject zero smoking years');

const cigLow = validateLungCancerRiskInput({
  ...createExampleInput(),
  cigarettesPerDay: 1,
});
assert(cigLow.result === null, 'reject cig < 2');

const lbIn = calculateLungCancerRisk({
  ...createExampleInput(),
  weight: 176.37,
  weightUnit: 'lb',
  height: 68.8976,
  heightUnit: 'in',
});
assert(Math.abs(lbIn.bmi - example.bmi) < 0.15, 'lb/in ≈ kg/cm BMI');
assert(Math.abs(lbIn.risk16Percent - example.risk16Percent) < 0.5, 'unit parity');

console.log('lung-cancer-risk calculation.test.ts: ok');
console.log(
  `  example 6y=${example.formattedRisk6} 16y=${example.formattedRisk16} BMI=${example.formattedBmi}`,
);
