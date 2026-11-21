import { calculateBloodPregnancyHcg } from '../blood-pregnancy-hcg/calculation';
import { createEmptyInput } from '../blood-pregnancy-hcg/types';
import {
  ARTICLE_THESIS,
  calculateFalseNegativePregnancyTest,
  shareFalseNegativePregnancyTestText,
} from './calculation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

const input = { ...createEmptyInput(), lastPeriodIso: '2026-01-01' };
const a = calculateFalseNegativePregnancyTest(input);
const b = calculateBloodPregnancyHcg(input);
assert(a != null && b != null, 'both');
assert(a!.naturalUrineIso === b!.naturalUrineIso, 'urine identity');
assert(ARTICLE_THESIS.toLowerCase().includes('false-negative'), 'thesis');
const share = shareFalseNegativePregnancyTestText(
  'https://example.com/tools/what-is-a-false-negative-pregnancy-test',
);
assert(!share.includes('2026-01-01'), 'privacy');
console.log('false-negative-pregnancy-test calculation.test.ts: ok');
