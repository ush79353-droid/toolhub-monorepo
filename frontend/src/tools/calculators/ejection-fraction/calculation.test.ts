/**
 * Self-check: npx tsx calculation.test.ts
 */
import {
  ejectionFractionPercent,
  strokeVolumeFromCoHr,
  strokeVolumeFromEsv,
} from './calculation';

function assert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(msg);
}

function approx(a: number, b: number, eps = 1e-9): boolean {
  return Math.abs(a - b) <= eps;
}

// Prompt: EDV 120 · SV 72 · ESV 48 · CO 5.04 · HR 70 → EF 60%
assert(approx(ejectionFractionPercent(72, 120)!, 60), 'SV mode 60%');
assert(approx(strokeVolumeFromEsv(120, 48)!, 72), 'ESV → SV 72');
assert(approx(ejectionFractionPercent(72, 120)!, 60), 'ESV path 60%');
assert(approx(strokeVolumeFromCoHr(5.04, 70)!, 72), 'CO/HR → SV 72');
assert(approx(ejectionFractionPercent(72, 120)!, 60), 'CO path 60%');

assert(strokeVolumeFromEsv(120, 130) == null, 'ESV > EDV rejected');
assert(strokeVolumeFromCoHr(5, 0) == null, 'HR 0 rejected');
assert(ejectionFractionPercent(72, 0) == null, 'EDV 0 rejected');
assert(ejectionFractionPercent(130, 120) == null, 'SV > EDV rejected');

console.log('ejection-fraction calculation.test.ts: ok');
