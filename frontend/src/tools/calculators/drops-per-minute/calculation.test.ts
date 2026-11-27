/**
 * Focused drops-per-minute self-check.
 * Run: npx tsx src/tools/calculators/drops-per-minute/calculation.test.ts
 */

import {
  calculateDropsPerMinute,
  dropsPerMinute,
  mlPerHour,
} from './calculation';
import { createDefaultInput } from './types';
import { validateDropsPerMinuteInput } from './validation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

assert(dropsPerMinute(100, 15, 60) === 25, '25 gtts/min');
assert(mlPerHour(100, 60) === 100, '100 mL/h');

const r = calculateDropsPerMinute({
  volumeText: '100',
  volumeUnit: 'mL',
  timeText: '60',
  timeUnit: 'min',
  dropFactorText: '15',
});
assert(r.dropsPerMinute === 25, 'dpm');
assert(r.dropsPerHour === 1500, 'dph');
assert(r.mlPerHour === 100, 'rate');

const blank = calculateDropsPerMinute(createDefaultInput());
assert(blank.dropsPerMinute === null, 'blank');

const bad = validateDropsPerMinuteInput({
  ...createDefaultInput(),
  volumeText: '100',
  timeText: '0',
});
assert(bad.result === null, 'time 0 blocks');

console.log('drops-per-minute calculation.test.ts: ok');
