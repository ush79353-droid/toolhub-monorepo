/**
 * Focused Karvonen engine self-check (no test framework).
 * Run: npx tsx src/tools/calculators/karvonen-formula/calculation.test.ts
 */

import {
  calculateKarvonen,
  foxMaximumHr,
  formatBpm,
  heartRateReserve,
  karvonenTargetHr,
} from './calculation';
import { createDefaultInput } from './types';
import { validateKarvonenInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function nearly(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// Fixture from prompt: rest 60 / max 180 → reserve 120, target 144 at 70%
assert(heartRateReserve(180, 60) === 120, 'HRR 180-60');
assert(nearly(karvonenTargetHr(60, 180, 70), 144), 'THR 144');
assert(foxMaximumHr(40) === 180, 'Fox 220-40');

const known = calculateKarvonen({
  restingHrText: '60',
  knowMaxHr: 'yes',
  maximumHrText: '180',
  ageText: '',
  intensityText: '70',
});
assert(known.heartRateReserveBpm === 120, 'result reserve');
assert(known.targetHrBpm === 144, 'result target');
assert(known.formattedTargetHr === '144', 'format target');
assert(known.formattedReserve === '120', 'format reserve');

const unknown = calculateKarvonen({
  restingHrText: '60',
  knowMaxHr: 'no',
  maximumHrText: '',
  ageText: '40',
  intensityText: '70',
});
assert(unknown.maximumHrBpm === 180, 'age-derived max');
assert(unknown.targetHrBpm === 144, 'age path target');

const badOrder = calculateKarvonen({
  restingHrText: '180',
  knowMaxHr: 'yes',
  maximumHrText: '60',
  ageText: '',
  intensityText: '70',
});
assert(badOrder.targetHrBpm === null, 'max <= rest withheld');

const incomplete = calculateKarvonen(createDefaultInput());
assert(incomplete.targetHrBpm === null, 'defaults incomplete');

const invalid = validateKarvonenInput({
  ...createDefaultInput(),
  restingHrText: 'abc',
});
assert(invalid.result === null, 'invalid resting blocks');
assert(Boolean(invalid.errors.restingHrText), 'resting error');

const overIntensity = validateKarvonenInput({
  restingHrText: '60',
  knowMaxHr: 'yes',
  maximumHrText: '180',
  ageText: '',
  intensityText: '150',
});
assert(overIntensity.result === null, 'intensity >100 blocks');

assert(formatBpm(144) === '144', 'format int');
assert(formatBpm(144.25) === '144.3', 'format one decimal');

console.log('karvonen-formula calculation.test.ts: ok');
