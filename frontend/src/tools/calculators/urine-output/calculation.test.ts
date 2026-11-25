/**
 * Urine output — assert-based engine check (Ponytail).
 * Run: npx tsx src/tools/calculators/urine-output/calculation.test.ts
 */

import {
  calculateUrineOutput,
  interpretRate,
  urineOutputRateMlKgHr,
  volumeToMl,
  weightToKg,
} from './calculation';
import { createDefaultInput } from './types';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

assert(
  urineOutputRateMlKgHr(1680, 70, 24) === 1,
  'fixture 1680/70/24 → 1 mL/kg/h',
);

const fixture = calculateUrineOutput({
  ...createDefaultInput(),
  weightText: '70',
  timeText: '24',
  urineText: '1680',
});
assert(fixture.rateMlKgHr === 1, `expected rate 1, got ${fixture.rateMlKgHr}`);
assert(fixture.fluidBalanceMl === null, 'no intake → balance null');

const withIntake = calculateUrineOutput({
  ...createDefaultInput(),
  weightText: '70',
  timeText: '24',
  urineText: '1680',
  intakeText: '2000',
});
assert(withIntake.fluidBalanceMl === 320, `balance 320, got ${withIntake.fluidBalanceMl}`);
assert(
  /insensible/i.test(withIntake.balanceNote ?? ''),
  'balance note mentions omitted losses',
);

const pediatric = calculateUrineOutput({
  ...createDefaultInput(),
  ageGroup: 'pediatric',
  weightText: '20',
  timeText: '24',
  urineText: '400',
});
assert(pediatric.rateMlKgHr === 0.83, `pediatric rate 0.83, got ${pediatric.rateMlKgHr}`);
assert(
  interpretRate('pediatric', 0.8).includes('<1'),
  'pediatric oliguria cutoff 1',
);
assert(
  interpretRate('adult', 0.4).includes('0.5'),
  'adult oliguria cutoff 0.5',
);

assert(volumeToMl(1.5, 'L') === 1500, 'L→mL');
assert(approx(weightToKg(154.323, 'lb'), 70, 0.01), 'lb→kg');

const missing = calculateUrineOutput({
  ...createDefaultInput(),
  weightText: '70',
  timeText: '24',
  urineText: '',
});
assert(missing.rateMlKgHr === null, 'missing urine → no rate');

console.log('urine-output calculation.test.ts: ok');