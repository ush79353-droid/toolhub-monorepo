/**
 * Identity self-check vs blood-pregnancy-hcg engine.
 * Run: npx tsx src/tools/calculators/pregnancy-test/calculation.test.ts
 */
import { calculateBloodPregnancyHcg } from '../blood-pregnancy-hcg/calculation';
import { createEmptyInput } from '../blood-pregnancy-hcg/types';
import {
  calculatePregnancyTest,
  sharePregnancyTestText,
} from './calculation';
import { validatePregnancyTestInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const input = {
  ...createEmptyInput(),
  lastPeriodIso: '2026-01-01',
  cycleLengthDaysText: '28',
};

const a = calculatePregnancyTest(input);
const b = calculateBloodPregnancyHcg(input);
assert(a != null && b != null, 'both');
assert(a!.ovulationIso === b!.ovulationIso, 'ovulation identity');
assert(a!.naturalUrineIso === b!.naturalUrineIso, 'urine identity');
assert(a!.naturalBloodIso === b!.naturalBloodIso, 'blood identity');
assert(a!.ovulationIso === '2026-01-15', 'LMP+14 for 28d cycle');

const v = validatePregnancyTestInput(input);
assert(v.result != null, 'validate');

const share = sharePregnancyTestText(
  'https://example.com/tools/pregnancy-test-calculator',
);
assert(!share.includes('2026-01-01'), 'share omits LMP');
assert(share.includes('pregnancy-test-calculator'), 'slug');

console.log('pregnancy-test calculation.test.ts: ok');
