/**
 * Runnable self-check for ECG boxes → seconds.
 * Run: npx tsx src/tools/calculators/ecg-boxes-to-seconds/calculation.test.ts
 */
import {
  BIG_BOX_MM,
  SMALL_BOX_MM,
  boxWidthMm,
  calculateEcgBoxesToSeconds,
  durationSecondsFromBoxes,
  formatDurationDisplay,
  secondsToDurationUnit,
} from './calculation';
import { validateEcgBoxesToSecondsInput } from './validation';
import type { EcgBoxesToSecondsInput } from './types';

function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

function nearlyEqual(a: number, b: number, eps = 1e-12): boolean {
  return Math.abs(a - b) <= eps;
}

assert(boxWidthMm('small') === SMALL_BOX_MM, 'small width');
assert(boxWidthMm('big') === BIG_BOX_MM, 'big width');
assert(SMALL_BOX_MM * 5 === BIG_BOX_MM, 'five small = one big');

// Prompt fixtures
assert(
  nearlyEqual(durationSecondsFromBoxes(1, 'small', 25)!, 0.04),
  '1 small @ 25 = 0.04 s'
);
assert(
  nearlyEqual(durationSecondsFromBoxes(1, 'big', 50)!, 0.1),
  '1 big @ 50 = 0.10 s'
);
assert(
  nearlyEqual(
    durationSecondsFromBoxes(5, 'small', 25)!,
    durationSecondsFromBoxes(1, 'big', 25)!
  ),
  '5 small = 1 big @ 25'
);

assert(durationSecondsFromBoxes(-1, 'small', 25) === null, 'reject negative');
assert(secondsToDurationUnit(0.04, 'ms') === 40, '0.04 s → 40 ms');
assert(nearlyEqual(secondsToDurationUnit(60, 'min'), 1), '60 s → 1 min');
assert(formatDurationDisplay(0.04, 'sec') === '0.04', 'format 0.04');

const base: EcgBoxesToSecondsInput = {
  boxCount: '1',
  boxType: 'small',
  paperSpeed: 25,
  durationUnit: 'sec',
};

const ok = validateEcgBoxesToSecondsInput(base);
assert(ok.isValid && ok.result, 'valid example');
assert(nearlyEqual(ok.result!.durationSeconds, 0.04), 'result seconds');
assert(ok.result!.formattedDuration === '0.04', 'formatted');

const blank = validateEcgBoxesToSecondsInput({ ...base, boxCount: '' });
assert(!blank.isValid && blank.result === null, 'blank stays empty');

const neg = validateEcgBoxesToSecondsInput({ ...base, boxCount: '-1' });
assert(!neg.isValid && neg.errors.boxCount, 'negative rejected');

const ms = calculateEcgBoxesToSeconds(
  { ...base, durationUnit: 'ms' },
  1
)!;
assert(ms.formattedDuration === '40', 'unit switch preserves interval as 40 ms');

console.log('ecg-boxes-to-seconds calculation.test.ts: ok');
